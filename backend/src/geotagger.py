"""
AquaScan Acoustic Geotagging & Spatial Localization Engine
===========================================================
Translates 2D Side-Scan Sonar (SSS) pixel offsets into physical seafloor dimensions
and real-world WGS-84 Geographic Coordinates (Latitude, Longitude).

Acoustic Geometric Principles:
1. Slant-Range to Ground-Range Correction:
       G = sqrt(R_s^2 - H^2)
   where H = AUV Altitude above seabed, R_s = Slant Range.

2. Object Height Estimation via Acoustic Shadow:
       h = (H * L_s) / R_s
   where L_s = Acoustic Shadow Length, H = Towfish/AUV Altitude.

3. WGS-84 Geodetic Projection:
   Converts along-track and across-track metric offsets to Lat/Lon
   given AUV position (lat0, lon0) and heading (yaw).
"""

import math
from typing import Dict, Any, List, Optional, Tuple


class GeotaggingEngine:
    METERS_PER_DEG_LAT = 111320.0  # meters per degree latitude

    def __init__(self, default_swath_width_m: float = 100.0, default_alt_m: float = 15.0):
        self.default_swath_width_m = default_swath_width_m
        self.default_alt_m = default_alt_m

    def slant_to_ground_range(self, slant_range_m: float, altitude_m: float) -> float:
        """
        Pythagorean slant-range correction.
        If slant range is less than altitude (inside water column / nadir blind zone), returns 0.
        """
        if slant_range_m <= altitude_m:
            return 0.0
        return math.sqrt(slant_range_m ** 2 - altitude_m ** 2)

    def estimate_object_height(self, shadow_length_m: float, slant_range_m: float, altitude_m: float) -> float:
        """
        Acoustic shadow height formula:
            h = (H * L_s) / R_s
        """
        if slant_range_m <= 0:
            return 0.0
        h = (altitude_m * shadow_length_m) / slant_range_m
        return max(0.0, round(h, 2))

    def calculate_wgs84_coordinates(
        self,
        auv_lat: float,
        auv_lon: float,
        auv_heading_deg: float,
        across_track_m: float,
        along_track_m: float = 0.0
    ) -> Tuple[float, float]:
        """
        Projects local Cartesian metric offset (across-track, along-track) onto WGS-84.
        - across_track_m: positive for starboard (right), negative for port (left)
        - along_track_m: positive forward along heading
        - auv_heading_deg: heading angle clockwise from True North (0 = North, 90 = East)
        """
        heading_rad = math.radians(auv_heading_deg)
        
        # Heading vector in standard navigational frame (0 = North, 90 = East)
        # Along-track moves along heading; Across-track moves perpendicular (heading + 90 deg)
        delta_north = (math.cos(heading_rad) * along_track_m) - (math.sin(heading_rad) * across_track_m)
        delta_east  = (math.sin(heading_rad) * along_track_m) + (math.cos(heading_rad) * across_track_m)

        # Convert meters to degrees
        delta_lat = delta_north / self.METERS_PER_DEG_LAT
        meters_per_deg_lon = self.METERS_PER_DEG_LAT * math.cos(math.radians(auv_lat))
        delta_lon = delta_east / (meters_per_deg_lon + 1e-9)

        target_lat = auv_lat + delta_lat
        target_lon = auv_lon + delta_lon

        return round(target_lat, 7), round(target_lon, 7)

    def localize_detection(
        self,
        box_xyxy: List[int],
        img_width: int,
        img_height: int,
        auv_telemetry: Optional[Dict[str, Any]] = None,
        shadow_metrics: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Computes real-world physical dimensions and geographic location for a detected bounding box.
        """
        if auv_telemetry is None:
            auv_telemetry = {
                "latitude": 13.0827,       # Default NIOT Chennai coastal coordinates
                "longitude": 80.2707,
                "altitude_m": 12.0,
                "depth_m": 45.0,
                "heading_deg": 45.0,
                "swath_width_m": 100.0
            }

        auv_lat = float(auv_telemetry.get("latitude", 13.0827))
        auv_lon = float(auv_telemetry.get("longitude", 80.2707))
        auv_alt = float(auv_telemetry.get("altitude_m", 12.0))
        auv_heading = float(auv_telemetry.get("heading_deg", 45.0))
        swath_width = float(auv_telemetry.get("swath_width_m", 100.0))

        # Resolution: meters per pixel
        # Standard SSS image spans the full swath width laterally
        meters_per_pixel = swath_width / float(img_width)

        x1, y1, x2, y2 = box_xyxy
        box_center_x = (x1 + x2) / 2.0
        box_w_px = max(1, x2 - x1)
        box_h_px = max(1, y2 - y1)

        # Cross-track offset from nadir (image center X represents AUV trackline in dual-side scan)
        # or left-to-right slant range in single-channel tile
        nadir_x = img_width / 2.0
        across_track_m = (box_center_x - nadir_x) * meters_per_pixel

        # Slant range approximation
        slant_range_m = math.sqrt(across_track_m ** 2 + auv_alt ** 2)
        ground_range_m = self.slant_to_ground_range(slant_range_m, auv_alt)

        # Physical dimensions
        phys_length_m = round(box_w_px * meters_per_pixel, 2)
        phys_width_m = round(box_h_px * meters_per_pixel, 2)

        # Shadow height estimation
        shadow_px = shadow_metrics.get("estimated_shadow_length_px", 0.0) if shadow_metrics else 0.0
        shadow_length_m = shadow_px * meters_per_pixel
        estimated_height_m = self.estimate_object_height(shadow_length_m, slant_range_m, auv_alt)

        # WGS-84 Localization
        target_lat, target_lon = self.calculate_wgs84_coordinates(
            auv_lat=auv_lat,
            auv_lon=auv_lon,
            auv_heading_deg=auv_heading,
            across_track_m=across_track_m,
            along_track_m=0.0
        )

        return {
            "target_latitude": target_lat,
            "target_longitude": target_lon,
            "across_track_distance_m": round(across_track_m, 2),
            "ground_range_m": round(ground_range_m, 2),
            "slant_range_m": round(slant_range_m, 2),
            "estimated_length_m": max(0.5, phys_length_m),
            "estimated_width_m": max(0.5, phys_width_m),
            "estimated_height_off_seabed_m": estimated_height_m,
            "meters_per_pixel": round(meters_per_pixel, 4),
            "telemetry_context": {
                "auv_lat": auv_lat,
                "auv_lon": auv_lon,
                "auv_alt": auv_alt,
                "auv_heading": auv_heading
            }
        }
