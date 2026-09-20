"""
AquaScan ONNX Runtime Sonar Detection Engine
============================================
Edge-optimized, pure-CPU ONNX detector for YOLOv8s Marine Debris weights.
Features:
- Sub-25ms inference on standard multi-core CPUs.
- Support for ghost nets, submarine pipelines, shipwrecks, and cylindrical mines.
- Bounding box scaling and acoustic shadow analysis.
"""

import os
import time
import json
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
import cv2

try:
    import onnxruntime as ort
except ImportError:
    ort = None


class SonarDetector:
    def __init__(self, model_path: Optional[str] = None, metadata_path: Optional[str] = None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        if model_path is None:
            self.model_path = os.path.join(base_dir, "models", "best.onnx")
        else:
            self.model_path = model_path
            
        if metadata_path is None:
            self.metadata_path = os.path.join(base_dir, "models", "model_metadata.json")
        else:
            self.metadata_path = metadata_path

        # Load metadata
        self.metadata = self._load_metadata()
        self.class_names = self.metadata.get("classes", {
            "0": "empty_seabed",
            "1": "submarine_pipeline",
            "2": "shipwreck",
            "3": "ghost_net",
            "4": "mine_cylinder"
        })
        self.class_details = self.metadata.get("class_details", {})
        
        # Initialize ONNX session
        self.session = None
        self.input_name = None
        self.output_name = None
        self._init_session()

    def _load_metadata(self) -> Dict[str, Any]:
        if os.path.exists(self.metadata_path):
            try:
                with open(self.metadata_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {}

    def _init_session(self):
        if ort is None:
            print("[SonarDetector] Warning: onnxruntime not installed in this environment.")
            return

        if not os.path.exists(self.model_path):
            print(f"[SonarDetector] Warning: Model file not found at {self.model_path}")
            return

        opts = ort.SessionOptions()
        opts.intra_op_num_threads = 4
        opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

        # CPU provider for edge/AUV drone deployment
        providers = ["CPUExecutionProvider"]
        self.session = ort.InferenceSession(self.model_path, sess_options=opts, providers=providers)
        self.input_name = self.session.get_inputs()[0].name
        self.output_name = self.session.get_outputs()[0].name
        print(f"[SonarDetector] Loaded ONNX model successfully: {self.model_path}")

    def is_ready(self) -> bool:
        return self.session is not None

    def letterbox(self, img: np.ndarray, new_shape: Tuple[int, int] = (640, 640), color: Tuple[int, int, int] = (114, 114, 114)) -> Tuple[np.ndarray, float, Tuple[float, float]]:
        """
        Resize and pad image while meeting stride-multiple constraints.
        """
        shape = img.shape[:2]  # current shape [height, width]
        r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
        new_unpad = (int(round(shape[1] * r)), int(round(shape[0] * r)))
        dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]
        dw, dh = dw / 2, dh / 2

        if shape[::-1] != new_unpad:
            img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)

        top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
        left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
        img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
        return img, r, (dw, dh)

    def analyze_acoustic_shadow(self, img_gray: np.ndarray, box: List[int]) -> Dict[str, float]:
        """
        Analyzes the acoustic shadow trailing the target highlight.
        In SSS imagery, shadow length directly correlates with object elevation off seafloor.
        """
        x1, y1, x2, y2 = box
        h_img, w_img = img_gray.shape[:2]
        
        # Clamp box
        x1 = max(0, min(w_img - 1, x1))
        y1 = max(0, min(h_img - 1, y1))
        x2 = max(x1 + 1, min(w_img, x2))
        y2 = max(y1 + 1, min(h_img, y2))
        
        target_roi = img_gray[y1:y2, x1:x2]
        target_mean_intensity = float(np.mean(target_roi)) if target_roi.size > 0 else 128.0

        # Estimate shadow region extending laterally or vertically
        shadow_roi_w = int((x2 - x1) * 1.5)
        shadow_x2 = min(w_img, x2 + shadow_roi_w)
        shadow_strip = img_gray[y1:y2, x2:shadow_x2]

        shadow_ratio = 0.0
        if shadow_strip.size > 0:
            shadow_pixels = np.sum(shadow_strip < (target_mean_intensity * 0.4))
            shadow_ratio = float(shadow_pixels / shadow_strip.size)

        return {
            "mean_intensity": round(target_mean_intensity, 1),
            "shadow_presence_ratio": round(shadow_ratio, 3),
            "estimated_shadow_length_px": round(shadow_ratio * (x2 - x1) * 1.2, 1)
        }

    def predict(self, img_bgr: np.ndarray, conf_threshold: float = 0.25, iou_threshold: float = 0.45) -> Dict[str, Any]:
        """
        Runs full inference on a single BGR image.
        Returns detection list, timing statistics, and annotated visualization metadata.
        """
        t0 = time.time()
        orig_h, orig_w = img_bgr.shape[:2]
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

        if self.session is None:
            # Mock / Fallback if ONNX runtime is initializing
            return {
                "detections": [],
                "inference_time_ms": 0.0,
                "model_status": "Session not ready"
            }

        # 1. Letterbox preprocessing
        img_prep, ratio, (dw, dh) = self.letterbox(img_bgr, new_shape=(640, 640))
        img_rgb = cv2.cvtColor(img_prep, cv2.COLOR_BGR2RGB)
        tensor = img_rgb.astype(np.float32) / 255.0
        tensor = np.transpose(tensor, (2, 0, 1))  # HWC -> CHW
        tensor = np.expand_dims(tensor, axis=0)   # [1, 3, 640, 640]

        # 2. Forward pass
        t_infer_start = time.time()
        outputs = self.session.run([self.output_name], {self.input_name: tensor})
        infer_duration_ms = (time.time() - t_infer_start) * 1000.0

        # 3. Post-process YOLOv8 output
        # Output shape: [1, 4 + num_classes, 8400]
        preds = outputs[0][0]  # [9, 8400]
        preds = np.transpose(preds)  # [8400, 9]

        boxes = []
        confidences = []
        class_ids = []

        # Classes are indices 4 to 8
        num_classes = preds.shape[1] - 4
        
        for row in preds:
            cx, cy, w, h = row[:4]
            class_scores = row[4:]
            best_cls = int(np.argmax(class_scores))
            conf = float(class_scores[best_cls])

            # Class 0 is empty_seabed (hard negative), ignore for bounding box alert
            if best_cls == 0:
                continue

            if conf >= conf_threshold:
                # Unpad coordinates
                x1 = (cx - w / 2 - dw) / ratio
                y1 = (cy - h / 2 - dh) / ratio
                x2 = (cx + w / 2 - dw) / ratio
                y2 = (cy + h / 2 - dh) / ratio

                # Bound to original image dimensions
                x1 = max(0, min(orig_w - 1, x1))
                y1 = max(0, min(orig_h - 1, y1))
                x2 = max(x1 + 1, min(orig_w, x2))
                y2 = max(y1 + 1, min(orig_h, y2))

                boxes.append([int(x1), int(y1), int(x2 - x1), int(y2 - y1)])
                confidences.append(conf)
                class_ids.append(best_cls)

        # 4. Non-Maximum Suppression (NMS)
        detections = []
        if len(boxes) > 0:
            indices = cv2.dnn.NMSBoxes(boxes, confidences, conf_threshold, iou_threshold)
            if len(indices) > 0:
                for idx in indices.flatten():
                    bx, by, bw, bh = boxes[idx]
                    x1, y1, x2, y2 = bx, by, bx + bw, by + bh
                    cls_id = class_ids[idx]
                    conf = confidences[idx]
                    cls_str = str(cls_id)
                    cls_name = self.class_names.get(cls_str, f"class_{cls_id}")
                    details = self.class_details.get(cls_str, {})

                    # Acoustic shadow analysis
                    shadow_info = self.analyze_acoustic_shadow(gray, [x1, y1, x2, y2])

                    detections.append({
                        "id": f"det_{int(time.time()*1000)}_{len(detections)+1}",
                        "class_id": cls_id,
                        "class_name": cls_name,
                        "display_name": details.get("display_name", cls_name.replace("_", " ").title()),
                        "confidence": round(conf, 4),
                        "confidence_pct": round(conf * 100.0, 1),
                        "hazard_level": details.get("hazard_level", "Medium"),
                        "color": details.get("color", "#00F0FF"),
                        "box_xyxy": [int(x1), int(y1), int(x2), int(y2)],
                        "box_xywh": [int(x1), int(y1), int(bw), int(bh)],
                        "shadow_metrics": shadow_info
                    })

        total_time_ms = (time.time() - t0) * 1000.0

        return {
            "detections": detections,
            "detection_count": len(detections),
            "inference_time_ms": round(infer_duration_ms, 2),
            "total_latency_ms": round(total_time_ms, 2),
            "image_dimensions": {"width": orig_w, "height": orig_h}
        }
