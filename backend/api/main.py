"""
AquaScan FastAPI Application Server
===================================
Production-grade REST API for SSS acoustic processing, ONNX AI detection,
spatial geotagging, and MoES/NIOT mission export.
"""

import os
import sys
import base64
import json
import time
from typing import List, Optional
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse

# Add parent directory to sys.path for internal imports
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from src.acoustic_filter import preprocess_sonar_image
from src.detector import SonarDetector
from src.geotagger import GeotaggingEngine
from src.reporter import MissionReporter
from api.schemas import (
    TelemetryData,
    DetectionResponse,
    DetectionItem,
    SpatialLocalization,
    SampleTileInfo,
    SystemHealthResponse
)

# App initialization
app = FastAPI(
    title="AquaScan SSS Marine Debris API",
    version="1.0.0",
    description="Automated Acoustic Preprocessing, YOLOv8 ONNX Detection, and Geotagging for MoES/NIOT"
)

# CORS configuration for Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
detector = SonarDetector()
geotagger = GeotaggingEngine()

# In-memory mission store for current session's findings
MISSION_DETECTIONS: List[dict] = []


def bgr_to_base64(img_bgr: np.ndarray, quality: int = 90) -> str:
    """Encodes BGR numpy image to base64 jpeg data URL."""
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
    _, buffer = cv2.imencode('.jpg', img_bgr, encode_param)
    b64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{b64_str}"


