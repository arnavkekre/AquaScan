"""
AquaScan Pydantic Data Schemas
==============================
Defines request/response contracts for FastAPI endpoints.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class TelemetryData(BaseModel):
    latitude: float = Field(default=13.0827, description="AUV Latitude in decimal degrees")
    longitude: float = Field(default=80.2707, description="AUV Longitude in decimal degrees")
    altitude_m: float = Field(default=12.0, description="Towfish / AUV altitude off seafloor in meters")
    depth_m: float = Field(default=45.0, description="Seabed water column depth in meters")
    heading_deg: float = Field(default=45.0, description="Compass heading in degrees (0-360)")
    swath_width_m: float = Field(default=100.0, description="Total acoustic swath coverage width in meters")
    speed_knots: float = Field(default=3.5, description="AUV survey transect speed in knots")
    mission_name: str = Field(default="NIOT_SSS_TRANSECT_01", description="Survey identifier")


class SpatialLocalization(BaseModel):
    target_latitude: float
    target_longitude: float
    across_track_distance_m: float
    ground_range_m: float
    slant_range_m: float
    estimated_length_m: float
    estimated_width_m: float
    estimated_height_off_seabed_m: float
    meters_per_pixel: float
    telemetry_context: Dict[str, Any]


class DetectionItem(BaseModel):
    id: str
    class_id: int
    class_name: str
    display_name: str
    confidence: float
    confidence_pct: float
    hazard_level: str
    color: str
    box_xyxy: List[int]
    box_xywh: List[int]
    shadow_metrics: Dict[str, Any]
    spatial_localization: SpatialLocalization
    action_protocol: Dict[str, str]


class DetectionResponse(BaseModel):
    success: bool
    detection_count: int
    inference_time_ms: float
    total_latency_ms: float
    speckle_metrics: Dict[str, Any]
    image_dimensions: Dict[str, int]
    raw_image_data: Optional[str] = None
    despeckled_image_data: Optional[str] = None
    enhanced_image_data: Optional[str] = None
    annotated_image_data: Optional[str] = None
    detections: List[DetectionItem]
    telemetry: TelemetryData


class SampleTileInfo(BaseModel):
    filename: str
    display_title: str
    target_type: str
    ground_truth_class: str
    relative_path: str
    filesize_bytes: int


class SystemHealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_path: str
    model_architecture: str
    dataset: str
    device: str
    available_classes: Dict[str, str]
    key_metrics: Dict[str, Any]
