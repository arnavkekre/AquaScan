import pytest
import numpy as np
import cv2
from src.acoustic_filter import apply_lee_filter, apply_clahe, compute_image_metrics, preprocess_sonar_image


def test_lee_filter_noise_reduction():
    # Create synthetic sonar image with Rayleigh speckle noise
    np.random.seed(42)
    base = np.full((128, 128), 100, dtype=np.float32)
    speckle = np.random.exponential(scale=1.0, size=(128, 128)).astype(np.float32)
    noisy = np.clip(base * speckle, 0, 255).astype(np.uint8)

    filtered = apply_lee_filter(noisy, kernel_size=7)

    assert filtered.shape == noisy.shape
    assert filtered.dtype == np.uint8
    # Filtered image should have lower standard deviation (noise reduced)
    assert np.std(filtered) < np.std(noisy)


def test_clahe_contrast_enhancement():
    # Low contrast gray patch
    low_contrast = np.full((100, 100), 120, dtype=np.uint8)
    low_contrast[40:60, 40:60] = 135  # Subtle highlight

    enhanced = apply_clahe(low_contrast, clip_limit=2.5, grid_size=(8, 8))

    assert enhanced.shape == low_contrast.shape
    # Dynamic range should be expanded
    assert np.max(enhanced) - np.min(enhanced) >= np.max(low_contrast) - np.min(low_contrast)


def test_preprocess_sonar_pipeline():
    dummy_img = np.random.randint(0, 255, (200, 200, 3), dtype=np.uint8)
    despeckled, enhanced, metrics = preprocess_sonar_image(dummy_img, kernel_size=7)

    assert despeckled.shape == dummy_img.shape
    assert enhanced.shape == dummy_img.shape
    assert "raw_sni" in metrics
    assert "enhanced_sni" in metrics
    assert "noise_reduction_pct" in metrics
