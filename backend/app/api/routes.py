import os
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, status
from fastapi.responses import FileResponse

from app.config import settings
from app.schemas.prediction import (
    HealthResponse,
    ModelInfoResponse,
    PredictionResponse,
    HistoryListResponse,
    HistoryItem,
    ClearHistoryResponse,
    StatsResponse,
)
from app.services.image_service import validate_image_bytes, preprocess_image
from app.services.model_service import model_manager
from app.database import db

router = APIRouter(prefix="/api")

@router.get("/health", response_model=HealthResponse)
async def get_health():
    db_connected = True
    try:
        conn = db.get_connection()
        conn.close()
    except Exception:
        db_connected = False
        
    info = model_manager.get_model_info()
    return HealthResponse(
        status="healthy" if db_connected else "degraded",
        model_available=info["is_trained"],
        model_name=info["model_name"],
        version=settings.VERSION,
        database_connected=db_connected
    )

@router.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info():
    info = model_manager.get_model_info()
    return ModelInfoResponse(**info)

@router.post("/predict", response_model=PredictionResponse)
async def predict_fruit(
    file: UploadFile = File(...),
    fruit_type: Optional[str] = Form(None)
):
    # Check if model is trained
    info = model_manager.get_model_info()
    if not info["is_trained"]:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Trained deep learning model is not available. Please run model training first using 'python training/train.py'."
        )
        
    # Read file bytes
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}"
        )
        
    # Validate image bytes
    try:
        validate_image_bytes(content, file.filename or "upload.jpg")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
        
    # Preprocess image
    try:
        tensor, thumb_url = preprocess_image(content)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Image preprocessing error: {str(e)}"
        )
        
    # Run genuine deep learning inference
    try:
        result = model_manager.infer(tensor, fruit_type=fruit_type)
        result["image_url"] = thumb_url
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model inference failed: {str(e)}"
        )
        
    # Persist in SQLite history ledger
    try:
        db.save_prediction(result)
    except Exception as e:
        print(f"Warning: Failed to save prediction to history ledger: {e}")
        
    return PredictionResponse(**result)

@router.get("/history", response_model=HistoryListResponse)
async def get_history_records(
    search: Optional[str] = Query(None, description="Search term for ID or explanation"),
    filter: Optional[str] = Query("all", description="'all', 'Fresh', or 'Rotten'"),
    sort: Optional[str] = Query("desc", description="'desc' or 'asc'"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    items, total, pages = db.get_history(
        search=search,
        filter_class=filter if filter != "all" else None,
        sort_order=sort or "desc",
        page=page,
        limit=limit
    )
    return HistoryListResponse(
        items=[HistoryItem(**item) for item in items],
        total=total,
        page=page,
        pages=pages
    )

@router.get("/history/{prediction_id}", response_model=HistoryItem)
async def get_single_prediction(prediction_id: str):
    record = db.get_prediction_by_id(prediction_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prediction record '{prediction_id}' not found."
        )
    return HistoryItem(**record)

@router.delete("/history", response_model=ClearHistoryResponse)
async def clear_history_records():
    deleted = db.clear_history()
    return ClearHistoryResponse(success=True, deleted_count=deleted)

@router.get("/stats", response_model=StatsResponse)
async def get_aggregate_stats():
    stats = db.get_stats()
    return StatsResponse(**stats)

@router.get("/thumbnails/{filename}")
async def get_thumbnail_file(filename: str):
    # Sanitize filename
    clean_name = os.path.basename(filename)
    path = os.path.join(settings.THUMBNAILS_DIR, clean_name)
    if not os.path.exists(path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Thumbnail file not found."
        )
    return FileResponse(path, media_type="image/jpeg")
