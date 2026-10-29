import os
import sys
import json
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.models.cnn_model import FruitFreshnessCNN
from training.dataset_loader import load_split

def evaluate_model(
    dataset_dir: str = None,
    artifacts_dir: str = None
):
    if dataset_dir is None:
        dataset_dir = os.path.join(os.path.dirname(BASE_DIR), "dataset", "sample_data")
    if artifacts_dir is None:
        artifacts_dir = os.path.join(BASE_DIR, "artifacts")
        
    weights_path = os.path.join(artifacts_dir, "model_weights.npz")
    metrics_path = os.path.join(artifacts_dir, "evaluation_metrics.json")
    cm_path = os.path.join(artifacts_dir, "confusion_matrix.json")
    
    if not os.path.exists(weights_path):
        raise FileNotFoundError(f"Trained model not found at {weights_path}. Run train.py first.")
        
    print("=" * 60)
    print(" FreshSight AI – Model Evaluation on Held-Out Test Set")
    print("=" * 60)
    
    test_dir = os.path.join(dataset_dir, "test")
    X_test, y_test, filenames = load_split(test_dir)
    print(f"Loaded {len(X_test)} held-out test samples. Fresh={np.sum(y_test == 0)}, Rotten={np.sum(y_test == 1)}")
    
    model = FruitFreshnessCNN(weights_path=weights_path)
    
    # Run forward inference
    probs, _ = model.forward(X_test)
    preds = np.argmax(probs, axis=1)
    
    # Calculate real evaluation metrics
    acc = float(accuracy_score(y_test, preds))
    prec = float(precision_score(y_test, preds, average='binary', pos_label=1, zero_division=0))
    rec = float(recall_score(y_test, preds, average='binary', pos_label=1, zero_division=0))
    f1 = float(f1_score(y_test, preds, average='binary', pos_label=1, zero_division=0))
    cm = confusion_matrix(y_test, preds).tolist()
    report = classification_report(y_test, preds, target_names=["Fresh", "Rotten"], output_dict=True)
    
    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "test_samples_count": len(y_test),
        "confusion_matrix": cm,
        "classification_report": report
    }
    
    print("\n--- Evaluation Results ---")
    print(f"Accuracy:         {acc * 100:.2f}%")
    print(f"Precision:        {prec * 100:.2f}%")
    print(f"Recall:           {rec * 100:.2f}%")
    print(f"F1-Score:         {f1 * 100:.2f}%")
    print("\nConfusion Matrix (Rows: Actual, Cols: Predicted):")
    print(f"              Pred Fresh  Pred Rotten")
    print(f"Actual Fresh      {cm[0][0]:<10} {cm[0][1]:<10}")
    print(f"Actual Rotten     {cm[1][0]:<10} {cm[1][1]:<10}")
    
    # Save artifacts
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    with open(cm_path, "w", encoding="utf-8") as f:
        json.dump({"confusion_matrix": cm, "labels": ["Fresh", "Rotten"]}, f, indent=2)
        
    print(f"\nSaved evaluation metrics to:  {metrics_path}")
    print(f"Saved confusion matrix to:    {cm_path}")
    return metrics

if __name__ == "__main__":
    evaluate_model()
