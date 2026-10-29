# FreshSight AI Model Artifacts

This directory contains the serialized weights, configuration, and evaluation benchmarks for the Convolutional Neural Network (CNN) freshness classifier.

## Files

1. `model_weights.npz`:
   - Serialized convolutional and dense layer weight tensors (Conv1, Conv2, Conv3, FC1, FC2, and corresponding biases).
2. `model_metadata.json`:
   - Model name, supported classes (`['Fresh', 'Rotten']`), input dimensions (`[224, 224]`), timestamp, total parameters count (~7,500 parameters).
3. `evaluation_metrics.json`:
   - Real test accuracy, precision, recall, F1-score, and per-class metrics evaluated on held-out test data.
4. `confusion_matrix.json`:
   - 2x2 confusion matrix from held-out test evaluation.
