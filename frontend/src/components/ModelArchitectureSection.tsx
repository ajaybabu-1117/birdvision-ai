import React from 'react';
import { Cpu, Layers, Zap, Award, CheckCircle2, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const ModelArchitectureSection: React.FC = () => {
  const benchmarkData = [
    { name: 'MobileNetV3', top1: 41.69, top5: 65.65, type: 'CNN' },
    { name: 'EfficientNet-B0', top1: 44.91, top5: 69.15, type: 'CNN' },
    { name: 'EfficientNet-B2', top1: 54.93, top5: 76.86, type: 'CNN' },
    { name: 'DINOv2 (Frozen)', top1: 66.01, top5: 84.68, type: 'ViT' },
    { name: 'DINOv2 (224px FT)', top1: 70.56, top5: 85.52, type: 'ViT' },
    { name: 'DINOv2 (336px Reg)', top1: 77.81, top5: 89.81, type: 'ViT' },
    { name: 'DINOv2 (448px Single)', top1: 79.60, top5: 91.12, type: 'ViT' },
    { name: 'Tri-Scale Ensemble', top1: 80.03, top5: 91.22, type: 'Ensemble' },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2">
          <Cpu className="w-4 h-4" />
          Neural Architecture & Engineering
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Why DINOv2 Vision Transformer?
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
          Fine-grained bird classification represents one of the steepest challenges in computer vision. Many sister species share 95%+ identical morphological plumage, differing only by bill curvature, eye-ring shape, or wing bar positioning. Standard Convolutional Neural Networks (CNNs) downsample distant birds into small receptive fields, losing these sub-pixel cues. DINOv2 self-supervised representations provide patch-level attention maps that isolate subtle morphological features across complex natural backgrounds.
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Backbone</span>
            <span className="text-base font-extrabold text-slate-900 mt-1 block">ViT-Base / 14</span>
            <span className="text-xs text-slate-500">14x14 Patch Tokenizer</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Patch Tokens</span>
            <span className="text-base font-extrabold text-slate-900 mt-1 block">1,024 Tokens</span>
            <span className="text-xs text-slate-500">32 × 32 Spatial Grid</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Input Resolution</span>
            <span className="text-base font-extrabold text-slate-900 mt-1 block">448 × 448 px</span>
            <span className="text-xs text-slate-500">+300% detail vs 224px</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Optimization</span>
            <span className="text-base font-extrabold text-slate-900 mt-1 block">ONNX Runtime</span>
            <span className="text-xs text-slate-500">Sub-40ms CPU/GPU Latency</span>
          </div>
        </div>
      </div>

      {/* Benchmark Chart & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              Empirical Evaluation Progression
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Model Benchmark Comparison (Full 14,860 Validation Images)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">1,486 Classes Verified</span>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-72 w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={benchmarkData}
              margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis
                domain={[30, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                unit="%"
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />
              <Bar dataKey="top1" name="Top-1 Accuracy" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="top5" name="Top-5 Accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Model Architecture</th>
                <th className="py-3 px-4">Resolution</th>
                <th className="py-3 px-4">Top-1 Accuracy</th>
                <th className="py-3 px-4">Top-5 Accuracy</th>
                <th className="py-3 px-4">Engineering Technique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">MobileNetV3-Large</td>
                <td className="py-3 px-4 text-slate-500">224 × 224</td>
                <td className="py-3 px-4 font-semibold text-rose-600">41.69%</td>
                <td className="py-3 px-4">65.65%</td>
                <td className="py-3 px-4 text-slate-500">Lightweight Mobile CNN Baseline</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">EfficientNet-B0</td>
                <td className="py-3 px-4 text-slate-500">224 × 224</td>
                <td className="py-3 px-4 font-semibold text-rose-600">44.91%</td>
                <td className="py-3 px-4">69.15%</td>
                <td className="py-3 px-4 text-slate-500">Compound Scaled CNN Baseline</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">EfficientNet-B2</td>
                <td className="py-3 px-4 text-slate-500">288 × 288</td>
                <td className="py-3 px-4 font-semibold text-amber-600">54.93%</td>
                <td className="py-3 px-4">76.86%</td>
                <td className="py-3 px-4 text-slate-500">Legacy Production Model</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">DINOv2 Frozen Backbone</td>
                <td className="py-3 px-4 text-slate-500">224 × 224</td>
                <td className="py-3 px-4 font-semibold text-blue-600">66.01%</td>
                <td className="py-3 px-4">84.68%</td>
                <td className="py-3 px-4 text-slate-500">Linear Probing on Frozen Features</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">DINOv2 Fine-Tuned</td>
                <td className="py-3 px-4 text-slate-500">224 × 224</td>
                <td className="py-3 px-4 font-semibold text-blue-700">70.56%</td>
                <td className="py-3 px-4">85.52%</td>
                <td className="py-3 px-4 text-slate-500">End-to-end Last-2 Block Fine-Tuning</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">DINOv2 Regularized 336px</td>
                <td className="py-3 px-4 text-slate-500">336 × 336</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">77.81%</td>
                <td className="py-3 px-4">89.81%</td>
                <td className="py-3 px-4 text-slate-500">LLRD + Positional Embedding Interpolation</td>
              </tr>
              <tr className="bg-emerald-50/60 font-semibold">
                <td className="py-3 px-4 font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  DINOv2 448px (Production ONNX)
                </td>
                <td className="py-3 px-4 text-emerald-800">448 × 448</td>
                <td className="py-3 px-4 font-extrabold text-emerald-800 text-sm">79.60%</td>
                <td className="py-3 px-4 font-bold text-emerald-800">91.12%</td>
                <td className="py-3 px-4 text-emerald-900 font-medium">Single-Model Graph via ONNX Runtime Engine</td>
              </tr>
              <tr className="bg-teal-50/60 font-semibold">
                <td className="py-3 px-4 font-bold text-teal-950 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-teal-600" />
                  DINOv2 Tri-Scale Ensemble
                </td>
                <td className="py-3 px-4 text-teal-800">Multi-Scale</td>
                <td className="py-3 px-4 font-extrabold text-teal-800 text-sm">80.03%</td>
                <td className="py-3 px-4 font-bold text-teal-800">91.22%</td>
                <td className="py-3 px-4 text-teal-900 font-medium">Weighted Scale Blending (448px, 392px, 336px)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Engineering Innovations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-2">Resolution Scaling (448px)</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Raw photographs in the iNaturalist dataset have a median resolution of 500×375 px. Scaling from 224px to 448px increased token count from 256 to 1,024 patches (+300% detail), preserving diagnostic bill and feather textures.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-2">Layer-wise LR Decay (LLRD)</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Early transformer layers preserve fundamental low-level edge filters learned across 142M images. Using a 0.65 decay rate protected these foundational features while fine-tuning deep attention blocks on avian taxonomy.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-2">ONNX Graph Acceleration</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Positional embeddings were explicitly interpolated and baked into a static-dimension computational graph. This eliminates PyTorch overhead and yields ultra-low latency inference (~25 ms on GPU, ~350 ms on CPU).
          </p>
        </div>
      </div>
    </div>
  );
};
