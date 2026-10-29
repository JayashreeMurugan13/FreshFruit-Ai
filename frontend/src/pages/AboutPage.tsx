import React from 'react'
import {
  BookOpen,
  Target,
  Sparkles,
  Layers,
  Cpu,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Database,
  Code2,
} from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#4F7D45]">
          Academic Engineering Portfolio
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#26332B] tracking-tight">
          About FreshSight AI
        </h1>
        <p className="text-base text-[#5A6A5E] leading-relaxed">
          Deep Learning-Based Fruit Freshness Detection Using Computer Vision.
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-3xl border border-[#E7EAE4] p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-[#26332B] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#4F7D45]" />
          Project Overview
        </h2>
        <p className="text-sm text-[#5A6A5E] leading-relaxed">
          FreshSight AI is an academic machine learning and computer vision web application engineered to address subjective, manual post-harvest fruit quality assessment. Built as an end-to-end full-stack demonstration, it combines rigorous image preprocessing with Convolutional Neural Network (CNN) feature extraction and transparent classification outputs.
        </p>
      </div>

      {/* Problem Statement & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-[#E7EAE4] p-7 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#26332B]">Problem Statement</h3>
          <p className="text-xs text-[#5A6A5E] leading-relaxed">
            In food distribution and domestic storage, sorting fresh produce from decaying fruit relies predominantly on manual visual inspection. Human inspection is prone to fatigue, subjective bias, inconsistent classification standards, and labor inefficiency, leading to premature food waste or cross-contamination in batch storage.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E7EAE4] p-7 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F0F6EE] text-[#4F7D45] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#26332B]">Proposed Solution</h3>
          <p className="text-xs text-[#5A6A5E] leading-relaxed">
            An automated computer vision pipeline that captures fruit images, standardizes tensors through bilinear resizing and RGB normalization, and extracts high-dimensional spatial patterns using convolutional filters. The system delivers rapid binary classification (<strong className="text-[#205423]">Likely Fresh</strong> vs <strong className="text-[#8E2522]">Potential Spoilage</strong>) with probabilistic confidence scores and persistent audit logging.
          </p>
        </div>
      </div>

      {/* Project Objectives */}
      <div className="bg-[#FAFAF5] rounded-3xl border border-[#E7EAE4] p-8 space-y-4">
        <h2 className="text-xl font-bold text-[#26332B] flex items-center gap-2">
          <Target className="w-5 h-5 text-[#4F7D45]" />
          Key Project Objectives
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E7EAE4] text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#4F7D45] flex-shrink-0 mt-0.5" />
            <span className="text-[#26332B]">Implement a reliable convolutional neural network feature extractor and classifier.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E7EAE4] text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#4F7D45] flex-shrink-0 mt-0.5" />
            <span className="text-[#26332B]">Enforce identical preprocessing (RGB conversion, 224×224 scaling, normalization) across training and inference.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E7EAE4] text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#4F7D45] flex-shrink-0 mt-0.5" />
            <span className="text-[#26332B]">Provide real-time webcam capture and drag-and-drop file upload with strict validation.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E7EAE4] text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#4F7D45] flex-shrink-0 mt-0.5" />
            <span className="text-[#26332B]">Persist audit records in an embedded SQLite database with search, filter, and privacy-conscious cleanup.</span>
          </div>
        </div>
      </div>

      {/* Technologies Used */}
      <div className="bg-white rounded-3xl border border-[#E7EAE4] p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-bold text-[#26332B] flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#4F7D45]" />
          Technology Stack
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2 p-4 rounded-2xl bg-[#FAFAF5] border border-[#E7EAE4]">
            <h4 className="font-semibold text-sm text-[#26332B] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#4F7D45]" /> Frontend
            </h4>
            <ul className="space-y-1.5 text-[#5A6A5E]">
              <li>• React 19 & TypeScript</li>
              <li>• Vite 8 Build Tooling</li>
              <li>• Tailwind CSS Design System</li>
              <li>• Lucide React Vector Icons</li>
              <li>• HTML5 MediaDevices API</li>
            </ul>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-[#FAFAF5] border border-[#E7EAE4]">
            <h4 className="font-semibold text-sm text-[#26332B] flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#4F7D45]" /> Backend & CV
            </h4>
            <ul className="space-y-1.5 text-[#5A6A5E]">
              <li>• FastAPI Asynchronous Server</li>
              <li>• Python 3.14 Environment</li>
              <li>• Pillow (PIL) Image Pipeline</li>
              <li>• NumPy 2.4 Vectorized Math</li>
              <li>• Scikit-learn Evaluation Metrics</li>
            </ul>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-[#FAFAF5] border border-[#E7EAE4]">
            <h4 className="font-semibold text-sm text-[#26332B] flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#4F7D45]" /> Storage & ML
            </h4>
            <ul className="space-y-1.5 text-[#5A6A5E]">
              <li>• SQLite Relational Ledger</li>
              <li>• Conv2D Feature Extractor</li>
              <li>• Global Average Pooling</li>
              <li>• Softmax Decision Boundaries</li>
              <li>• Automated Temp Cleanup</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Limitations and Future Enhancements */}
      <div className="bg-white rounded-3xl border border-[#E7EAE4] p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-bold text-[#26332B] flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#4F7D45]" />
          Limitations & Future Enhancements
        </h2>

        <div className="space-y-4 text-xs text-[#5A6A5E] leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <h4 className="font-bold text-amber-900 mb-1">Current Academic Limitations:</h4>
            <p className="text-amber-800">
              The model identifies visual surface patterns learned exclusively from its training dataset. It assesses external visible condition only and cannot detect internal hollow heart, unseen microbial fungal spores, or internal core rot. Extreme shadows, background clutter, or non-fruit objects may skew feature distributions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAFAF5] border border-[#E7EAE4] space-y-1">
              <h4 className="font-semibold text-sm text-[#26332B]">Multi-Class Fruit Variety Expansion</h4>
              <p>Extend dataset annotations to support simultaneous fruit species recognition (e.g., distinguishing between Granny Smith vs Red Delicious) along with graded ripeness stages.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAFAF5] border border-[#E7EAE4] space-y-1">
              <h4 className="font-semibold text-sm text-[#26332B]">Multispectral / Hyperspectral Imaging</h4>
              <p>Integrate near-infrared (NIR) sensory bands to detect internal sugar content (Brix index) and subsurface tissue bruising invisible to standard RGB cameras.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
