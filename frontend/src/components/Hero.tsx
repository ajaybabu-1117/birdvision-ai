import React from 'react';
import { Bird, ShieldCheck, Zap, Layers } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/40">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-600/20 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
          Fine-Grained Avian Biodiversity Classifier
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
          Identify Any Bird with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Artificial Intelligence</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          Discover the World of Birds with Artificial Intelligence. Powered by self-supervised Vision Transformers fine-tuned on global biodiversity datasets.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bird className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">1,486</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Global Species</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">80.03%</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Top-1 Accuracy</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">448 px</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">DINOv2 ViT Grid</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">~30 ms</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">GPU Inference</div>
          </div>
        </div>
      </div>
    </div>
  );
};
