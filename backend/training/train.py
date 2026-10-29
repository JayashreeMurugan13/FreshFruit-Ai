import os
import sys
import json
import time
from datetime import datetime, timezone
import numpy as np

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.models.cnn_model import (
    FruitFreshnessCNN,
    conv2d_forward,
    relu,
    softmax,
    global_average_pooling,
)
from training.dataset_loader import load_split

def train_model(
    dataset_dir: str = None,
    artifacts_dir: str = None,
    epochs: int = 15,
    learning_rate: float = 0.005,
    batch_size: int = 8,
    seed: int = 42
):
    if dataset_dir is None:
        dataset_dir = os.path.join(os.path.dirname(BASE_DIR), "dataset", "sample_data")
    if artifacts_dir is None:
        artifacts_dir = os.path.join(BASE_DIR, "artifacts")
        
    os.makedirs(artifacts_dir, exist_ok=True)
    weights_path = os.path.join(artifacts_dir, "model_weights.npz")
    meta_path = os.path.join(artifacts_dir, "model_metadata.json")
    
    print("=" * 60)
    print(" FreshSight AI – CNN Training Pipeline")
    print("=" * 60)
    print(f"Dataset root:   {dataset_dir}")
    print(f"Artifacts dest: {artifacts_dir}")
    print(f"Target size:    224x224 RGB")
    print(f"Classes:        ['Fresh', 'Rotten']")
    
    train_dir = os.path.join(dataset_dir, "train")
    val_dir = os.path.join(dataset_dir, "validation")
    
    print("\nLoading training images...")
    X_train, y_train, _ = load_split(train_dir)
    print(f"Loaded {len(X_train)} training samples. Class counts: Fresh={np.sum(y_train == 0)}, Rotten={np.sum(y_train == 1)}")
    
    print("Loading validation images...")
    X_val, y_val, _ = load_split(val_dir)
    print(f"Loaded {len(X_val)} validation samples. Class counts: Fresh={np.sum(y_val == 0)}, Rotten={np.sum(y_val == 1)}")
    
    np.random.seed(seed)
    model = FruitFreshnessCNN()
    
    # Feature extraction step: compute GAP features for train and val to optimize training speed
    print("\nExtracting spatial convolutional representations...")
    
    def extract_features(X_batch):
        # Pass through Conv1 + ReLU + Conv2 + ReLU + Conv3 + ReLU + GAP
        c1 = conv2d_forward(X_batch, model.params["W_conv1"], model.params["b_conv1"], stride=2, pad=1)
        a1 = relu(c1)
        c2 = conv2d_forward(a1, model.params["W_conv2"], model.params["b_conv2"], stride=2, pad=1)
        a2 = relu(c2)
        c3 = conv2d_forward(a2, model.params["W_conv3"], model.params["b_conv3"], stride=2, pad=1)
        a3 = relu(c3)
        gap = global_average_pooling(a3) # shape (N, 32)
        return gap, a3
        
    feat_train, _ = extract_features(X_train)
    feat_val, _ = extract_features(X_val)
    
    print(f"Feature extraction completed. Embedding dimension: {feat_train.shape[1]}")
    
    # Train Classification Head with Adam Optimizer
    W_fc1 = model.params["W_fc1"].copy()
    b_fc1 = model.params["b_fc1"].copy()
    W_fc2 = model.params["W_fc2"].copy()
    b_fc2 = model.params["b_fc2"].copy()
    
    # Adam velocity and moments
    mW_fc1, vW_fc1 = np.zeros_like(W_fc1), np.zeros_like(W_fc1)
    mb_fc1, vb_fc1 = np.zeros_like(b_fc1), np.zeros_like(b_fc1)
    mW_fc2, vW_fc2 = np.zeros_like(W_fc2), np.zeros_like(W_fc2)
    mb_fc2, vb_fc2 = np.zeros_like(b_fc2), np.zeros_like(b_fc2)
    
    beta1, beta2, eps = 0.9, 0.999, 1e-8
    best_val_acc = -1.0
    best_weights = None
    
    N = len(X_train)
    t = 0
    
    print("\nStarting optimization...")
    start_time = time.time()
    
    for epoch in range(1, epochs + 1):
        indices = np.random.permutation(N)
        epoch_loss = 0.0
        
        for start_idx in range(0, N, batch_size):
            t += 1
            b_idx = indices[start_idx : start_idx + batch_size]
            X_b = feat_train[b_idx]
            y_b = y_train[b_idx]
            B = len(X_b)
            
            # Forward Dense 1
            z1 = np.dot(X_b, W_fc1) + b_fc1
            a1 = relu(z1)
            
            # Forward Dense 2 (Logits)
            logits = np.dot(a1, W_fc2) + b_fc2
            probs = softmax(logits)
            
            # Cross-Entropy Loss
            loss = -np.mean(np.log(probs[np.arange(B), y_b] + 1e-12))
            epoch_loss += loss * B
            
            # Backpropagation
            dLogits = probs.copy()
            dLogits[np.arange(B), y_b] -= 1.0
            dLogits /= B
            
            dW_fc2 = np.dot(a1.T, dLogits)
            db_fc2 = np.sum(dLogits, axis=0)
            
            da1 = np.dot(dLogits, W_fc2.T)
            dz1 = da1 * (z1 > 0)
            
            dW_fc1 = np.dot(X_b.T, dz1)
            db_fc1 = np.sum(dz1, axis=0)
            
            # Adam update FC2
            mW_fc2 = beta1 * mW_fc2 + (1 - beta1) * dW_fc2
            vW_fc2 = beta2 * vW_fc2 + (1 - beta2) * (dW_fc2 ** 2)
            m_hat = mW_fc2 / (1 - beta1 ** t)
            v_hat = vW_fc2 / (1 - beta2 ** t)
            W_fc2 -= learning_rate * m_hat / (np.sqrt(v_hat) + eps)
            
            mb_fc2 = beta1 * mb_fc2 + (1 - beta1) * db_fc2
            vb_fc2 = beta2 * vb_fc2 + (1 - beta2) * (db_fc2 ** 2)
            m_hat = mb_fc2 / (1 - beta1 ** t)
            v_hat = vb_fc2 / (1 - beta2 ** t)
            b_fc2 -= learning_rate * m_hat / (np.sqrt(v_hat) + eps)
            
            # Adam update FC1
            mW_fc1 = beta1 * mW_fc1 + (1 - beta1) * dW_fc1
            vW_fc1 = beta2 * vW_fc1 + (1 - beta2) * (dW_fc1 ** 2)
            m_hat = mW_fc1 / (1 - beta1 ** t)
            v_hat = vW_fc1 / (1 - beta2 ** t)
            W_fc1 -= learning_rate * m_hat / (np.sqrt(v_hat) + eps)
            
            mb_fc1 = beta1 * mb_fc1 + (1 - beta1) * db_fc1
            vb_fc1 = beta2 * vb_fc1 + (1 - beta2) * (db_fc1 ** 2)
            m_hat = mb_fc1 / (1 - beta1 ** t)
            v_hat = vb_fc1 / (1 - beta2 ** t)
            b_fc1 -= learning_rate * m_hat / (np.sqrt(v_hat) + eps)
            
        epoch_loss /= N
        
        # Validation evaluation
        z1_v = relu(np.dot(feat_val, W_fc1) + b_fc1)
        logits_v = np.dot(z1_v, W_fc2) + b_fc2
        val_preds = np.argmax(softmax(logits_v), axis=1)
        val_acc = np.mean(val_preds == y_val)
        
        print(f"Epoch [{epoch:02d}/{epochs:02d}] - Train Loss: {epoch_loss:.4f} - Val Accuracy: {val_acc * 100:.1f}%")
        
        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            best_weights = {
                "W_conv1": model.params["W_conv1"],
                "b_conv1": model.params["b_conv1"],
                "W_conv2": model.params["W_conv2"],
                "b_conv2": model.params["b_conv2"],
                "W_conv3": model.params["W_conv3"],
                "b_conv3": model.params["b_conv3"],
                "W_fc1": W_fc1.copy(),
                "b_fc1": b_fc1.copy(),
                "W_fc2": W_fc2.copy(),
                "b_fc2": b_fc2.copy(),
            }

    elapsed = time.time() - start_time
    print(f"\nTraining completed in {elapsed:.2f}s. Best Validation Accuracy: {best_val_acc * 100:.1f}%")
    
    # Save best weights
    model.params = best_weights
    metadata = {
        "model_name": model.model_name,
        "classes": model.classes,
        "input_size": list(model.input_size),
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "total_parameters": model.count_parameters(),
        "best_val_accuracy": float(best_val_acc),
        "epochs": epochs,
        "learning_rate": learning_rate,
        "batch_size": batch_size,
    }
    
    model.save_weights(weights_path, metadata)
    print(f"Saved trained model weights to: {weights_path}")
    print(f"Saved metadata to:               {meta_path}")

if __name__ == "__main__":
    train_model()
