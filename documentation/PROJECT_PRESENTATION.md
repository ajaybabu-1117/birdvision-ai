# BirdVision AI — Project Presentation & Viva Defense Deck

---

## Slide 1: Title & Executive Summary
- **Project Title:** BirdVision AI — Large-Scale Avian Biodiversity Classification with Vision Transformers
- **Tagline:** Discover the World of Birds with Artificial Intelligence
- **Presenter:** Senior AI/ML & Full-Stack Engineer
- **Core Achievement:** Classified **1,486 bird species** with **80.03% Top-1 Accuracy** (91.22% Top-5) using fine-tuned DINOv2 at 448×448 resolution and multi-scale ensemble routing.

---

## Slide 2: Problem Statement & Motivation
- **The Biodiversity Imperative:** Birds are primary indicators of ecological health and climate shifts.
- **The Technical Bottleneck:** 1,486 species worldwide exhibit subtle fine-grained visual differences. Sister species in the same genus (e.g. *Chaetura*, *Dryobates*, *Empidonax*) differ by minuscule beak ratios or wing bars.
- **Why CNN Baselines Fail:**
  - Downsampling distant birds in photographs obliterates sub-pixel diagnostic markings.
  - MobileNetV3 reached only **41.69%**, and EfficientNet-B2 plateaued at **54.93%**.

---

## Slide 3: Dataset & Data Pipeline
- **Dataset:** iNaturalist 2021 Mini (Avian subset).
- **Scale:**
  - 1,486 Bird Classes.
  - 74,300 Training Images (~50 per species).
  - 14,860 Held-Out Validation Images (exactly 10 per species).
- **Integrity Guarantee:** Zero synthetic inflation; all metrics verified across all 14,860 validation images.

---

## Slide 4: Neural Architecture & Engineering Innovations
1. **DINOv2 ViT-Base/14:**
   - 87.7 Million parameters with self-supervised patch representations.
   - 12 Transformer layers, 12 attention heads, 768 hidden dimension.
2. **Resolution Scaling to 448 × 448:**
   - Patch token count quadrupled from 256 to **1,024 tokens** (32×32 grid).
   - Bicubic 2D positional embedding interpolation preserved spatial frequencies.
3. **Layer-wise Learning Rate Decay (LLRD):**
   - 0.65 decay factor across unfreezed blocks 8–11; preserved foundational edge filters while specializing attention heads.
4. **ONNX Graph Compilation:**
   - Exported static computational graph for sub-40ms production inference.

---

## Slide 5: Empirical Results & Progression

| Model Architecture | Input Grid | Top-1 Accuracy | Top-5 Accuracy | Macro F1 |
|---|:---:|:---:|:---:|:---:|
| MobileNetV3-Large | 224px | 41.69% | 65.65% | 40.12% |
| EfficientNet-B0 | 224px | 44.91% | 69.15% | 43.80% |
| EfficientNet-B2 (Baseline) | 288px | 54.93% | 76.86% | 53.48% |
| DINOv2 Frozen Backbone | 224px | 66.01% | 84.68% | 65.12% |
| DINOv2 Fine-Tuned | 224px | 70.56% | 85.52% | 69.84% |
| DINOv2 Regularized | 336px | 77.81% | 89.81% | 77.74% |
| **DINOv2 Production ONNX** | **448px** | **79.60%** | **91.12%** | **79.58%** |
| **DINOv2 Tri-Scale Ensemble** | **Multi** | **80.03%** | **91.22%** | **80.02%** |

---

## Slide 6: Deep Error Analysis Findings
- **Intra-Genus Confinement:** 38.3% of all errors and **100% of the top 15 confusion pairs** occur between sibling species in the *exact same genus*.
- **The Near-Miss Phenomenon:** 56.1% of misclassified birds had their true species ranked in the Top-5 (45.5% in the Top-3).
- **Epistemic Uncertainty:** The model's confidence drops from **87.4% on correct predictions** to **24.8% on errors**, proving the network is aware of its uncertainty.

---

## Slide 7: Web Application & System Implementation
- **Frontend Tier:** React 18, TypeScript, Vite, Tailwind CSS, Recharts.
- **Backend Tier:** FastAPI, Uvicorn, ONNX Runtime, PyTorch.
- **Key Features:**
  - Drag-and-drop image upload with live client-side validation.
  - 1-Click test picker with 6 real validation samples.
  - High-Speed ONNX vs Research Ensemble switch.
  - Rich Linnaean taxonomy cards (Order, Family, Genus) and external links to iNaturalist / Wikipedia.
  - Searchable directory of all 1,486 bird species.
  - Interactive Recharts benchmark visualization.

---

## Slide 8: Demonstration Workflow
1. Launch full stack via `web_application/start_all.bat`.
2. Select sample bird *Buteo lagopus* (Rough-legged Hawk).
3. Observe instant classification: Top-1 80.61% confidence, ~30 ms latency, correct family (*Accipitridae*).
4. Upload challenging custom image and toggle Tri-Scale Ensemble for research-grade verification.
5. Explore the 1,486-species directory with family filters.

---

## Slide 9: Conclusion & Viva Questions Summary
- **Q1: Why did resolution scaling provide such a high gain?**  
  *A:* Avian photographs in iNaturalist have a median size of 500×375px. Downsampling to 224px compressed distant birds into ~25 tokens. 448px provided 1,024 tokens (+300% detail), recovering diagnostic beak and wing bars.
- **Q2: Why use ONNX Runtime instead of native PyTorch in production?**  
  *A:* ONNX Runtime eliminates Python GIL overhead, fuses memory operations, and delivers sub-40ms latency with minimal RAM footprint.
