import React from 'react';
import { Bird, Activity, Sparkles, BookOpen, Cpu, Info } from 'lucide-react';
import { HealthResponse } from '../types';

interface NavbarProps {
  health: HealthResponse | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ health, activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('identify')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <Bird className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">BirdVision</span>
                <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">AI</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">1,486 Species Classification</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('identify')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'identify'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Identify Bird
            </button>

            <button
              onClick={() => setActiveTab('species')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'species'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Species Catalog
            </button>

            <button
              onClick={() => setActiveTab('model')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'model'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-600" />
              Model & Tech
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'about'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Info className="w-4 h-4 text-emerald-600" />
              About Project
            </button>
          </nav>

          {/* Backend Status Badge */}
          <div className="flex items-center gap-2">
            {health ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-xs font-medium text-emerald-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span className="hidden sm:inline">Engine:</span>
                <span className="font-semibold">{health.device || 'Active'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
                <Activity className="w-3.5 h-3.5 animate-spin" />
                Connecting...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-t border-slate-200 bg-white px-2 py-1 justify-around text-xs">
        <button
          onClick={() => setActiveTab('identify')}
          className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
            activeTab === 'identify' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Identify
        </button>
        <button
          onClick={() => setActiveTab('species')}
          className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
            activeTab === 'species' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Species
        </button>
        <button
          onClick={() => setActiveTab('model')}
          className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
            activeTab === 'model' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Model
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
            activeTab === 'about' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Info className="w-4 h-4" />
          About
        </button>
      </div>
    </header>
  );
};
