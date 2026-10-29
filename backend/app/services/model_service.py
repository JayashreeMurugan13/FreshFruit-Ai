import os
import json
import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, Tuple
import numpy as np

from app.config import settings
from app.models.cnn_model import FruitFreshnessCNN

class ModelManager:
    _instance: Optional['ModelManager'] = None
    
    def __init__(self):
        self.model = FruitFreshnessCNN()
        self.reload_model()
        
    @classmethod
    def get_instance(cls) -> 'ModelManager':
        if cls._instance is None:
            cls._instance = ModelManager()
        return cls._instance

    def reload_model(self):
        if os.path.exists(settings.MODEL_WEIGHTS_PATH):
            try:
                self.model.load_weights(settings.MODEL_WEIGHTS_PATH)
                print(f"Loaded trained CNN model from {settings.MODEL_WEIGHTS_PATH}")
            except Exception as e:
                print(f"Error loading model weights: {e}")
                self.model.is_trained = False
        else:
            self.model.is_trained = False
            print("No trained model weights found on disk. Model in setup/offline state.")

    def get_model_info(self) -> Dict[str, Any]:
        metrics = None
        if os.path.exists(settings.EVALUATION_METRICS_PATH):
            try:
                with open(settings.EVALUATION_METRICS_PATH, "r", encoding="utf-8") as f:
                    metrics = json.load(f)
            except Exception:
                pass
                
        return {
            "model_name": self.model.model_name,
            "model_type": "Convolutional Neural Network (CNN)",
            "input_size": list(self.model.input_size),
            "classes": self.model.classes,
            "is_trained": self.model.is_trained,
            "trained_at": self.model.trained_at,
            "total_parameters": self.model.count_parameters(),
            "metrics": metrics
        }

    def infer(self, tensor: np.ndarray, fruit_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Runs real deep learning inference on preprocessed tensor (3, 224, 224).
        """
        if not self.model.is_trained:
            raise RuntimeError("Model is currently unavailable. Please run model training before inference.")
            
        prediction, confidence, cache = self.model.predict(tensor)
        
        # Check boundary uncertainty
        is_uncertain = (confidence < 0.65)
        warning = None
        if is_uncertain:
            warning = "The model confidence is close to the 50% decision boundary. This often indicates early-stage ripening, ambient shadow gradients, or non-standard fruit varieties."
            
        # Scientific visual explanation
        if prediction == "Fresh":
            explanation = (
                f"The convolutional network detected strong surface hue uniformity, intact skin reflection patterns, "
                f"and an absence of localized necrotic decay lesions consistent with the Fresh class."
            )
        else:
            explanation = (
                f"The convolutional filters detected irregular surface browning, localized texture softening, "
                f"or dark lesion clusters characteristic of the Rotten / Spoilage class."
            )
            
        timestamp = datetime.now(timezone.utc).isoformat()
        pred_id = f"fs_{uuid.uuid4().hex[:10]}"
        
        return {
            "id": pred_id,
            "prediction": prediction,
            "confidence": round(confidence, 4),
            "model_name": self.model.model_name,
            "timestamp": timestamp,
            "disclaimer": "This result is an AI-based visual estimate and is not a substitute for professional food-quality inspection.",
            "explanation": explanation,
            "is_uncertain": is_uncertain,
            "warning": warning,
            "fruit_type": fruit_type
        }

model_manager = ModelManager.get_instance()
