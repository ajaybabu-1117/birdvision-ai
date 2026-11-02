import React from 'react';
import { SampleBird } from '../types';
import { getSampleImageUrl } from '../services/api';
import { Sparkles } from 'lucide-react';

interface SamplePickerProps {
  samples: SampleBird[];
  onSelectSample: (sample: SampleBird) => void;
  isLoading: boolean;
  selectedSampleId: string | null;
}

export const SamplePicker: React.FC<SamplePickerProps> = ({
  samples,
  onSelectSample,
  isLoading,
  selectedSampleId,
}) => {
  if (!samples || samples.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-800">
            Quick Test Samples
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">Click to classify instantly</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {samples.map((sample) => {
          const isSelected = selectedSampleId === sample.id;
          return (
            <button
              key={sample.id}
              disabled={isLoading}
              onClick={() => onSelectSample(sample)}
              className={`group flex flex-col items-center text-left rounded-xl overflow-hidden border p-2 transition-all ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/50'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md bg-slate-50/60'
              } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-200 mb-2 relative">
                <img
                  src={getSampleImageUrl(sample.url)}
                  alt={sample.common_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="w-full">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {sample.common_name}
                </p>
                <p className="text-[11px] text-slate-500 italic truncate">
                  {sample.scientific_name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
