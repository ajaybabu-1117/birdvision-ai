import React from 'react';
import { PredictionResponse } from '../types';
import { CheckCircle2, Award, Clock, Layers, ExternalLink, Globe } from 'lucide-react';

interface PredictionResultCardProps {
  result: PredictionResponse;
  previewUrl: string | null;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  result,
  previewUrl,
}) => {
  const { predicted_species, top_5_predictions, latency_ms, resolution, benchmark_accuracy, model } = result;

  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(predicted_species.scientific_name.replace(' ', '_'))}`;
  const inatUrl = predicted_species.inaturalist_id 
    ? `https://www.inaturalist.org/taxa/${predicted_species.inaturalist_id}`
    : `https://www.inaturalist.org/taxa/search?q=${encodeURIComponent(predicted_species.scientific_name)}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
      {/* Top Header Badge */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
            <CheckCircle2 className="w-4 h-4" />
            Top AI Identification
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {predicted_species.common_name}
          </h2>
          <p className="text-sm text-slate-300 italic font-medium">
            {predicted_species.scientific_name}
          </p>
        </div>

        {/* Confidence Badge */}
        <div className="flex flex-col items-start sm:items-end bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20">
          <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">Model Confidence</span>
          <span className="text-2xl font-black text-emerald-300">
            {predicted_species.confidence_percent.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Preview + Taxonomy */}
        <div className="lg:col-span-5 space-y-4">
          {previewUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video sm:aspect-square max-h-[300px] flex items-center justify-center">
              <img
                src={previewUrl}
                alt={predicted_species.common_name}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Taxonomy Details Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              Taxonomic Classification
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Order</span>
                <span className="font-semibold text-slate-800">{predicted_species.order || 'Aves'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Family</span>
                <span className="font-semibold text-slate-800">{predicted_species.family || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Genus</span>
                <span className="font-semibold text-slate-800">{predicted_species.genus}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Species</span>
                <span className="font-semibold text-slate-800 italic">{predicted_species.scientific_name.split(' ')[1] || ''}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
              <a
                href={inatUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold text-[11px] transition-colors"
              >
                <Globe className="w-3 h-3" />
                iNaturalist Taxon
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              <a
                href={wikiUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-semibold text-[11px] transition-colors"
              >
                Wikipedia
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Top 5 Probability Bars & Inference Metrics */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                Top 5 Prediction Probabilities
              </h3>
              <span className="text-xs text-slate-500 font-medium">Ranked by softmax likelihood</span>
            </div>

            <div className="space-y-3">
              {top_5_predictions.map((candidate, idx) => {
                const isTop1 = idx === 0;
                return (
                  <div
                    key={candidate.class_id}
                    className={`p-3 rounded-xl border transition-all ${
                      isTop1
                        ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center ${
                            isTop1
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {candidate.rank}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-900 mr-2">
                            {candidate.common_name}
                          </span>
                          <span className="text-[11px] text-slate-500 italic hidden sm:inline">
                            {candidate.scientific_name}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-extrabold text-slate-800">
                        {candidate.confidence_percent.toFixed(2)}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isTop1
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.max(candidate.confidence_percent, 1.5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Engine & Latency Specs Footer */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/90 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Latency: <strong className="text-slate-900 ml-0.5">{latency_ms} ms</strong>
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Grid: <strong className="text-slate-900 ml-0.5">{resolution}</strong>
              </span>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Verified Benchmark: <strong className="text-emerald-700 font-bold">{benchmark_accuracy.top1_validation_accuracy} Top-1</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
