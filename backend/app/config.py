import os
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

class Settings(BaseModel):
    APP_NAME: str = "FreshSight AI Backend"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Paths
    BASE_DIR: str = BASE_DIR
    PROJECT_ROOT: str = PROJECT_ROOT
    ARTIFACTS_DIR: str = os.path.join(BASE_DIR, "artifacts")
    MODEL_WEIGHTS_PATH: str = os.path.join(BASE_DIR, "artifacts", "model_weights.npz")
    MODEL_METADATA_PATH: str = os.path.join(BASE_DIR, "artifacts", "model_metadata.json")
    EVALUATION_METRICS_PATH: str = os.path.join(BASE_DIR, "artifacts", "evaluation_metrics.json")
    CONFUSION_MATRIX_PATH: str = os.path.join(BASE_DIR, "artifacts", "confusion_matrix.json")
    
    # Database
    DATABASE_PATH: str = os.path.join(BASE_DIR, "history.db")
    
    # Temporary / Storage
    TEMP_DIR: str = os.path.join(BASE_DIR, "temp")
    THUMBNAILS_DIR: str = os.path.join(BASE_DIR, "temp", "thumbnails")
    
    # Image constraints
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_IMAGE_TYPES: list[str] = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    INPUT_SIZE: tuple[int, int] = (224, 224)
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

settings = Settings()

# Ensure directories exist
os.makedirs(settings.ARTIFACTS_DIR, exist_ok=True)
os.makedirs(settings.TEMP_DIR, exist_ok=True)
os.makedirs(settings.THUMBNAILS_DIR, exist_ok=True)
