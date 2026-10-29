import os
import io
import uuid
from typing import Tuple
from PIL import Image, UnidentifiedImageError
import numpy as np
from app.config import settings

def validate_image_bytes(file_bytes: bytes, filename: str) -> None:
    """Validate raw image payload for size and integrity."""
    if len(file_bytes) > settings.MAX_FILE_SIZE_BYTES:
        size_mb = len(file_bytes) / (1024 * 1024)
        raise ValueError(f"Uploaded file exceeds {settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB limit ({size_mb:.1f} MB).")
        
    try:
        with Image.open(io.BytesIO(file_bytes)) as img:
            img.verify()
    except (UnidentifiedImageError, Exception) as e:
        raise ValueError(f"Invalid or corrupted image format: {str(e)}")

def preprocess_image(file_bytes: bytes) -> Tuple[np.ndarray, str]:
    """
    Standardized preprocessing pipeline:
      1. Open and convert to RGB
      2. Save lightweight thumbnail for history ledger
      3. Resize to model input size (224, 224)
      4. Normalize to [-1.0, 1.0]
      5. Transpose to (3, 224, 224)
    """
    try:
        with Image.open(io.BytesIO(file_bytes)) as raw_img:
            img = raw_img.convert("RGB")
    except Exception as e:
        raise ValueError(f"Could not decode image: {str(e)}")
        
    # Generate thumbnail for history ledger
    thumb_id = f"thumb_{uuid.uuid4().hex[:12]}.jpg"
    thumb_path = os.path.join(settings.THUMBNAILS_DIR, thumb_id)
    thumb_img = img.copy()
    thumb_img.thumbnail((160, 160), Image.Resampling.LANCZOS)
    thumb_img.save(thumb_path, "JPEG", quality=85)
    thumb_url = f"/api/thumbnails/{thumb_id}"
    
    # Resize to exact model dimensions (224, 224)
    resized_img = img.resize(settings.INPUT_SIZE, Image.Resampling.BILINEAR)
    
    # Convert to float numpy array
    arr = np.array(resized_img, dtype=np.float32) / 255.0
    
    # Normalize to [-1.0, 1.0]
    norm_arr = (arr - 0.5) / 0.5
    
    # Transpose from (H, W, C) to (C, H, W)
    tensor = np.transpose(norm_arr, (2, 0, 1))
    
    return tensor, thumb_url
