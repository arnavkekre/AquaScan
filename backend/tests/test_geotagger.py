import pytest
import math
from src.geotagger import GeotaggingEngine


def test_slant_to_ground_range():
    geo = GeotaggingEngine()
    # Right triangle 3-4-5: altitude=15m, ground=20m -> slant=25m
    altitude = 15.0
    slant_range = 25.0
    ground_range = geo.slant_to_ground_range(slant_range, altitude)
    assert pytest.approx(ground_range, 0.01) == 20.0

    # Inside nadir blind zone (slant < altitude)
    assert geo.slant_to_ground_range(10.0, 15.0) == 0.0


def test_shadow_height_estimation():
    geo = GeotaggingEngine()
    # h = (H * L_s) / R_s
    # H = 10m, L_s = 6m, R_s = 30m -> h = (10 * 6) / 30 = 2.0m
    h = geo.estimate_object_height(shadow_length_m=6.0, slant_range_m=30.0, altitude_m=10.0)
    assert pytest.approx(h, 0.01) == 2.0


def test_wgs84_coordinate_projection():
    geo = GeotaggingEngine()
    auv_lat, auv_lon = 13.0827, 80.2707
    heading = 0.0  # Heading North

    # Object 111.32 meters to Starboard (East)
    target_lat, target_lon = geo.calculate_wgs84_coordinates(
        auv_lat=auv_lat,
        auv_lon=auv_lon,
        auv_heading_deg=heading,
        across_track_m=111.32,
        along_track_m=0.0
    )

    # Latitude should remain nearly identical, longitude should increase
    assert pytest.approx(target_lat, 0.0001) == auv_lat
    assert target_lon > auv_lon
