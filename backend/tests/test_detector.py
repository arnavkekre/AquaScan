import pytest
import os
import numpy as np
from src.detector import SonarDetector


def test_detector_initialization():
    detector = SonarDetector()
    assert detector is not None
    assert "0" in detector.class_names
    assert "ghost_net" in detector.class_names.values()
    assert "submarine_pipeline" in detector.class_names.values()


def test_letterbox_shape():
    detector = SonarDetector()
    dummy = np.zeros((480, 640, 3), dtype=np.uint8)
    boxed, ratio, (dw, dh) = detector.letterbox(dummy, new_shape=(640, 640))
    assert boxed.shape == (640, 640, 3)
    assert ratio <= 1.0


def test_inference_on_sample():
    detector = SonarDetector()
    if not detector.is_ready():
        pytest.skip("ONNX model or onnxruntime not yet initialized in test runner")

    # Load actual sample tile if present
    sample_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "data", "sample_tiles", "pipe_1693569432.789_x1500.jpg"
    )
    if os.path.exists(sample_path):
        import cv2
        img = cv2.imread(sample_path)
        res = detector.predict(img, conf_threshold=0.20)
        assert "detections" in res
        assert "inference_time_ms" in res
        assert res["inference_time_ms"] > 0
