import os
import json
import numpy as np
from typing import Tuple, Dict, Any, Optional

def relu(x: np.ndarray) -> np.ndarray:
    return np.maximum(0, x)

def softmax(x: np.ndarray) -> np.ndarray:
    e_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return e_x / np.sum(e_x, axis=-1, keepdims=True)

def conv2d_forward(x: np.ndarray, w: np.ndarray, b: np.ndarray, stride: int = 1, pad: int = 0) -> np.ndarray:
    """
    Standard vectorized 2D Convolution forward pass.
    x shape: (N, C, H, W)
    w shape: (F, C, HH, WW)
    b shape: (F,)
    """
    N, C, H, W = x.shape
    F, _, HH, WW = w.shape
    
    # Pad input
    if pad > 0:
        x_pad = np.pad(x, ((0, 0), (0, 0), (pad, pad), (pad, pad)), mode='constant')
    else:
        x_pad = x
        
    H_pad, W_pad = x_pad.shape[2], x_pad.shape[3]
    out_h = (H_pad - HH) // stride + 1
    out_w = (W_pad - WW) // stride + 1
    
    out = np.zeros((N, F, out_h, out_w), dtype=np.float32)
    
    for i in range(out_h):
        h_start = i * stride
        h_end = h_start + HH
        for j in range(out_w):
            w_start = j * stride
            w_end = w_start + WW
            
            # Slice: (N, C, HH, WW)
            x_slice = x_pad[:, :, h_start:h_end, w_start:w_end]
            # Sum over channels and kernel height/width: (N, F)
            # w has shape (F, C, HH, WW) -> tensordot over axes (1,2,3)
            val = np.tensordot(x_slice, w, axes=([1, 2, 3], [1, 2, 3]))
            out[:, :, i, j] = val + b
            
    return out

def global_average_pooling(x: np.ndarray) -> np.ndarray:
    """Collapses spatial dimensions (H, W) by taking the mean."""
    # x shape: (N, C, H, W) -> return (N, C)
    return np.mean(x, axis=(2, 3))

class FruitFreshnessCNN:
    """
    Genuine Convolutional Neural Network for fruit freshness classification.
    Architecture:
      Conv2D(3->8, 3x3, s=2, p=1) + ReLU
      Conv2D(8->16, 3x3, s=2, p=1) + ReLU
      Conv2D(16->32, 3x3, s=2, p=1) + ReLU
      GlobalAveragePooling2D() -> 32-dim feature embedding
      Dense(32->16) + ReLU
      Dense(16->2) -> Softmax [P(Fresh), P(Rotten)]
    """
    def __init__(self, weights_path: Optional[str] = None):
        self.model_name = "MobileNet-Inspired CNN (FreshSight-V1)"
        self.classes = ["Fresh", "Rotten"]
        self.input_size = (224, 224)
        self.is_trained = False
        self.trained_at: Optional[str] = None
        
        # Layer dimensions
        self.params: Dict[str, np.ndarray] = {}
        self._init_weights(seed=42)
        
        if weights_path and os.path.exists(weights_path):
            self.load_weights(weights_path)

    def _init_weights(self, seed: int = 42):
        rng = np.random.default_rng(seed)
        
        # He initialization for Conv layers
        self.params["W_conv1"] = (rng.standard_normal((8, 3, 3, 3), dtype=np.float32) * np.sqrt(2.0 / (3 * 3 * 3)))
        self.params["b_conv1"] = np.zeros(8, dtype=np.float32)
        
        self.params["W_conv2"] = (rng.standard_normal((16, 8, 3, 3), dtype=np.float32) * np.sqrt(2.0 / (8 * 3 * 3)))
        self.params["b_conv2"] = np.zeros(16, dtype=np.float32)
        
        self.params["W_conv3"] = (rng.standard_normal((32, 16, 3, 3), dtype=np.float32) * np.sqrt(2.0 / (16 * 3 * 3)))
        self.params["b_conv3"] = np.zeros(32, dtype=np.float32)
        
        # Dense layers
        self.params["W_fc1"] = (rng.standard_normal((32, 16), dtype=np.float32) * np.sqrt(2.0 / 32))
        self.params["b_fc1"] = np.zeros(16, dtype=np.float32)
        
        self.params["W_fc2"] = (rng.standard_normal((16, 2), dtype=np.float32) * np.sqrt(2.0 / 16))
        self.params["b_fc2"] = np.zeros(2, dtype=np.float32)

    def count_parameters(self) -> int:
        return sum(p.size for p in self.params.values())

    def forward(self, x: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Forward inference through the convolutional network.
        x: (N, 3, 224, 224)
        Returns:
          probabilities: (N, 2)
          cache: intermediate activations for visualization / explainability
        """
        # Ensure 4D
        if x.ndim == 3:
            x = np.expand_dims(x, axis=0)
            
        c1 = conv2d_forward(x, self.params["W_conv1"], self.params["b_conv1"], stride=2, pad=1)
        a1 = relu(c1)
        
        c2 = conv2d_forward(a1, self.params["W_conv2"], self.params["b_conv2"], stride=2, pad=1)
        a2 = relu(c2)
        
        c3 = conv2d_forward(a2, self.params["W_conv3"], self.params["b_conv3"], stride=2, pad=1)
        a3 = relu(c3)
        
        gap = global_average_pooling(a3) # (N, 32)
        
        fc1 = np.dot(gap, self.params["W_fc1"]) + self.params["b_fc1"]
        a_fc1 = relu(fc1)
        
        logits = np.dot(a_fc1, self.params["W_fc2"]) + self.params["b_fc2"]
        probs = softmax(logits)
        
        cache = {
            "c1_mean": float(np.mean(a1)),
            "c2_mean": float(np.mean(a2)),
            "c3_mean": float(np.mean(a3)),
            "gap_features": gap.tolist(),
            "logits": logits.tolist()
        }
        return probs, cache

    def predict(self, x: np.ndarray) -> Tuple[str, float, Dict[str, Any]]:
        """Predict class and confidence for a single image tensor."""
        probs, cache = self.forward(x)
        p_fresh = float(probs[0, 0])
        p_rotten = float(probs[0, 1])
        
        if p_fresh >= p_rotten:
            return "Fresh", p_fresh, cache
        else:
            return "Rotten", p_rotten, cache

    def save_weights(self, filepath: str, metadata: Optional[Dict[str, Any]] = None):
        """Save network parameters and metadata to compressed npz."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        np.savez_compressed(filepath, **self.params)
        
        if metadata is not None:
            meta_path = filepath.replace(".npz", ".json")
            if not meta_path.endswith(".json"):
                meta_path = os.path.splitext(filepath)[0] + "_metadata.json"
            with open(meta_path, "w", encoding="utf-8") as f:
                json.dump(metadata, f, indent=2)
                
        self.is_trained = True

    def load_weights(self, filepath: str):
        """Load trained network parameters from compressed npz file."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model weights file not found at: {filepath}")
            
        data = np.load(filepath)
        for k in self.params.keys():
            if k in data:
                self.params[k] = data[k].astype(np.float32)
                
        self.is_trained = True
        
        # Load metadata if available
        meta_path = os.path.splitext(filepath)[0] + "_metadata.json"
        if os.path.exists(meta_path):
            try:
                with open(meta_path, "r", encoding="utf-8") as f:
                    meta = json.load(f)
                    self.trained_at = meta.get("trained_at")
                    self.model_name = meta.get("model_name", self.model_name)
            except Exception:
                pass
