import React, { useState, useRef } from 'react'
import { Upload, Camera, X, Image as ImageIcon, AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react'
import { SampleFruitSelector } from './SampleFruitSelector'

interface ImageUploaderProps {
  onAnalyze: (file: File) => void
  isAnalyzing: boolean
  error?: string | null
  onClearError?: () => void
}

const MAX_FILE_SIZE_MB = 10
const ALLOWED_EXTENSIONS = ['image/jpeg', 'image/png', 'image/webp']

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onAnalyze,
  isAnalyzing,
  error,
  onClearError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const validateAndSetFile = (file: File) => {
    setValidationError(null)
    onClearError?.()

    // Type check
    if (!ALLOWED_EXTENSIONS.includes(file.type)) {
      setValidationError('Unsupported format. Please upload JPG, PNG, or WEBP images only.')
      return
    }

    // Size check
    const sizeInMB = file.size / (1024 * 1024)
    if (sizeInMB > MAX_FILE_SIZE_MB) {
      setValidationError(`File is too large (${sizeInMB.toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`)
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setValidationError(null)
    onClearError?.()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    stopCamera()
  }

  // Camera handling
  const startCamera = async () => {
    setCameraError(null)
    setIsCameraActive(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err: any) {
      setIsCameraActive(false)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please grant camera permission in your browser settings to take live fruit photos.')
      } else {
        setCameraError('Unable to access camera on this device. Please use file upload instead.')
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
    setCameraError(null)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
        validateAndSetFile(file)
        stopCamera()
      }
    }, 'image/jpeg', 0.95)
  }

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      onAnalyze(selectedFile)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E7EAE4] p-6 sm:p-8 shadow-sm">
      {/* Upload Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#26332B] mb-1">
          Provide Fruit Image
        </h2>
        <p className="text-sm text-[#5A6A5E]">
          Drag and drop, browse your local drive, take a live camera snapshot, or select a test sample.
        </p>
      </div>

      {/* Camera Error Alert */}
      {cameraError && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Camera Notice</p>
            <p className="text-xs text-amber-700 mt-0.5">{cameraError}</p>
          </div>
          <button onClick={() => setCameraError(null)} className="text-amber-600 hover:text-amber-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* General / Validation Error */}
      {(validationError || error) && (
        <div className="mb-4 p-3.5 rounded-xl bg-[#FCE8E6] border border-[#F5BEBA] text-[#8E2522] text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#8E2522] mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Upload Notice</p>
            <p className="text-xs mt-0.5">{validationError || error}</p>
          </div>
          <button onClick={() => { setValidationError(null); onClearError?.() }} className="text-[#8E2522] hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Upload / Camera / Preview Area */}
      {isCameraActive ? (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-[4/3] flex flex-col items-center justify-center border border-[#E7EAE4]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 px-4">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-6 py-2.5 rounded-full bg-[#4F7D45] hover:bg-[#3E6336] text-white text-sm font-medium shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              Capture Fruit Photo
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#26332B] text-sm font-medium shadow-md transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-[#E7EAE4] bg-[#FAFAF5] flex flex-col sm:flex-row items-center gap-6 p-4">
          <div className="relative w-full sm:w-64 aspect-square rounded-xl overflow-hidden border border-[#E7EAE4] bg-white flex-shrink-0">
            <img
              src={previewUrl}
              alt="Uploaded fruit preview"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#4F7D45]" />
              <h3 className="font-medium text-[#26332B]">Image Ready for Analysis</h3>
            </div>
            <div className="text-xs text-[#5A6A5E] space-y-1 bg-white p-3 rounded-lg border border-[#E7EAE4]">
              <p><strong className="text-[#26332B]">File:</strong> {selectedFile?.name}</p>
              <p><strong className="text-[#26332B]">Size:</strong> {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB</p>
              <p><strong className="text-[#26332B]">Type:</strong> {selectedFile?.type}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="text-xs text-[#4F7D45] hover:underline font-medium"
              >
                Choose different file
              </button>
              <span className="text-[#E7EAE4]">|</span>
              <button
                type="button"
                onClick={handleReset}
                disabled={isAnalyzing}
                className="text-xs text-[#8E2522] hover:underline font-medium"
              >
                Remove image
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
            isDragging
              ? 'border-[#4F7D45] bg-[#F0F6EE]'
              : 'border-[#E7EAE4] bg-[#FAFAF5] hover:border-[#8FAF76] hover:bg-[#FAFAF5]/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="hidden"
            id="fruit-file-input"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E7EAE4] shadow-sm mx-auto flex items-center justify-center text-[#4F7D45]">
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <p className="font-medium text-[#26332B] text-base">
                Drag and drop your fruit image here
              </p>
              <p className="text-xs text-[#5A6A5E] mt-1">
                Supports JPG, JPEG, PNG, WEBP up to 10 MB
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <label
                htmlFor="fruit-file-input"
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-[#E7EAE4] text-[#26332B] text-sm font-medium shadow-sm transition-all hover:border-[#4F7D45]"
              >
                <ImageIcon className="w-4 h-4 text-[#4F7D45]" />
                Browse Files
              </label>

              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-[#E7EAE4] text-[#26332B] text-sm font-medium shadow-sm transition-all hover:border-[#4F7D45]"
              >
                <Camera className="w-4 h-4 text-[#4F7D45]" />
                Use Camera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#5A6A5E] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#4F7D45]" />
          <span>Real CNN inference pipeline • Evaluates visual texture & color metrics</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            disabled={!selectedFile || isAnalyzing}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#E7EAE4] bg-white text-[#26332B] hover:bg-[#FAFAF5] text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleAnalyzeClick}
            disabled={!selectedFile || isAnalyzing}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#4F7D45] hover:bg-[#3E6336] text-white text-sm font-medium shadow-sm transition-all hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing fruit image…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Freshness</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preprocessing and Inference status indicator */}
      {isAnalyzing && (
        <div className="mt-4 p-4 rounded-xl bg-[#F0F6EE] border border-[#C2E2BE] text-sm text-[#205423] space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-[#4F7D45]" />
            <span>Processing Image & Executing Deep Learning Inference</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#5A6A5E] pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4F7D45] animate-ping" />
              <span>1. Format & RGB Normalization</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4F7D45] animate-ping" />
              <span>2. 224×224 CNN Convolution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4F7D45] animate-ping" />
              <span>3. Softmax Freshness Classification</span>
            </div>
          </div>
        </div>
      )}

      {/* Sample Fruits Quick Selector */}
      <SampleFruitSelector
        onSelectSample={(file) => validateAndSetFile(file)}
        disabled={isAnalyzing}
      />
    </div>
  )
}
