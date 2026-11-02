from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SpeciesInfo(BaseModel):
    class_id: int
    scientific_name: str
    common_name: str
    genus: str
    family: str
    order: str
    inaturalist_id: Optional[int] = None
    confidence_percent: float

class PredictionCandidate(BaseModel):
    rank: int
    class_id: int
    scientific_name: str
    common_name: str
    family: str
    genus: str
    confidence_percent: float

class BenchmarkAccuracy(BaseModel):
    top1_validation_accuracy: str
    top5_validation_accuracy: str
    macro_f1: str
    note: str

class PredictionResponse(BaseModel):
    success: bool = True
    model: str
    inference_type: str = "single_model"  # or "triscale_ensemble"
    predicted_species: SpeciesInfo
    top_5_predictions: List[PredictionCandidate]
    latency_ms: float
    resolution: str
    benchmark_accuracy: BenchmarkAccuracy
    ensemble_weights: Optional[Dict[str, float]] = None

class ModelInfoResponse(BaseModel):
    model_name: str
    architecture: str
    input_resolution: str
    total_classes: int
    dataset_name: str
    training_images: int
    validation_images: int
    validation_metrics: Dict[str, Any]
    onnx_optimized: bool
    active_device: str
