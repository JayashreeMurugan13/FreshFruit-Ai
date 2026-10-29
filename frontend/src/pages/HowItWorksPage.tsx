import React from 'react'
import { ArchitectureDiagram } from '../components/ArchitectureDiagram'
import {
  Cpu,
  Eye,
  Maximize2,
  Box,
  Binary,
} from 'lucide-react'

export const HowItWorksPage: React.FC = () => {
  const cnnConcepts = [
    {
      title: '1. Convolution Layers (Conv2D)',
      icon: Eye,
      description:
        'Convolutions apply small learnable matrix filters (e.g. 3×3 kernels) that slide across the image tensor. In early layers, filters detect low-level primitives like edges and surface contours. Deeper filters detect complex spoilage patterns like browning clusters, lesions, or mold growth.',
      badge: 'Feature Extraction',
    },
    {
      title: '2. Activation Functions (ReLU)',
      icon: Binary,
      description:
        'Rectified Linear Units (ReLU) introduce mathematical non-linearity: f(x) = max(0, x). This enables the neural network to model complex non-linear surface variations, discoloration gradients, and boundary transitions that linear models fail to capture.',
      badge: 'Non-Linearity',
    },
    {
      title: '3. Pooling Layers (MaxPooling2D)',
      icon: Maximize2,
      description:
        'Max Pooling downsamples spatial feature maps (e.g. 2×2 window with stride 2). This achieves spatial invariance (recognizing decay spots regardless of their exact pixel coordinate) while drastically reducing parameter count and computational complexity.',
      badge: 'Dimensionality Reduction',
    },
    {
      title: '4. Global Average Pooling & Flatten',
      icon: Box,
      description:
        'Instead of massive fully connected bridges that cause overfitting, Global Average Pooling (GAP) collapses each spatial feature map into a single average value, creating a compact feature embedding of the fruit condition.',
      badge: 'Feature Aggregation',
    },
    {
      title: '5. Classification Head (Dense & Softmax)',
      icon: Cpu,
      description:
        'The final dense layer projects the high-level feature vector into two class logits: Fresh and Rotten. Softmax normalizes these logits into calibrated posterior probabilities that sum to 1.0, representing model confidence.',
      badge: 'Class Probability',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#4F7D45]">
          Technical Deep Dive
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#26332B] tracking-tight">
          How FreshSight AI Works
        </h1>
        <p className="text-base text-[#5A6A5E] leading-relaxed">
          From raw camera pixels to convolutional activations and probabilistic classification: explore the complete computer vision engineering pipeline.
        </p>
      </div>

      {/* Interactive Architecture Flowchart */}
      <ArchitectureDiagram />

      {/* Step by Step Breakdown */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4F7D45]">
            Execution Steps
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#26332B] mt-1">
            The 5 Pipeline Stages
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E7EAE4] shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-[#4F7D45]">Stage 1</span>
            <h3 className="font-semibold text-sm text-[#26332B]">Acquisition</h3>
            <p className="text-xs text-[#5A6A5E] leading-relaxed">
              Accepts image through drag-and-drop file upload or direct browser webcam media stream.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7EAE4] shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-[#4F7D45]">Stage 2</span>
            <h3 className="font-semibold text-sm text-[#26332B]">Preprocessing</h3>
            <p className="text-xs text-[#5A6A5E] leading-relaxed">
              Validates decoding headers, forces RGB channels, resizes to 224×224, and scales pixel tensors.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7EAE4] shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-[#4F7D45]">Stage 3</span>
            <h3 className="font-semibold text-sm text-[#26332B]">Feature Extraction</h3>
            <p className="text-xs text-[#5A6A5E] leading-relaxed">
              Deep convolutional filters compute spatial gradients for surface lesions, mold, and hue shifts.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7EAE4] shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-[#4F7D45]">Stage 4</span>
            <h3 className="font-semibold text-sm text-[#26332B]">Classification</h3>
            <p className="text-xs text-[#5A6A5E] leading-relaxed">
              Dense layer outputs calibrated probability scores for Fresh versus Rotten classes.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7EAE4] shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-[#4F7D45]">Stage 5</span>
            <h3 className="font-semibold text-sm text-[#26332B]">Display & Ledger</h3>
            <p className="text-xs text-[#5A6A5E] leading-relaxed">
              Results panel displays confidence indicator, explanations, and logs record to SQLite history.
            </p>
          </div>
        </div>
      </div>

      {/* CNN Layers In-Depth Explanation */}
      <div className="bg-[#FAFAF5] rounded-3xl border border-[#E7EAE4] p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4F7D45]">
            Neural Network Principles
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#26332B] mt-1">
            Understanding CNN Anatomy
          </h2>
          <p className="text-sm text-[#5A6A5E] mt-2">
            How hierarchical convolutional architectures recognize visual biological spoilage patterns without manual feature engineering.
          </p>
        </div>

        <div className="space-y-4">
          {cnnConcepts.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E7EAE4] p-5 shadow-xs flex flex-col sm:flex-row items-start gap-4 hover:border-[#8FAF76] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F0F6EE] text-[#4F7D45] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-[#26332B]">{item.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAFAF5] text-[#5A6A5E] border border-[#E7EAE4]">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A6A5E] leading-relaxed">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
