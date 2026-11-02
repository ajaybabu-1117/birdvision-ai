import json
import time
import sys
from pathlib import Path
from typing import Dict, Any, List
import numpy as np
import onnxruntime as ort
from PIL import Image

from ..config import settings
from ..utils.image_processing import preprocess_for_onnx, softmax

class InferenceService:
    def __init__(self):
        self.session: ort.InferenceSession = None
        self.input_name: str = ""
        self.output_name: str = ""
        self.classes: List[str] = []
        self.species_meta_by_name: Dict[str, Any] = {}
        self.species_list: List[Dict[str, Any]] = []
        self.sample_birds: List[Dict[str, Any]] = []
        self._ensemble_predictor = None
        self._initialized = False

    def initialize(self):
        if self._initialized:
            return

        print(f"[InferenceService] Loading metadata from {settings.SPECIES_METADATA_PATH}...", flush=True)
        if settings.SPECIES_METADATA_PATH.exists():
            with open(settings.SPECIES_METADATA_PATH, "r", encoding="utf-8") as f:
                meta = json.load(f)
                self.species_list = meta.get("species", [])
                self.species_meta_by_name = meta.get("by_name", {})
        else:
            print("[Warning] species_metadata.json not found, falling back to classes.json", flush=True)

        if settings.CLASSES_PATH.exists():
            with open(settings.CLASSES_PATH, "r", encoding="utf-8") as f:
                self.classes = json.load(f)
        else:
            raise FileNotFoundError(f"Classes file not found at {settings.CLASSES_PATH}")

        # Load sample birds
        samples_file = settings.SAMPLE_BIRDS_DIR / "samples.json"
        if samples_file.exists():
            with open(samples_file, "r", encoding="utf-8") as f:
                self.sample_birds = json.load(f)

        print(f"[InferenceService] Initializing ONNX session: {settings.ONNX_MODEL_PATH}...", flush=True)
        if not settings.ONNX_MODEL_PATH.exists():
            if settings.MODEL_DOWNLOAD_URL:
                print(f"[InferenceService] Model file missing. Downloading from {settings.MODEL_DOWNLOAD_URL}...", flush=True)
                settings.ONNX_MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
                import urllib.request
                urllib.request.urlretrieve(settings.MODEL_DOWNLOAD_URL, str(settings.ONNX_MODEL_PATH))
                print(f"[InferenceService] Model downloaded successfully to {settings.ONNX_MODEL_PATH}", flush=True)
            elif settings.HF_MODEL_REPO:
                print(f"[InferenceService] Model file missing. Pulling from Hugging Face Hub: {settings.HF_MODEL_REPO}...", flush=True)
                try:
                    from huggingface_hub import hf_hub_download
                    downloaded_path = hf_hub_download(repo_id=settings.HF_MODEL_REPO, filename="dinov2_448_birds.onnx")
                    settings.ONNX_MODEL_PATH = Path(downloaded_path)
                    print(f"[InferenceService] Model pulled successfully: {settings.ONNX_MODEL_PATH}", flush=True)
                except Exception as e:
                    raise FileNotFoundError(f"Failed to download model from Hugging Face Hub: {e}") from e
            else:
                raise FileNotFoundError(
                    f"ONNX model missing at {settings.ONNX_MODEL_PATH}. "
                    "For local execution, ensure the model exists in exports/ or set ONNX_MODEL_PATH. "
                    "For cloud deployment, set MODEL_DOWNLOAD_URL or HF_MODEL_REPO."
                )

        # Choose execution providers: CUDA if available, fallback to CPU
        available_providers = ort.get_available_providers()
        providers = ["CUDAExecutionProvider", "CPUExecutionProvider"] if "CUDAExecutionProvider" in available_providers else ["CPUExecutionProvider"]
        
        self.session = ort.InferenceSession(str(settings.ONNX_MODEL_PATH), providers=providers)
        self.input_name = self.session.get_inputs()[0].name
        self.output_name = self.session.get_outputs()[0].name
        
        active_provider = self.session.get_providers()[0]
        print(f"[InferenceService] ONNX Loaded successfully with active provider: {active_provider}", flush=True)
        self._initialized = True

    def get_ensemble_predictor(self):
        if self._ensemble_predictor is None:
            # Lazy import from existing root inference_ensemble
            sys.path.insert(0, str(settings.PROJECT_ROOT))
            try:
                from inference_ensemble import DINOv2TriScaleEnsemblePredictor
                print("[InferenceService] Loading DINOv2 Tri-Scale Ensemble predictor...", flush=True)
                self._ensemble_predictor = DINOv2TriScaleEnsemblePredictor()
            except Exception as e:
                print(f"[Warning] Could not load ensemble predictor: {e}", flush=True)
                raise
        return self._ensemble_predictor

    def predict_single(self, image: Image.Image, top_k: int = 5) -> Dict[str, Any]:
        """Runs single-model high-throughput 448px ONNX inference."""
        self.initialize()
        start_time = time.time()
        
        tensor = preprocess_for_onnx(
            image,
            image_size=settings.IMAGE_SIZE,
            resize_size=settings.RESIZE_SIZE
        )

        outputs = self.session.run([self.output_name], {self.input_name: tensor})
        logits = outputs[0][0]
        probs = softmax(logits)

        top_indices = np.argsort(probs)[-top_k:][::-1]
        elapsed_ms = (time.time() - start_time) * 1000

        candidates = []
        for rank, idx in enumerate(top_indices, start=1):
            sp_name = self.classes[int(idx)]
            meta = self.species_meta_by_name.get(sp_name, {})
            candidates.append({
                "rank": rank,
                "class_id": int(idx),
                "scientific_name": sp_name,
                "common_name": meta.get("common_name", sp_name),
                "genus": meta.get("genus", sp_name.split()[0]),
                "family": meta.get("family", "Unknown"),
                "confidence_percent": round(float(probs[idx]) * 100, 2),
            })

        best = candidates[0]
        best_meta = self.species_meta_by_name.get(best["scientific_name"], {})

        return {
            "success": True,
            "model": "vit_base_patch14_dinov2_448",
            "inference_type": "single_model_onnx",
            "predicted_species": {
                "class_id": best["class_id"],
                "scientific_name": best["scientific_name"],
                "common_name": best["common_name"],
                "genus": best["genus"],
                "family": best["family"],
                "order": best_meta.get("order", "Aves"),
                "inaturalist_id": best_meta.get("inaturalist_id"),
                "confidence_percent": best["confidence_percent"],
            },
            "top_5_predictions": candidates,
            "latency_ms": round(elapsed_ms, 2),
            "resolution": f"{settings.IMAGE_SIZE}x{settings.IMAGE_SIZE}",
            "benchmark_accuracy": {
                "top1_validation_accuracy": "79.60%",
                "top5_validation_accuracy": "91.12%",
                "macro_f1": "79.58%",
                "note": "Ultra-fast direct Vision Transformer inference via ONNX Runtime engine."
            }
        }

    def predict_ensemble(self, image: Image.Image, top_k: int = 5) -> Dict[str, Any]:
        """Runs the verified Tri-Scale Ensemble (448px, 392px, 336px) with PyTorch."""
        self.initialize()
        predictor = self.get_ensemble_predictor()
        res = predictor.predict(image, top_k=top_k)

        candidates = []
        for pred in res["top_predictions"]:
            sp_name = pred["species"]
            meta = self.species_meta_by_name.get(sp_name, {})
            candidates.append({
                "rank": pred["rank"],
                "class_id": self.classes.index(sp_name) if sp_name in self.classes else -1,
                "scientific_name": sp_name,
                "common_name": meta.get("common_name", sp_name),
                "genus": meta.get("genus", sp_name.split()[0]),
                "family": meta.get("family", "Unknown"),
                "confidence_percent": pred["confidence_percent"],
            })

        best = candidates[0]
        best_meta = self.species_meta_by_name.get(best["scientific_name"], {})

        return {
            "success": True,
            "model": "vit_base_patch14_dinov2_triscale_ensemble",
            "inference_type": "triscale_ensemble",
            "predicted_species": {
                "class_id": best["class_id"],
                "scientific_name": best["scientific_name"],
                "common_name": best["common_name"],
                "genus": best["genus"],
                "family": best["family"],
                "order": best_meta.get("order", "Aves"),
                "inaturalist_id": best_meta.get("inaturalist_id"),
                "confidence_percent": best["confidence_percent"],
            },
            "top_5_predictions": candidates,
            "latency_ms": res["latency_ms"],
            "resolution": "Multi-Scale (448px, 392px, 336px)",
            "benchmark_accuracy": {
                "top1_validation_accuracy": "80.03%",
                "top5_validation_accuracy": "91.22%",
                "macro_f1": "80.02%",
                "note": "Highest-accuracy multi-scale ensemble pyramid."
            },
            "ensemble_weights": res["ensemble_weights"]
        }

inference_service = InferenceService()
