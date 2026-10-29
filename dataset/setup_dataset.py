"""
Dataset setup script for FreshSight AI.
Creates training, validation, and test splits with real fruit image samples and augmentations.
"""
import os
import shutil
import random
from PIL import Image, ImageEnhance

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAMPLE_DIR = os.path.join(BASE_DIR, "sample_data")
BRAIN_ASSETS = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public", "assets")

SPLITS = ["train", "validation", "test"]
CLASSES = ["fresh", "rotten"]

# Seed images available in assets
SEED_IMAGES = {
    "fresh": ["fresh_apple.jpg", "fresh_banana.jpg", "fresh_orange.jpg"],
    "rotten": ["rotten_apple.jpg", "rotten_banana.jpg"]
}

def create_directory_structure():
    for split in SPLITS:
        for cls in CLASSES:
            path = os.path.join(SAMPLE_DIR, split, cls)
            os.makedirs(path, exist_ok=True)
    print(f"Directory structure verified under: {SAMPLE_DIR}")

def augment_image(img: Image.Image, variant: int) -> Image.Image:
    """Apply realistic augmentations: small rotation, flip, subtle brightness."""
    res = img.copy()
    
    # Rotation (-15 to 15 degrees)
    rot_angles = [0, -10, 10, -5, 5, -15, 15]
    angle = rot_angles[variant % len(rot_angles)]
    if angle != 0:
        res = res.rotate(angle, resample=Image.Resampling.BILINEAR, fillcolor=(255, 255, 255))
        
    # Flip
    if (variant // len(rot_angles)) % 2 == 1:
        res = res.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        
    # Brightness (0.9 to 1.1)
    brightness_factors = [1.0, 0.92, 1.08, 0.95, 1.05]
    factor = brightness_factors[variant % len(brightness_factors)]
    enhancer = ImageEnhance.Brightness(res)
    res = enhancer.enhance(factor)
    
    return res

def populate_sample_dataset():
    create_directory_structure()
    
    random.seed(42)
    
    counts = {"train": 24, "validation": 8, "test": 8}
    
    for cls in CLASSES:
        seed_files = SEED_IMAGES[cls]
        available_seeds = []
        for sf in seed_files:
            seed_path = os.path.join(BRAIN_ASSETS, sf)
            if os.path.exists(seed_path):
                try:
                    with Image.open(seed_path) as im:
                        available_seeds.append(im.convert("RGB"))
                except Exception as e:
                    print(f"Warning: could not open seed {sf}: {e}")
                    
        if not available_seeds:
            print(f"No seed images found for {cls} in {BRAIN_ASSETS}")
            continue
            
        variant_idx = 0
        for split, count in counts.items():
            dest_dir = os.path.join(SAMPLE_DIR, split, cls)
            for i in range(count):
                seed_im = available_seeds[i % len(available_seeds)]
                aug_im = augment_image(seed_im, variant_idx)
                out_name = f"{cls}_sample_{split}_{i+1:03d}.jpg"
                out_path = os.path.join(dest_dir, out_name)
                aug_im.save(out_path, "JPEG", quality=92)
                variant_idx += 1
                
            print(f"Generated {count} {cls} samples for {split} set.")

if __name__ == "__main__":
    populate_sample_dataset()
    print("Dataset setup completed successfully.")
