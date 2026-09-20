import pytest
from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPERATIONAL"
    assert "available_classes" in data
    assert "submarine_pipeline" in data["available_classes"].values()


def test_samples_endpoint():
    response = client.get("/api/samples")
    assert response.status_code == 200
    samples = response.json()
    assert isinstance(samples, list)
    assert len(samples) > 0
    filenames = [s["filename"] for s in samples]
    assert any("pipe" in fn for fn in filenames)


def test_simulate_mission():
    response = client.get("/api/mission/simulate")
    assert response.status_code == 200
    data = response.json()
    assert "waypoints" in data
    assert len(data["waypoints"]) > 0
    assert "detected_hazards" in data
    assert len(data["detected_hazards"]) > 0
