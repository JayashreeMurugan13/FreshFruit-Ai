from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class HealthResponse(BaseModel):
    status: str
    model_available: bool
    model_name: str
    version: str
    database_connected: bool

class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    test_samples_count: int
    confusion_matrix: List[List[int]]

class ModelInfoResponse(BaseModel):
    model_name: str
    model_type: str
    input_size: List[int]
    classes: List[str]
    is_trained: bool
    trained_at: Optional[str] = None
    total_parameters: Optional[int] = None
    metrics: Optional[ModelMetrics] = None

class PredictionResponse(BaseModel):
    id: str
    prediction: str = Field(..., description="'Fresh' or 'Rotten'")
    confidence: float = Field(..., description="Probability score between 0.0 and 1.0")
    model_name: str
    timestamp: str
    disclaimer: str
    explanation: str
    is_uncertain: bool = False
    warning: Optional[str] = None
    image_url: Optional[str] = None
    fruit_type: Optional[str] = None

class HistoryItem(BaseModel):
    id: str
    prediction: str
    confidence: float
    model_name: str
    timestamp: str
    image_url: Optional[str] = None
    fruit_type: Optional[str] = None
    explanation: Optional[str] = None

class HistoryListResponse(BaseModel):
    items: List[HistoryItem]
    total: int
    page: int
    pages: int

class ClearHistoryResponse(BaseModel):
    success: bool
    deleted_count: int

class StatsResponse(BaseModel):
    total_predictions: int
    fresh_count: int
    rotten_count: int
    avg_confidence: float
    fresh_percentage: float
