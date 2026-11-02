export interface SpeciesInfo {
  class_id: number;
  scientific_name: string;
  common_name: string;
  genus: string;
  family: string;
  order: string;
  inaturalist_id?: number;
  confidence_percent: number;
}

export interface PredictionCandidate {
  rank: number;
  class_id: number;
  scientific_name: string;
  common_name: string;
  family: string;
  genus: string;
  confidence_percent: number;
}

export interface BenchmarkAccuracy {
  top1_validation_accuracy: string;
  top5_validation_accuracy: string;
  macro_f1: string;
  note: string;
}

export interface PredictionResponse {
  success: boolean;
  model: string;
  inference_type: 'single_model_onnx' | 'triscale_ensemble';
  predicted_species: SpeciesInfo;
  top_5_predictions: PredictionCandidate[];
  latency_ms: number;
  resolution: string;
  benchmark_accuracy: BenchmarkAccuracy;
  ensemble_weights?: Record<string, number>;
}

export interface SampleBird {
  id: string;
  scientific_name: string;
  common_name: string;
  family: string;
  filename: string;
  url: string;
}

export interface SpeciesDetail {
  class_id: number;
  scientific_name: string;
  common_name: string;
  genus: string;
  family: string;
  order: string;
  inaturalist_id?: number;
}

export interface SpeciesListResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  species: SpeciesDetail[];
}

export interface HealthResponse {
  status: string;
  app_name: string;
  version: string;
  model: string;
  supported_species: number;
  onnx_active_provider: string;
  device: string;
}

export interface ModelBenchmark {
  model: string;
  resolution: string;
  top1_accuracy: string;
  top5_accuracy: string;
  macro_f1?: string;
  type: string;
}

export interface ModelInfoResponse {
  application_name: string;
  model_name: string;
  architecture: {
    family: string;
    backbone: string;
    patch_size: string;
    hidden_dimension: number;
    transformer_layers: number;
    attention_heads: number;
    total_parameters: string;
    trainable_finetuned_parameters: string;
    input_resolution: string;
    patch_tokens_at_448px: string;
    normalization: string;
  };
  dataset: {
    name: string;
    total_species: number;
    training_images: number;
    training_images_per_species: number;
    validation_images: number;
    validation_images_per_species: number;
    granularity: string;
  };
  benchmarks_comparison: ModelBenchmark[];
  training_innovations: string[];
}
