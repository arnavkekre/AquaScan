"""
AquaScan Acoustic Preprocessing & Noise Filtering Module
=========================================================
Implements SSS-specific acoustic conditioning:
1. 7x7 Lee Speckle Filter (Local statistics variance-adaptive noise reduction)
2. CLAHE (Contrast-Limited Adaptive Histogram Equalization)
3. Speckle Noise Index (SNI) and Contrast-to-Noise Ratio (CNR) measurement
"""

import numpy as np
import cv2
from typing import Tuple, Dict, Any


def apply_lee_filter(img_gray: np.ndarray, kernel_size: int = 7) -> np.ndarray:
    """
    Applies the Lee Speckle Filter to an 8-bit or float single-channel sonar image.
    Lee filter formulation:
        I_hat = mean + W * (I - mean)
        where W = max(0, var_local - var_noise) / var_local
    """
    img_f = img_gray.astype(np.float32)
    kernel = np.ones((kernel_size, kernel_size), dtype=np.float32) / (kernel_size * kernel_size)

    # Local mean and local squared mean
    local_mean = cv2.filter2D(img_f, -1, kernel)
    local_sqr_mean = cv2.filter2D(img_f ** 2, -1, kernel)
    local_var = np.maximum(local_sqr_mean - local_mean ** 2, 0)

    # Estimate uniform noise variance from low-variance background regions
    noise_var = np.percentile(local_var, 25)

    # Compute weight factor W
    weight = np.where(local_var > 0, np.maximum(local_var - noise_var, 0) / (local_var + 1e-6), 0)
    weight = np.clip(weight, 0.0, 1.0)

    filtered = local_mean + weight * (img_f - local_mean)
    return np.clip(filtered, 0, 255).astype(np.uint8)


def apply_clahe(img_gray: np.ndarray, clip_limit: float = 2.5, grid_size: Tuple[int, int] = (8, 8)) -> np.ndarray:
    """
    Applies Contrast Limited Adaptive Histogram Equalization to accentuate
    subsea acoustic highlights and shadow boundaries without amplifying background noise.
    """
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=grid_size)
    return clahe.apply(img_gray)


def compute_image_metrics(raw_gray: np.ndarray, enhanced_gray: np.ndarray) -> Dict[str, float]:
    """
    Computes acoustic image quality metrics:
    - Speckle Noise Index (SNI = std / mean) lower is cleaner
    - Dynamic Range expansion (peak-to-peak)
    - Contrast Improvement Ratio
    """
    raw_mean = float(np.mean(raw_gray)) + 1e-6
    raw_std = float(np.std(raw_gray))
    raw_sni = raw_std / raw_mean

    enh_mean = float(np.mean(enhanced_gray)) + 1e-6
    enh_std = float(np.std(enhanced_gray))
    enh_sni = enh_std / enh_mean

    # Noise suppression percentage
    noise_reduction_pct = max(0.0, min(100.0, (1.0 - enh_sni / raw_sni) * 100.0))

    return {
        "raw_sni": round(raw_sni, 4),
        "enhanced_sni": round(enh_sni, 4),
        "noise_reduction_pct": round(noise_reduction_pct, 2),
        "raw_contrast": round(raw_std, 2),
        "enhanced_contrast": round(enh_std, 2)
    }


def preprocess_sonar_image(img_bgr: np.ndarray, kernel_size: int = 7) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
    """
    Full acoustic pipeline:
    Input: BGR or Grayscale image
    Output: (despeckled_bgr, enhanced_bgr, metrics_dict)
    """
    if len(img_bgr.shape) == 3:
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    else:
        gray = img_bgr.copy()
        img_bgr = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

    # 1. Lee Despeckling
    lee_filtered = apply_lee_filter(gray, kernel_size=kernel_size)

    # 2. CLAHE Contrast Equalization
    clahe_enhanced = apply_clahe(lee_filtered, clip_limit=2.5, grid_size=(8, 8))

    # 3. Metrics
    metrics = compute_image_metrics(gray, clahe_enhanced)

    # Convert back to 3-channel for neural network ingestion and frontend display
    despeckled_bgr = cv2.cvtColor(lee_filtered, cv2.COLOR_GRAY2BGR)
    enhanced_bgr = cv2.cvtColor(clahe_enhanced, cv2.COLOR_GRAY2BGR)

    return despeckled_bgr, enhanced_bgr, metrics
