import os
import sys
import numpy as np
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.models.cnn_model import FruitFreshnessCNN

def test_cnn_initialization():
    model = FruitFreshnessCNN()
    assert model.classes == ["Fresh", "Rotten"]
    assert model.input_size == (224, 224)
    assert model.count_parameters() > 5000

def test_cnn_forward_shape():
    model = FruitFreshnessCNN()
    # Dummy image tensor (1, 3, 224, 224)
    x = np.random.randn(1, 3, 224, 224).astype(np.float32)
    probs, cache = model.forward(x)
    assert probs.shape == (1, 2)
    assert np.isclose(np.sum(probs), 1.0, atol=1e-5)
    assert "gap_features" in cache

def test_cnn_prediction_labels():
    model = FruitFreshnessCNN()
    x = np.random.randn(1, 3, 224, 224).astype(np.float32)
    pred_class, conf, _ = model.predict(x)
    assert pred_class in ["Fresh", "Rotten"]
    assert 0.0 <= conf <= 1.0

def test_cnn_load_trained_weights():
    weights_path = os.path.join(BASE_DIR, "artifacts", "model_weights.npz")
    if os.path.exists(weights_path):
        model = FruitFreshnessCNN(weights_path=weights_path)
        assert model.is_trained is True
