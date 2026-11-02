from fastapi import APIRouter
import onnxruntime as ort
from ..services.inference_service import inference_service
from ..config import settings

router = APIRouter(tags=["Model Metadata"])

@router.get("/health")
def health_check():
    """Returns backend and model status."""
    inference_service.initialize()
    providers = inference_service.session.get_providers() if inference_service.session else []
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "model": "vit_base_patch14_dinov2_448",
        "supported_species": len(inference_service.classes),
        "onnx_active_provider": providers[0] if providers else "Unknown",
        "onnx_available_providers": providers,
        "device": "CUDA GPU" if "CUDAExecutionProvider" in providers else "CPU",
    }


@router.get("/model-info")
def get_model_information():
    """
    Returns architecture, training, and verified evaluation benchmark comparison across all experimental runs.
    """
    inference_service.initialize()
    return {
        "application_name": "BirdVision AI",
        "model_name": "DINOv2 ViT-Base/14 Fine-Tuned (High-Resolution 448px)",
        "architecture": {
            "family": "Vision Transformer (ViT)",
            "backbone": "vit_base_patch14_dinov2",
            "patch_size": "14x14",
            "hidden_dimension": 768,
            "transformer_layers": 12,
            "attention_heads": 12,
            "total_parameters": "87,722,446 (87.7M)",
            "trainable_finetuned_parameters": "29,501,902 (33.6%)",
            "input_resolution": "448 x 448 pixels",
            "patch_tokens_at_448px": "1,024 vision tokens (32 x 32 grid)",
            "normalization": "ImageNet (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])"
        },
        "dataset": {
            "name": "iNaturalist 2021 Mini (Aves subset)",
            "total_species": 1486,
            "training_images": 74300,
            "training_images_per_species": 50,
            "validation_images": 14860,
            "validation_images_per_species": 10,
            "granularity": "Global fine-grained avian biodiversity"
        },
        "benchmarks_comparison": [
            {
                "model": "MobileNetV3-Large",
                "resolution": "224x224",
                "top1_accuracy": "41.69%",
                "top5_accuracy": "65.65%",
                "type": "CNN Baseline"
            },
            {
                "model": "EfficientNet-B0",
                "resolution": "224x224",
                "top1_accuracy": "44.91%",
                "top5_accuracy": "69.15%",
                "type": "CNN Baseline"
            },
            {
                "model": "EfficientNet-B2 (Legacy Production)",
                "resolution": "288x288",
                "top1_accuracy": "54.93%",
                "top5_accuracy": "76.86%",
                "type": "CNN Baseline"
            },
            {
                "model": "DINOv2 Frozen Backbone + Head",
                "resolution": "224x224",
                "top1_accuracy": "66.01%",
                "top5_accuracy": "84.68%",
                "type": "ViT Transfer Learning"
            },
            {
                "model": "DINOv2 Fine-Tuned (Initial)",
                "resolution": "224x224",
                "top1_accuracy": "70.56%",
                "top5_accuracy": "85.52%",
                "type": "ViT Fine-Tuning"
            },
            {
                "model": "DINOv2 Regularized 336px",
                "resolution": "336x336",
                "top1_accuracy": "77.81%",
                "top5_accuracy": "89.81%",
                "type": "Multi-Scale ViT"
            },
            {
                "model": "DINOv2 448px Production ONNX (Single Model)",
                "resolution": "448x448",
                "top1_accuracy": "79.60%",
                "top5_accuracy": "91.12%",
                "macro_f1": "79.58%",
                "average_latency_gpu": "~25-35 ms",
                "type": "High-Throughput Production Model"
            },
            {
                "model": "DINOv2 Tri-Scale Ensemble (448px + 392px + 336px)",
                "resolution": "Multi-Scale",
                "top1_accuracy": "80.03%",
                "top5_accuracy": "91.22%",
                "macro_f1": "80.02%",
                "average_latency_gpu": "~115 ms",
                "type": "Ensemble Benchmark Target"
            }
        ],
        "training_innovations": [
            "Resolution scaling from 224px to 448px (+300% detail recovery for distant small birds)",
            "Dynamic 2D bicubic positional embedding interpolation for ViT patches",
            "Layer-wise Learning Rate Decay (LLRD) preserving low-level edge/texture features while adapting avian morphology",
            "FP16 Mixed Precision training with gradient accumulation fitting 6GB VRAM",
            "Exported to optimized ONNX graph with static input dimensions for sub-40ms production inference"
        ]
    }
