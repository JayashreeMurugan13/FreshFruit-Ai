import os
import sys
import io
import unittest
from PIL import Image
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.models.cnn_model import FruitFreshnessCNN
from app.main import app
from app.database import db

try:
    from fastapi.testclient import TestClient
    HAS_TESTCLIENT = True
except ImportError:
    HAS_TESTCLIENT = False

class TestCNNModel(unittest.TestCase):
    def test_cnn_initialization(self):
        model = FruitFreshnessCNN()
        self.assertEqual(model.classes, ["Fresh", "Rotten"])
        self.assertEqual(model.input_size, (224, 224))
        self.assertGreater(model.count_parameters(), 5000)

    def test_cnn_forward_shape(self):
        model = FruitFreshnessCNN()
        x = np.random.randn(1, 3, 224, 224).astype(np.float32)
        probs, cache = model.forward(x)
        self.assertEqual(probs.shape, (1, 2))
        self.assertTrue(np.isclose(np.sum(probs), 1.0, atol=1e-5))
        self.assertIn("gap_features", cache)

    def test_cnn_prediction_labels(self):
        model = FruitFreshnessCNN()
        x = np.random.randn(1, 3, 224, 224).astype(np.float32)
        pred_class, conf, _ = model.predict(x)
        self.assertIn(pred_class, ["Fresh", "Rotten"])
        self.assertTrue(0.0 <= conf <= 1.0)

    def test_cnn_load_trained_weights(self):
        weights_path = os.path.join(BASE_DIR, "artifacts", "model_weights.npz")
        self.assertTrue(os.path.exists(weights_path), "Model weights must exist")
        model = FruitFreshnessCNN(weights_path=weights_path)
        self.assertTrue(model.is_trained)

class TestFastAPIEndpoints(unittest.TestCase):
    def setUp(self):
        db.init_db()
        if HAS_TESTCLIENT:
            self.client = TestClient(app)

    def _create_image(self, format="JPEG", size=(224, 224), color=(255, 0, 0)):
        img = Image.new("RGB", size, color=color)
        buf = io.BytesIO()
        img.save(buf, format=format)
        return buf.getvalue()

    def test_health_endpoint(self):
        if not HAS_TESTCLIENT:
            self.skipTest("TestClient not available")
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")
        self.assertTrue(data["model_available"])

    def test_model_info_endpoint(self):
        if not HAS_TESTCLIENT:
            self.skipTest("TestClient not available")
        res = self.client.get("/api/model-info")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["classes"], ["Fresh", "Rotten"])
        self.assertEqual(data["input_size"], [224, 224])
        self.assertTrue(data["is_trained"])

    def test_predict_and_history_flow(self):
        if not HAS_TESTCLIENT:
            self.skipTest("TestClient not available")
            
        img_bytes = self._create_image()
        files = {"file": ("test_apple.jpg", img_bytes, "image/jpeg")}
        res = self.client.post("/api/predict", files=files)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn(data["prediction"], ["Fresh", "Rotten"])
        self.assertTrue(0.0 <= data["confidence"] <= 1.0)
        pred_id = data["id"]

        # History test
        hist_res = self.client.get("/api/history")
        self.assertEqual(hist_res.status_code, 200)
        hist = hist_res.json()
        self.assertGreaterEqual(hist["total"], 1)

        # Stats test
        stats_res = self.client.get("/api/stats")
        self.assertEqual(stats_res.status_code, 200)
        self.assertGreaterEqual(stats_res.json()["total_predictions"], 1)

        # Single record
        rec_res = self.client.get(f"/api/history/{pred_id}")
        self.assertEqual(rec_res.status_code, 200)
        self.assertEqual(rec_res.json()["id"], pred_id)

    def test_corrupt_image_rejection(self):
        if not HAS_TESTCLIENT:
            self.skipTest("TestClient not available")
        corrupted = b"this is not a valid image"
        files = {"file": ("corrupt.jpg", corrupted, "image/jpeg")}
        res = self.client.post("/api/predict", files=files)
        self.assertEqual(res.status_code, 422)

if __name__ == "__main__":
    unittest.main(verbosity=2)
