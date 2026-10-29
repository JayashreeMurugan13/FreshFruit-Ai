import React, { useState, useEffect } from 'react'
import { ImageUploader } from '../components/ImageUploader'
import { PredictionCard } from '../components/PredictionCard'
import { api } from '../services/api'
import type { PredictionResult, ModelInfo } from '../types'
import { Cpu, Info, Sparkles } from 'lucide-react'

export const DetectionPage: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null)

  useEffect(() => {
    api.getModelInfo().then(setModelInfo).catch(() => {})
  }, [])

  const handleAnalyze = async (file: File) => {
    setIsAnalyzing(true)
    setError(null)

    // Store preview for card
    const previewUrl = URL.createObjectURL(file)
    setUploadedPreview(previewUrl)

    try {
      const result = await api.predictFruit(file)
      setPredictionResult(result)
    } catch (err: any) {
      setError(err.message || 'An error occurred during inference. Please verify the backend service is running.')
      setPredictionResult(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    if (uploadedPreview) {
      URL.revokeObjectURL(uploadedPreview)
    }
    setUploadedPreview(null)
    setPredictionResult(null)
    setError(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Heading */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F6EE] border border-[#C2E2BE] text-xs font-semibold text-[#4F7D45]">
          <Sparkles className="w-3.5 h-3.5" />
          Live Vision Inference
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#26332B] tracking-tight">
          Fruit Freshness Detection
        </h1>
        <p className="text-sm sm:text-base text-[#5A6A5E]">
          Upload or capture a fruit image to analyze its visible condition.
        </p>
      </div>

      {/* Model Diagnostic Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAFAF5] border border-[#E7EAE4] text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white border border-[#E7EAE4] flex items-center justify-center text-[#4F7D45]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-[#26332B]">
              Active Engine: {modelInfo?.model_name || 'MobileNetV2 / CNN Core'}
            </span>
            <span className="text-[#5A6A5E] ml-2">
              (Resolution: {modelInfo?.input_size ? `${modelInfo.input_size[0]}×${modelInfo.input_size[1]}` : '224×224'})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              modelInfo?.is_trained ? 'bg-[#E6F4E5] text-[#205423]' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {modelInfo?.is_trained ? 'Trained Model Active' : 'Fallback / Setup Mode'}
          </span>
          <span className="text-[#849688]">Classes: Fresh, Rotten</span>
        </div>
      </div>

      {/* Main Analysis Card or Results Display */}
      {predictionResult ? (
        <PredictionCard
          result={predictionResult}
          uploadedImagePreview={uploadedPreview}
          onReset={handleReset}
        />
      ) : (
        <ImageUploader
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          error={error}
          onClearError={() => setError(null)}
        />
      )}

      {/* Academic Guidelines Notice */}
      <div className="p-4 rounded-2xl bg-white border border-[#E7EAE4] flex items-start gap-3 text-xs text-[#5A6A5E]">
        <Info className="w-4 h-4 text-[#4F7D45] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-[#26332B] mb-0.5">Recommended Capture Tips:</h4>
          <p className="leading-relaxed">
            Position fruit in clear, natural lighting against a neutral background. Avoid extreme glare, heavy shadows, or occlusions for most accurate visual feature extraction.
          </p>
        </div>
      </div>
    </div>
  )
}
