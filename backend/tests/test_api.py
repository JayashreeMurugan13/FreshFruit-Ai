import os
import sys
import io
from PIL import Image
import pytest
from fastapi.testclient import TestClient

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.main import app
from app.database import db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_db():
    db.init_db()

def create_test_image_bytes(format="JPEG", size=(224, 224), color=(255, 0, 0)) -> bytes:
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format=format)
    return buf.getvalue()

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "model_available" in data
    assert "version" in data
    assert data["database_connected"] is True

def test_model_info_endpoint():
    res = client.get("/api/model-info")
    assert res.status_code == 200
    data = res.json()
    assert data["classes"] == ["Fresh", "Rotten"]
    assert data["input_size"] == [224, 224]

def test_predict_valid_image():
    img_bytes = create_test_image_bytes()
    files = {"file": ("test.jpg", img_bytes, "image/jpeg")}
    res = client.post("/api/predict", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["prediction"] in ["Fresh", "Rotten"]
    assert 0.0 <= data["confidence"] <= 1.0
    assert "explanation" in data
    assert "disclaimer" in data

def test_predict_corrupted_image():
    corrupted_bytes = b"not a valid image byte stream"
    files = {"file": ("corrupt.jpg", corrupted_bytes, "image/jpeg")}
    res = client.post("/api/predict", files=files)
    assert res.status_code == 422
    assert "Invalid or corrupted image format" in res.json()["detail"]

def test_history_and_stats():
    # Submit one prediction
    img_bytes = create_test_image_bytes()
    files = {"file": ("apple.jpg", img_bytes, "image/jpeg")}
    pred_res = client.post("/api/predict", files=files)
    assert pred_res.status_code == 200
    pred_id = pred_res.json()["id"]

    # Verify history
    hist_res = client.get("/api/history")
    assert hist_res.status_code == 200
    hist_data = hist_res.json()
    assert hist_data["total"] >= 1
    ids = [item["id"] for item in hist_data["items"]]
    assert pred_id in ids

    # Verify stats
    stats_res = client.get("/api/stats")
    assert stats_res.status_code == 200
    stats_data = stats_res.json()
    assert stats_data["total_predictions"] >= 1

    # Verify single item fetch
    item_res = client.get(f"/api/history/{pred_id}")
    assert item_res.status_code == 200
    assert item_res.json()["id"] == pred_id

def test_clear_history():
    res = client.delete("/api/history")
    assert res.status_code == 200
    assert res.json()["success"] is True

    hist_res = client.get("/api/history")
    assert hist_res.json()["total"] == 0
