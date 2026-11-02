import React from 'react';
import { Info, Target, Database, Layers, CheckCircle, Lightbulb } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2">
          <Info className="w-4 h-4" />
          Project Overview
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
          BirdVision AI: Global Fine-Grained Avian Classification
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
          Bird species classification is an essential tool for biodiversity monitoring, ecology research, and wildlife conservation. Birds serve as primary indicator species for ecosystem health. However, global automated classification faces acute obstacles: 1,486 species span diverse geographies, with many sister taxa differing by microscopic plumage patterns that baffle human observers. BirdVision AI bridges this gap by marrying cutting-edge self-supervised Vision Transformers (DINOv2) with robust MLOps deployment pipelines.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-100">
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
              <Target className="w-4 h-4 text-emerald-600" />
              The Mission
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Push fine-grained Top-1 validation accuracy beyond the 80% threshold across 1,486 species without data leakage, synthetic inflation, or hardware compromise on a 6GB RTX 3050.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              The Dataset
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trained on the standardized iNaturalist 2021 Mini dataset containing 74,300 curated training images (~50 per species) and strictly evaluated on 14,860 held-out validation images (10 per species).
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
              <Layers className="w-4 h-4 text-teal-600" />
              The Technology
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              DINOv2 ViT-Base/14, PyTorch CUDA mixed precision, ONNX Runtime inference engine, FastAPI microservice, and a modern React 18 TypeScript web client.
            </p>
          </div>
        </div>
      </div>

      {/* Challenges & Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2">
            Key Challenge
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Intra-Genus Sister Species Bottleneck</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Deep error analysis revealed that 38.3% of all misclassifications and 100% of the top 15 confusion pairs occur between sibling species belonging to the <em>exact same genus</em>:
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li><em>Chaetura pelagica</em> vs <em>Chaetura vauxi</em> (Chimney vs Vaux's Swift)</li>
            <li><em>Dryobates pubescens</em> vs <em>Dryobates villosus</em> (Downy vs Hairy Woodpecker)</li>
            <li><em>Empidonax difficilis</em> vs <em>Empidonax occidentalis</em> (Cryptic Flycatchers)</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2">
            The Solution
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">High-Resolution Patch Representations</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Downsampling images to traditional 224px scales destroyed the subtle 3–5 pixel beak and wing features needed to separate sibling species. By scaling the input grid to 448×448 pixels and interpolating bicubic positional embeddings:
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li>Vision token count jumped from 256 to 1,024 patches (+300% detail).</li>
            <li>Top-1 accuracy climbed from 70.56% to 79.60% (single model).</li>
            <li>Tri-scale ensemble breached the primary mission target at <strong>80.03% Top-1</strong>.</li>
          </ul>
        </div>
      </div>

      {/* Future Scope */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Lightbulb className="w-4 h-4" />
          Future Roadmap
        </div>
        <h3 className="text-xl font-extrabold text-white mb-4">Planned Architectural Enhancements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <strong className="text-white block font-bold text-sm mb-1">1. Multimodal Audio Fusion</strong>
            Combine visual embeddings with audio spectrogram transformers (AST) on bird calls from the Xeno-Canto archive to resolve visually indistinguishable taxa.
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <strong className="text-white block font-bold text-sm mb-1">2. Spatio-Temporal Prior Maps</strong>
            Incorporate GPS location and day-of-year metadata into a Bayesian prior to rule out geographically impossible species candidates.
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <strong className="text-white block font-bold text-sm mb-1">3. Mobile Edge Quantization</strong>
            Quantize the ONNX graph with INT8 dynamic precision to enable real-time on-device offline inference for field biologists in remote wilderness areas.
          </div>
        </div>
      </div>
    </div>
  );
};
