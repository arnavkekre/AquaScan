"""
AquaScan Mission Reporting & Export Engine
==========================================
Generates MoES / NIOT compliant hydrographic outputs:
1. Standard RFC 7946 GeoJSON FeatureCollections for GIS & Hydrographic Charting.
2. Structured CSV Clearance Logs for Marine Debris Recovery Vessels.
3. Mission Clearance & Ecological Impact Summaries.
"""

import os
import json
import csv
import io
from datetime import datetime
from typing import List, Dict, Any


class MissionReporter:
    @staticmethod
    def get_action_recommendation(class_name: str, hazard_level: str) -> Dict[str, str]:
        """
        Provides specific recovery protocol according to MoES / NIOT marine guidelines.
        """
        protocols = {
            "ghost_net": {
                "priority": "P1 - CRITICAL URGENT",
                "recommended_action": "Deploy ROV with hydraulic line cutters for immediate derelict net recovery.",
                "vessel_type": "MoES Coastal Research Vessel (CRV) / Fisheries Patrol",
                "ecological_threat": "High (Active ghost fishing of endangered marine life)"
            },
            "mine_cylinder": {
                "priority": "P1 - HAZMAT EMERGENCY",
                "recommended_action": "Mark 500m exclusion zone; notify Indian Navy EOD / Coast Guard.",
                "vessel_type": "Naval Mine Countermeasures Vessel (MCMV)",
                "ecological_threat": "Explosive risk & toxic chemical leaching"
            },
            "submarine_pipeline": {
                "priority": "P2 - INFRASTRUCTURE MONITORING",
                "recommended_action": "Verify pipeline integrity, burial depth, and free-span scouring.",
                "vessel_type": "Offshore Survey Vessel / Pipeline ROV",
                "ecological_threat": "Risk of hydrocarbon rupture if struck by trawl gear"
            },
            "shipwreck": {
                "priority": "P3 - NAVIGATIONAL HAZARD",
                "recommended_action": "Issue Notice to Mariners (NOTMAR); update National Hydrographic Office (NHO) charts.",
                "vessel_type": "Hydrographic Survey Vessel",
                "ecological_threat": "Navigation hazard & potential bunker fuel leakage"
            }
        }
        return protocols.get(class_name, {
            "priority": "P4 - ROUTINE",
            "recommended_action": "Routine seabed monitoring.",
            "vessel_type": "Survey AUV",
            "ecological_threat": "Low"
        })

    @classmethod
    def generate_geojson(cls, detections: List[Dict[str, Any]], mission_name: str = "AUV_TRANSECT_01") -> Dict[str, Any]:
        """
        Creates RFC 7946 GeoJSON FeatureCollection.
        """
        features = []
        for det in detections:
            loc = det.get("spatial_localization", {})
            lat = loc.get("target_latitude")
            lon = loc.get("target_longitude")

            if lat is None or lon is None:
                continue

            cls_name = det.get("class_name", "debris")
            action = cls.get_action_recommendation(cls_name, det.get("hazard_level", "Medium"))

            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]  # GeoJSON standard: [longitude, latitude]
                },
                "properties": {
                    "id": det.get("id"),
                    "mission": mission_name,
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "class_name": cls_name,
                    "display_name": det.get("display_name"),
                    "confidence_pct": det.get("confidence_pct"),
                    "hazard_level": det.get("hazard_level"),
                    "priority": action["priority"],
                    "action_required": action["recommended_action"],
                    "vessel_dispatch": action["vessel_type"],
                    "ecological_threat": action["ecological_threat"],
                    "estimated_length_m": loc.get("estimated_length_m", 0.0),
                    "estimated_width_m": loc.get("estimated_width_m", 0.0),
                    "height_off_seabed_m": loc.get("estimated_height_off_seabed_m", 0.0),
                    "across_track_m": loc.get("across_track_distance_m", 0.0),
                    "ground_range_m": loc.get("ground_range_m", 0.0)
                }
            }
            features.append(feature)

        return {
            "type": "FeatureCollection",
            "metadata": {
                "generator": "AquaScan Autonomous SSS Processor",
                "standards_compliance": "MoES / NIOT / IHO S-44 Order 1a",
                "mission_name": mission_name,
                "feature_count": len(features),
                "generated_at": datetime.utcnow().isoformat() + "Z"
            },
            "features": features
        }

    @classmethod
    def generate_csv(cls, detections: List[Dict[str, Any]]) -> str:
        """
        Generates CSV string format for marine hydrographic logs.
        """
        output = io.StringIO()
        fieldnames = [
            "Anomaly_ID", "Timestamp_UTC", "Hazard_Type", "Confidence_Pct",
            "Target_Latitude", "Target_Longitude", "Est_Length_m", "Est_Width_m",
            "Est_Height_m", "Across_Track_m", "Priority_Level", "Recommended_Action"
        ]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        for det in detections:
            loc = det.get("spatial_localization", {})
            cls_name = det.get("class_name", "unknown")
            action = cls.get_action_recommendation(cls_name, det.get("hazard_level", "Medium"))

            writer.writerow({
                "Anomaly_ID": det.get("id", ""),
                "Timestamp_UTC": now_str,
                "Hazard_Type": det.get("display_name", cls_name),
                "Confidence_Pct": det.get("confidence_pct", 0.0),
                "Target_Latitude": loc.get("target_latitude", ""),
                "Target_Longitude": loc.get("target_longitude", ""),
                "Est_Length_m": loc.get("estimated_length_m", 0.0),
                "Est_Width_m": loc.get("estimated_width_m", 0.0),
                "Est_Height_m": loc.get("estimated_height_off_seabed_m", 0.0),
                "Across_Track_m": loc.get("across_track_distance_m", 0.0),
                "Priority_Level": action["priority"],
                "Recommended_Action": action["recommended_action"]
            })

        return output.getvalue()
