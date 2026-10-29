import React from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  Info,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  History,
} from 'lucide-react'
import type { PredictionResult } from '../types'

interface PredictionCardProps {
  result: PredictionResult
  uploadedImagePreview?: string | null
  onReset: () => void
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  result,
  uploadedImagePreview,
  onReset,
}) => {
  const isFresh = result.prediction === 'Fresh'
  const confidencePercent = Math.round(result.confidence * 100)
  const isLowConfidence = result.confidence < 0.65

  // Circular progress math
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (confidencePercent / 100) * circumference

  const formattedDate = new Date(result.timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="bg-white rounded-3xl border border-[#E7EAE4] p-6 sm:p-8 shadow-md animate-fade-in space-y-6">
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7EAE4]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5A6A5E] block mb-1">
            Visual Quality Assessment Result
          </span>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-base font-semibold ${
                isFresh
                  ? 'bg-[#E6F4E5] text-[#205423] border border-[#C2E2BE]'
                  : 'bg-[#FCE8E6] text-[#8E2522] border border-[#F5BEBA]'
              }`}
            >
              {isFresh ? (
                <CheckCircle2 className="w-5 h-5 text-[#205423]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#8E2522]" />
              )}
              {isFresh ? 'Likely Fresh' : 'Potential Signs of Spoilage'}
            </span>

            <span className="text-xs px-2.5 py-1 rounded-md bg-[#FAFAF5] text-[#5A6A5E] border border-[#E7EAE4] font-mono">
              Class: {result.prediction}
            </span>
          </div>
        </div>

        {/* Model confidence meter */}
        <div className="flex items-center gap-4 bg-[#FAFAF5] p-3 rounded-2xl border border-[#E7EAE4] sm:min-w-[200px]">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="#E7EAE4"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke={isFresh ? '#4F7D45' : '#D64545'}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-[#26332B]">{confidencePercent}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#26332B]">Confidence</p>
            <p className="text-[11px] text-[#5A6A5E]">Model output score</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Image & Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Uploaded Image view */}
        <div className="space-y-2">
          <div className="aspect-square w-full rounded-2xl overflow-hidden border border-[#E7EAE4] bg-[#FAFAF5] shadow-inner flex items-center justify-center relative group">
            {uploadedImagePreview || result.image_url ? (
              <img
                src={uploadedImagePreview || result.image_url}
                alt="Analyzed fruit sample"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-sm text-[#5A6A5E]">No image preview available</span>
            )}

            <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-sm border border-[#E7EAE4] text-xs text-[#26332B] flex items-center justify-between">
              <span className="font-medium">Evaluated Sample</span>
              <span className="text-[#5A6A5E] font-mono">224 × 224 Tensor</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#5A6A5E] px-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {formattedDate}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Cpu className="w-3.5 h-3.5 text-[#4F7D45]" /> {result.model_name}
            </span>
          </div>
        </div>

        {/* Detailed Explanation & Indicators */}
        <div className="space-y-5">
          {/* Scientific Explanation Box */}
          <div className="p-4 rounded-2xl bg-[#FAFAF5] border border-[#E7EAE4] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#26332B]">
              <Info className="w-4 h-4 text-[#4F7D45]" />
              <span>Vision Analysis Explanation</span>
            </div>
            <p className="text-sm text-[#26332B] leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {/* Uncertainty warning if applicable */}
          {(isLowConfidence || result.is_uncertain) && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Prediction Distribution Notice</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                {result.warning ||
                  'The model score is near the decision boundary (between 50% and 65%). This may occur with non-standard fruit varieties, unusual background lighting, or early-stage ripening.'}
              </p>
            </div>
          )}

          {/* Technical Metadata Table */}
          <div className="border border-[#E7EAE4] rounded-2xl overflow-hidden divide-y divide-[#E7EAE4] text-xs">
            <div className="flex items-center justify-between p-3 bg-white">
              <span className="text-[#5A6A5E]">Classification Core</span>
              <span className="font-semibold text-[#26332B]">{result.model_name}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FAFAF5]">
              <span className="text-[#5A6A5E]">Prediction ID</span>
              <span className="font-mono text-[11px] text-[#26332B] truncate max-w-[180px]">
                {result.id}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white">
              <span className="text-[#5A6A5E]">Class Probability</span>
              <span className="font-semibold text-[#26332B]">
                {result.confidence.toFixed(4)} ({confidencePercent}%)
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAFAF5] border border-[#E7EAE4] text-[11px] text-[#5A6A5E]">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>{result.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-[#E7EAE4] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#E7EAE4] bg-white text-[#26332B] hover:bg-[#FAFAF5] text-sm font-medium transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-[#5A6A5E]" />
          Analyze Another Image
        </button>

        <Link
          to="/history"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#4F7D45] hover:bg-[#3E6336] text-white text-sm font-medium transition-all shadow-sm hover:shadow"
        >
          <History className="w-4 h-4" />
          View History Ledger
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
