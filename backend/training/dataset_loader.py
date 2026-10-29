import os
import glob
from typing import Tuple, List
from PIL import Image
import numpy as np

CLASSES = ["fresh", "rotten"]
CLASS_TO_IDX = {"fresh": 0, "rotten": 1}
IDX_TO_CLASS = {0: "Fresh", 1: "Rotten"}

def load_split(split_dir: str, target_size: Tuple[int, int] = (224, 224)) -> Tuple[np.ndarray, np.ndarray, List[str]]:
    """
    Loads images for a given split (train/validation/test).
    Applies identical preprocessing to production inference:
      - RGB conversion
      - Bilinear resize to 224x224
      - Normalization: (x / 255.0 - 0.5) / 0.5 -> [-1.0, 1.0]
      - Transpose: (C, H, W)
    """
    X_list = []
    y_list = []
    filenames = []
    
    for cls in CLASSES:
        cls_dir = os.path.join(split_dir, cls)
        if not os.path.isdir(cls_dir):
            continue
            
        pattern = os.path.join(cls_dir, "*.*")
        files = [f for f in glob.glob(pattern) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        
        for fpath in files:
            try:
                with Image.open(fpath) as img:
                    rgb_img = img.convert("RGB")
                    resized = rgb_img.resize(target_size, Image.Resampling.BILINEAR)
                    arr = np.array(resized, dtype=np.float32) / 255.0
                    norm = (arr - 0.5) / 0.5
                    tensor = np.transpose(norm, (2, 0, 1))
                    
                    X_list.append(tensor)
                    y_list.append(CLASS_TO_IDX[cls])
                    filenames.append(fpath)
            except Exception as e:
                print(f"Skipping corrupted image {fpath}: {e}")
                
    if not X_list:
        raise ValueError(f"No valid images found in directory: {split_dir}")
        
    X = np.stack(X_list, axis=0).astype(np.float32)
    y = np.array(y_list, dtype=np.int64)
    return X, y, filenames