def draw_detection_overlays(img_bgr: np.ndarray, detections: List[dict]) -> np.ndarray:
    """Draws high-visibility hydrographic bounding boxes and labels."""
    vis = img_bgr.copy()
    for det in detections:
        x1, y1, x2, y2 = det["box_xyxy"]
        name = det["display_name"]
        conf = det["confidence_pct"]
        color_hex = det.get("color", "#00F0FF").lstrip('#')
        # Convert hex to BGR
        r = int(color_hex[0:2], 16)
        g = int(color_hex[2:4], 16)
        b = int(color_hex[4:6], 16)
        color_bgr = (b, g, r)

        # Draw bounding rectangle
        cv2.rectangle(vis, (x1, y1), (x2, y2), color_bgr, 2)

        # Draw label background
        label = f"{name} {conf}%"
        (lw, lh), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
        cv2.rectangle(vis, (x1, max(0, y1 - lh - 8)), (x1 + lw + 6, max(lh + 8, y1)), color_bgr, -1)
        cv2.putText(vis, label, (x1 + 3, max(lh + 4, y1 - 4)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

        # Draw acoustic shadow estimate vector if available
        shadow = det.get("shadow_metrics", {})
        shadow_len_px = int(shadow.get("estimated_shadow_length_px", 0))
        if shadow_len_px > 5:
            cv2.line(vis, (x2, (y1 + y2) // 2), (min(vis.shape[1] - 1, x2 + shadow_len_px), (y1 + y2) // 2), (0, 255, 255), 1, cv2.LINE_AA)

    return vis


@app.get("/api/health", response_model=SystemHealthResponse)
def get_health():
    """System diagnostic, model weights, and edge readiness."""
    meta = detector.metadata
    return SystemHealthResponse(
        status="OPERATIONAL",
        model_loaded=detector.is_ready(),
        model_path=detector.model_path,
        model_architecture=meta.get("architecture", "YOLOv8s-Sonar"),
        dataset=meta.get("dataset", "rehan9599/drishti-sss"),
        device="CPU (ONNX Runtime)" if detector.is_ready() else "Unavailable",
        available_classes=detector.class_names,
        key_metrics=meta.get("metrics", {})
    )


@app.get("/api/samples", response_model=List[SampleTileInfo])
def list_samples():
    """Returns bundled real sonar test tiles with ground truth metadata."""
    sample_dir = os.path.join(BACKEND_DIR, "data", "sample_tiles")
    samples = []

    tile_catalog = {
        "pipe_1693569432.789_x1500.jpg": {
            "title": "Subsea Pipeline Section (High Reflectivity Linear Asset)",
            "type": "Pipeline Infrastructure",
            "class": "submarine_pipeline"
        },
        "wreckA_Monrovia_02_y1047_x1088.jpg": {
            "title": "Monrovia Cargo Shipwreck - Bow Section & Shadow",
            "type": "Shipwreck Hazard",
            "class": "shipwreck"
        },
        "wreckA_Monrovia_05_y1043_x640.jpg": {
            "title": "Monrovia Wreck Amidships & Debris Field",
            "type": "Shipwreck Hazard",
            "class": "shipwreck"
        },
        "wreckA_Barge_No_1_15_y960_x960.jpg": {
            "title": "Barge #1 Submerged Hull Anomaly",
            "type": "Navigational Obstacle",
            "class": "shipwreck"
        },
        "bg_1693569446.790_x2500.jpg": {
            "title": "Natural Seafloor (Hard Negative Sand Ripples Baseline)",
            "type": "Clear Seabed (Baseline)",
            "class": "empty_seabed"
        }
    }

    if os.path.exists(sample_dir):
        for f in os.listdir(sample_dir):
            if f.lower().endswith(('.jpg', '.png', '.jpeg')):
                f_path = os.path.join(sample_dir, f)
                info = tile_catalog.get(f, {
                    "title": f"Sonar Tile: {f}",
                    "type": "Acoustic Target",
                    "class": "unknown"
                })
                samples.append(SampleTileInfo(
                    filename=f,
                    display_title=info["title"],
                    target_type=info["type"],
                    ground_truth_class=info["class"],
                    relative_path=f"data/sample_tiles/{f}",
                    filesize_bytes=os.path.getsize(f_path)
                ))
    return samples


def run_full_pipeline(img_bgr: np.ndarray, telemetry: TelemetryData, conf_threshold: float = 0.25) -> DetectionResponse:
    """Executes acoustic filtering -> ONNX detection -> spatial geotagging -> visualization."""
    t_start = time.time()

    # 1. Acoustic Preprocessing (Lee + CLAHE)
    despeckled_bgr, enhanced_bgr, speckle_metrics = preprocess_sonar_image(img_bgr, kernel_size=7)

    # 2. ONNX Detection on enhanced image
    detection_raw = detector.predict(enhanced_bgr, conf_threshold=conf_threshold)

    # 3. Geotagging and Protocol Assignment
    h, w = img_bgr.shape[:2]
    telemetry_dict = telemetry.model_dump()
    processed_detections: List[DetectionItem] = []

    for det in detection_raw["detections"]:
        spatial = geotagger.localize_detection(
            box_xyxy=det["box_xyxy"],
            img_width=w,
            img_height=h,
            auv_telemetry=telemetry_dict,
            shadow_metrics=det["shadow_metrics"]
        )
        protocol = MissionReporter.get_action_recommendation(det["class_name"], det["hazard_level"])

        det_item = DetectionItem(
            id=det["id"],
            class_id=det["class_id"],
            class_name=det["class_name"],
            display_name=det["display_name"],
            confidence=det["confidence"],
            confidence_pct=det["confidence_pct"],
            hazard_level=det["hazard_level"],
            color=det["color"],
            box_xyxy=det["box_xyxy"],
            box_xywh=det["box_xywh"],
            shadow_metrics=det["shadow_metrics"],
            spatial_localization=SpatialLocalization(**spatial),
            action_protocol=protocol
        )
        processed_detections.append(det_item)
        # Store in global mission session
        MISSION_DETECTIONS.append(det_item.model_dump())

    # 4. Generate visual overlay
    annotated_bgr = draw_detection_overlays(enhanced_bgr, [d.model_dump() for d in processed_detections])

    total_duration_ms = (time.time() - t_start) * 1000.0

    return DetectionResponse(
        success=True,
        detection_count=len(processed_detections),
        inference_time_ms=detection_raw.get("inference_time_ms", 0.0),
        total_latency_ms=round(total_duration_ms, 2),
        speckle_metrics=speckle_metrics,
        image_dimensions={"width": w, "height": h},
        raw_image_data=bgr_to_base64(img_bgr),
        despeckled_image_data=bgr_to_base64(despeckled_bgr),
        enhanced_image_data=bgr_to_base64(enhanced_bgr),
        annotated_image_data=bgr_to_base64(annotated_bgr),
        detections=processed_detections,
        telemetry=telemetry
    )


@app.post("/api/detect/sample/{filename}", response_model=DetectionResponse)
def detect_sample(
    filename: str,
    conf_threshold: float = Query(default=0.25, ge=0.05, le=0.95),
    latitude: float = Query(default=13.0827),
    longitude: float = Query(default=80.2707),
    altitude_m: float = Query(default=12.0),
    heading_deg: float = Query(default=45.0),
    swath_width_m: float = Query(default=100.0)
):
    """Processes a pre-loaded sample sonar tile with configurable AUV coordinates."""
    sample_path = os.path.join(BACKEND_DIR, "data", "sample_tiles", filename)
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail=f"Sample tile '{filename}' not found.")

    img = cv2.imread(sample_path)
    if img is None:
        raise HTTPException(status_code=400, detail=f"Unable to read image: {filename}")

    telemetry = TelemetryData(
        latitude=latitude,
        longitude=longitude,
        altitude_m=altitude_m,
        heading_deg=heading_deg,
        swath_width_m=swath_width_m,
        mission_name=f"TRANSECT_{filename.split('.')[0]}"
    )

    return run_full_pipeline(img, telemetry, conf_threshold=conf_threshold)


@app.post("/api/detect/upload", response_model=DetectionResponse)
async def detect_upload(
    file: UploadFile = File(...),
    conf_threshold: float = Form(default=0.25),
    latitude: float = Form(default=13.0827),
    longitude: float = Form(default=80.2707),
    altitude_m: float = Form(default=12.0),
    heading_deg: float = Form(default=45.0),
    swath_width_m: float = Form(default=100.0)
):
    """Processes a custom uploaded Side-Scan Sonar tile or GeoTIFF/PNG."""
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=400, detail="Invalid sonar image format.")

    telemetry = TelemetryData(
        latitude=latitude,
        longitude=longitude,
        altitude_m=altitude_m,
        heading_deg=heading_deg,
        swath_width_m=swath_width_m,
        mission_name="UPLOADED_SONAR_SWATH"
    )

    return run_full_pipeline(img, telemetry, conf_threshold=conf_threshold)


@app.get("/api/mission/simulate")
def simulate_mission_trackline():
    """
    Returns an AUV lawnmower survey trackline with simulated detections
    spanning a coastal survey zone off Chennai / NIOT testing grounds.
    """
    base_lat, base_lon = 13.0827, 80.2707
    waypoints = []
    hazards = []

    # 5 lawnmower legs
    for leg in range(5):
        leg_lat = base_lat + (leg * 0.003)
        lon_start = base_lon
        lon_end = base_lon + 0.015 if leg % 2 == 0 else base_lon - 0.002
        step = 0.003 if leg % 2 == 0 else -0.003

        curr_lon = lon_start
        while (curr_lon <= lon_end if step > 0 else curr_lon >= lon_end):
            waypoints.append({
                "lat": round(leg_lat, 6),
                "lon": round(curr_lon, 6),
                "altitude_m": 12.0,
                "depth_m": 35.0 + (leg * 4),
                "heading_deg": 90.0 if step > 0 else 270.0
            })
            curr_lon += step

    # Pre-populate sample hazards along the survey path
    hazards = [
        {
            "id": "HAZ_001",
            "class_name": "ghost_net",
            "display_name": "Derelict Fishing Net (Ghost Gear)",
            "latitude": 13.0832,
            "longitude": 80.2735,
            "confidence_pct": 98.6,
            "hazard_level": "Critical Ecological Threat",
            "priority": "P1 - URGENT RECOVERY",
            "estimated_length_m": 14.2,
            "height_off_seabed_m": 2.8,
            "color": "#EF4444"
        },
        {
            "id": "HAZ_002",
            "class_name": "submarine_pipeline",
            "display_name": "Subsea Fuel Pipeline Span",
            "latitude": 13.0861,
            "longitude": 80.2780,
            "confidence_pct": 99.4,
            "hazard_level": "Infrastructure Asset",
            "priority": "P2 - INTEGRITY CHECK",
            "estimated_length_m": 62.0,
            "height_off_seabed_m": 0.4,
            "color": "#10B981"
        },
        {
            "id": "HAZ_003",
            "class_name": "shipwreck",
            "display_name": "Monrovia Wreck Hull Section",
            "latitude": 13.0894,
            "longitude": 80.2752,
            "confidence_pct": 94.2,
            "hazard_level": "Navigation Hazard",
            "priority": "P3 - NOTMAR CHARTING",
            "estimated_length_m": 28.5,
            "height_off_seabed_m": 5.1,
            "color": "#3B82F6"
        },
        {
            "id": "HAZ_004",
            "class_name": "mine_cylinder",
            "display_name": "Unexploded Cylinder / Mine",
            "latitude": 13.0920,
            "longitude": 80.2815,
            "confidence_pct": 91.0,
            "hazard_level": "High Threat UXO",
            "priority": "P1 - HAZMAT EXCLUSION",
            "estimated_length_m": 2.1,
            "height_off_seabed_m": 0.9,
            "color": "#F59E0B"
        }
    ]

    return {
        "mission_id": "NIOT_BAY_OF_BENGAL_EXPEDITION_26",
        "survey_area_sq_km": 1.45,
        "trackline_km": 8.2,
        "waypoint_count": len(waypoints),
        "waypoints": waypoints,
        "detected_hazards": hazards
    }


@app.get("/api/export/geojson")
def export_geojson():
    """Exports current session detections as RFC 7946 GeoJSON."""
    geojson_data = MissionReporter.generate_geojson(MISSION_DETECTIONS, mission_name="AQUASCAN_NIOT_CLEARANCE")
    return Response(
        content=json.dumps(geojson_data, indent=2),
        media_type="application/geo+json",
        headers={"Content-Disposition": "attachment; filename=aquascan_debris_clearance.geojson"}
    )


@app.get("/api/export/csv")
def export_csv():
    """Exports current session detections as NIOT survey clearance CSV."""
    csv_str = MissionReporter.generate_csv(MISSION_DETECTIONS)
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=aquascan_marine_debris_log.csv"}
    )
