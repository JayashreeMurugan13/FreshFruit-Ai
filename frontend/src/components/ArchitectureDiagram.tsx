import React from 'react'
import {
  User,
  UploadCloud,
  FileCheck2,
  SlidersHorizontal,
  Cpu,
  Sparkles,
  LayoutDashboard,
  Database,
  ArrowRight,
} from 'lucide-react'

const PIPELINE_STEPS = [
  {
    icon: User,
    title: 'User',
    subtitle: 'Client Browser',
    desc: 'Captures webcam photo or uploads JPEG/PNG/WEBP fruit image',
    badge: 'Input',
  },
  {
    icon: UploadCloud,
    title: 'Upload & Transport',
    subtitle: 'FastAPI Multipart',
    desc: 'Safely receives binary payload with file size verification (< 10 MB)',
    badge: 'API',
  },
  {
    icon: FileCheck2,
    title: 'Validation',
    subtitle: 'Format & Integrity',
    desc: 'Verifies Pillow image decoding, validates header, rejects corrupted data',
    badge: 'Security',
  },
  {
    icon: SlidersHorizontal,
    title: 'Preprocessing',
    subtitle: 'RGB Tensor',
    desc: 'Converts to RGB, resizes to 224×224, applies normalization [-1, 1]',
    badge: 'Vision',
  },
  {
    icon: Cpu,
    title: 'Trained CNN',
    subtitle: 'Deep Learning',
    desc: 'Convolutions extract spatial color/texture patterns; GAP & Dense output layer',
    badge: 'AI Core',
    highlight: true,
  },
  {
    icon: Sparkles,
    title: 'Prediction',
    subtitle: 'Softmax / Sigmoid',
    desc: 'Generates class confidence (Likely Fresh vs Potential Spoilage)',
    badge: 'Inference',
  },
  {
    icon: LayoutDashboard,
    title: 'Results Display',
    subtitle: 'React Interface',
    desc: 'Renders confidence meter, visual explanation, and safety disclaimer',
    badge: 'UI / UX',
  },
  {
    icon: Database,
    title: 'History Ledger',
    subtitle: 'SQLite Database',
    desc: 'Persists prediction record, timestamp, and metadata without data leaks',
    badge: 'Storage',
  },
]

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-[#E7EAE4] p-6 sm:p-8 shadow-sm">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#4F7D45]">
          End-to-End System Architecture
        </span>
        <h3 className="text-2xl font-bold text-[#26332B] mt-1">
          Computer Vision & Inference Pipeline
        </h3>
        <p className="text-sm text-[#5A6A5E] mt-2">
          Structured dataflow from initial user acquisition down to tensor convolution and permanent ledger storage.
        </p>
      </div>

      {/* Grid of pipeline stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon
          return (
            <div
              key={idx}
              className={`relative rounded-2xl p-5 border transition-all hover:shadow-md flex flex-col justify-between ${
                step.highlight
                  ? 'bg-[#F0F6EE] border-[#C2E2BE] shadow-sm'
                  : 'bg-[#FAFAF5] border-[#E7EAE4]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      step.highlight
                        ? 'bg-[#4F7D45] text-white shadow-sm'
                        : 'bg-white border border-[#E7EAE4] text-[#4F7D45]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                      step.highlight
                        ? 'bg-[#4F7D45] text-white'
                        : 'bg-white text-[#5A6A5E] border border-[#E7EAE4]'
                    }`}
                  >
                    Step {idx + 1}
                  </span>
                </div>

                <div className="mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#849688]">
                    {step.badge}
                  </span>
                  <h4 className="text-base font-semibold text-[#26332B]">{step.title}</h4>
                  <p className="text-xs font-mono text-[#4F7D45]">{step.subtitle}</p>
                </div>

                <p className="text-xs text-[#5A6A5E] leading-relaxed mt-2">{step.desc}</p>
              </div>

              {idx < PIPELINE_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-white border border-[#E7EAE4] flex items-center justify-center text-[#849688] shadow-xs">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
