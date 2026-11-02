import {
  HealthResponse,
  ModelInfoResponse,
  PredictionResponse,
  SampleBird,
  SpeciesListResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status: ${response.status}`);
  }
  return response.json();
}

export async function fetchModelInfo(): Promise<ModelInfoResponse> {
  const response = await fetch(`${API_BASE_URL}/model-info`);
  if (!response.ok) {
    throw new Error(`Failed to fetch model info: ${response.status}`);
  }
  return response.json();
}

export async function fetchSamples(): Promise<SampleBird[]> {
  const response = await fetch(`${API_BASE_URL}/samples`);
  if (!response.ok) {
    throw new Error(`Failed to fetch sample birds: ${response.status}`);
  }
  return response.json();
}

export async function predictImage(
  file: File,
  useEnsemble = false
): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const endpoint = useEnsemble
    ? `${API_BASE_URL}/predict/ensemble`
    : `${API_BASE_URL}/predict`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = `Prediction failed with status: ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorMsg = errJson.detail;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function predictSample(
  sampleId: string,
  useEnsemble = false
): Promise<PredictionResponse> {
  const endpoint = `${API_BASE_URL}/predict/sample/${sampleId}?use_ensemble=${useEnsemble}`;
  const response = await fetch(endpoint, {
    method: 'POST',
  });

  if (!response.ok) {
    let errorMsg = `Sample prediction failed (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorMsg = errJson.detail;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function fetchSpecies(
  page = 1,
  pageSize = 24,
  query?: string,
  family?: string
): Promise<SpeciesListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (query && query.trim()) {
    params.append('q', query.trim());
  }
  if (family && family.trim()) {
    params.append('family', family.trim());
  }

  const response = await fetch(`${API_BASE_URL}/species?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch species list: ${response.status}`);
  }
  return response.json();
}

export function getSampleImageUrl(relativeUrl: string): string {
  if (relativeUrl.startsWith('http')) return relativeUrl;
  return `${API_BASE_URL}${relativeUrl}`;
}
