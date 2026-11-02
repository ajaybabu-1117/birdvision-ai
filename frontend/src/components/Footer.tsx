import React from 'react';
import { Bird, ExternalLink, Code2, Server } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-16 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
            <Bird className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-extrabold text-sm tracking-tight">BirdVision AI</div>
            <div className="text-slate-500 text-[11px]">Avian Biodiversity Vision Transformer Platform</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-medium">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Server className="w-3.5 h-3.5" />
            FastAPI Swagger Docs
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <a
            href="https://github.com/facebookresearch/dinov2"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            Meta DINOv2 Research
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <a
            href="https://www.inaturalist.org/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            iNaturalist Archive
          </a>
        </div>

        <div className="text-slate-500 text-[11px] text-center md:text-right">
          Built with React 18, Vite, Tailwind CSS & FastAPI.<br />
          Trained on NVIDIA RTX 3050 GPU.
        </div>
      </div>
    </footer>
  );
};
