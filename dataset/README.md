# FreshSight AI Dataset Guide

This directory manages the image datasets used for training and evaluating the Convolutional Neural Network (CNN) freshness classification model.

## Directory Structure

```
dataset/
├── README.md
├── setup_dataset.py
└── sample_data/
    ├── train/
    │   ├── fresh/       # 24 samples
    │   └── rotten/      # 24 samples
    ├── validation/
    │   ├── fresh/       # 8 samples
    │   └── rotten/      # 8 samples
    └── test/
        ├── fresh/       # 8 samples
        └── rotten/      # 8 samples
```

## Recommended Academic Datasets

For full-scale industrial or extensive academic research benchmarks, you can download public datasets:

1. **Fruit Freshness and Rottenness Dataset (Kaggle)**:
   - Source: [Kaggle Fresh and Stale Fruits](https://www.kaggle.com/datasets/sriramr/fruits-fresh-and-rotten-for-classification)
   - Scope: Fresh vs Rotten Apples, Bananas, and Oranges.
   - License: CC0: Public Domain / Open Academic Research.

2. **Fruits 360 Dataset**:
   - Source: [Horea Muresan, Mihai Oltean, Fruit recognition from images using deep learning](https://www.kaggle.com/datasets/moltean/fruits)
   - Scope: Multi-angle fruit rotation sequences.

## Running Setup

To initialize or regenerate the curated sample dataset:
```powershell
python dataset/setup_dataset.py
```
This populates balanced train/validation/test splits with realistic fruit photographs and subtle geometric/photometric augmentations.
