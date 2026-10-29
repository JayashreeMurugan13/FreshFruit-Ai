import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  History,
  CheckCircle2,
  BarChart3,
} from 'lucide-react'
import { api } from '../services/api'
import type { StatsSummary, HealthStatus } from '../types'

export const HomePage: React.FC = () => {
  const [stats, setStats] = useState<StatsSummary | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {})
    api.getHealth().then(setHealth).catch(() => {})
  }, [])

  const supportedFruits = [
    {
      name: 'Apples',
      status: 'Active in Model',
      badgeClass: 'bg-[#E6F4E5] text-[#205423]',
      image: '/assets/fresh_apple.jpg',
      indicators: 'Red / green hue uniformity, stem condition, skin firmness',
    },
    {
      name: 'Bananas',
      status: 'Active in Model',
      badgeClass: 'bg-[#E6F4E5] text-[#205423]',
      image: '/assets/fresh_banana.jpg',
      indicators: 'Yellow peel saturation, browning spot cluster size, peel integrity',
    },
    {
      name: 'Oranges',
      status: 'Active in Model',
      badgeClass: 'bg-[#E6F4E5] text-[#205423]',
      image: '/assets/fresh_orange.jpg',
      indicators: 'Pebbled texture uniformity, mold discoloration, surface depression',
    },
    {
      name: 'Grapes',
      status: 'Evaluation Set',
      badgeClass: 'bg-[#FAFAF5] text-[#5A6A5E] border border-[#E7EAE4]',
      image: '/assets/hero_fruits.jpg',
      indicators: 'Berry plumpness, shriveling signs, cluster stem hydration',
    },
    {
      name: 'Strawberries',
      status: 'Evaluation Set',
      badgeClass: 'bg-[#FAFAF5] text-[#5A6A5E] border border-[#E7EAE4]',
      image: '/assets/hero_fruits.jpg',
      indicators: 'Achene preservation, calyx freshness, soft mold detection',
    },
    {
      name: 'Mangoes',
      status: 'Planned Extension',
      badgeClass: 'bg-[#FAFAF5] text-[#849688] border border-[#E7EAE4]',
      image: '/assets/hero_fruits.jpg',
      indicators: 'Skin pigmentation shifts, shoulder fullness, fungal speckling',
    },
  ]

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F6EE] border border-[#C2E2BE] text-xs font-semibold text-[#4F7D45] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Fruit Quality Analysis
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#26332B] leading-[1.12]">
                Know Your Fruit. <br />
                <span className="text-[#4F7D45]">Choose Fresh.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#5A6A5E] max-w-xl leading-relaxed">
                Detect fruit freshness in seconds using deep learning and computer vision. Upload a fruit image and let AI analyze its visible surface condition and spoilage indicators.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/detect"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#4F7D45] hover:bg-[#3E6336] text-white font-medium text-base shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze Fruit
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#FAFAF5] border border-[#E7EAE4] text-[#26332B] font-medium text-base transition-colors"
                >
                  Explore How It Works
                  <ArrowRight className="w-4 h-4 text-[#5A6A5E]" />
                </Link>
              </div>

              {/* Supporting Labels */}
              <div className="pt-6 border-t border-[#E7EAE4] flex flex-wrap items-center gap-6 text-xs text-[#5A6A5E]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4F7D45]" />
                  <span className="font-medium text-[#26332B]">Image-Based Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4F7D45]" />
                  <span className="font-medium text-[#26332B]">CNN-Powered Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4F7D45]" />
                  <span className="font-medium text-[#26332B]">Simple and Fast</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#E7EAE4] shadow-xl bg-white p-2">
                <img
                  src="/assets/hero_fruits.jpg"
                  alt="Arrangement of fresh apples, bananas, grapes, and oranges under natural daylight"
                  className="w-full h-auto rounded-2xl object-cover aspect-[4/3]"
                />

                {/* Floating model status pill */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E7EAE4] shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F6EE] text-[#4F7D45] flex items-center justify-center font-bold">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#26332B]">MobileNetV2 / CNN Core</p>
                      <p className="text-[11px] text-[#5A6A5E]">
                        {health?.model_available ? 'Active • Real Inference Engine' : 'Setup Ready • Offline Mode'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#E6F4E5] text-[#205423] font-medium font-mono">
                    224×224
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Quick 3 Steps */}
      <section className="bg-[#FAFAF5] py-16 border-y border-[#E7EAE4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4F7D45]">
              Streamlined Process
            </span>
            <h2 className="text-3xl font-bold text-[#26332B] mt-1">
              How FreshSight AI Works
            </h2>
            <p className="text-sm text-[#5A6A5E] mt-2">
              Three simple steps from image acquisition to deep learning visual evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-[#E7EAE4] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F0F6EE] text-[#4F7D45] flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-semibold text-[#26332B]">Upload an Image</h3>
              <p className="text-sm text-[#5A6A5E] leading-relaxed">
                Provide a photo of an apple, banana, or orange via drag-and-drop file upload or take an instant snapshot using your camera.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E7EAE4] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F0F6EE] text-[#4F7D45] flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-semibold text-[#26332B]">AI Analyzes the Fruit</h3>
              <p className="text-sm text-[#5A6A5E] leading-relaxed">
                Our Convolutional Neural Network processes spatial color distribution, skin browning, texture irregularities, and degradation patterns.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E7EAE4] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F0F6EE] text-[#4F7D45] flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-semibold text-[#26332B]">View Freshness Results</h3>
              <p className="text-sm text-[#5A6A5E] leading-relaxed">
                Receive an immediate classification (<strong className="text-[#205423]">Likely Fresh</strong> or <strong className="text-[#8E2522]">Potential Spoilage</strong>), along with confidence metrics and technical explanations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4F7D45]">
            Engineering Highlights
          </span>
          <h2 className="text-3xl font-bold text-[#26332B] mt-1">
            Built for Academic Precision
          </h2>
          <p className="text-sm text-[#5A6A5E] mt-2">
            No simulated or fabricated scores. Every metric is driven by genuine computer vision operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E7EAE4] hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F6EE] text-[#4F7D45] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#26332B]">Deep Learning CNN</h3>
            <p className="text-xs text-[#5A6A5E] leading-relaxed">
              Convolutional layers extract visual features like decay contours, spots, and surface texture gradients.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7EAE4] hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F6EE] text-[#4F7D45] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#26332B]">Image Preprocessing</h3>
            <p className="text-xs text-[#5A6A5E] leading-relaxed">
              Strict RGB conversion, bilinear aspect resizing to 224×224, and standardized pixel normalization.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7EAE4] hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F6EE] text-[#4F7D45] flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#26332B]">Confidence Score</h3>
            <p className="text-xs text-[#5A6A5E] leading-relaxed">
              Real model output probability with clear uncertainty warnings when inputs fall outside expected distributions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7EAE4] hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F6EE] text-[#4F7D45] flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#26332B]">Prediction History</h3>
            <p className="text-xs text-[#5A6A5E] leading-relaxed">
              Persistent SQLite ledger storing timestamps, confidence scores, and visual thumbnail records.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Categories */}
      <section className="bg-[#FAFAF5] py-16 border-y border-[#E7EAE4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4F7D45]">
                Category Coverage
              </span>
              <h2 className="text-3xl font-bold text-[#26332B] mt-1">
                Supported Fruit Categories
              </h2>
              <p className="text-sm text-[#5A6A5E] mt-1 max-w-xl">
                A fruit variety is labeled active only if the underlying model was trained and evaluated on that domain.
              </p>
            </div>
            <Link
              to="/detect"
              className="text-xs font-semibold text-[#4F7D45] hover:underline flex items-center gap-1"
            >
              Test fruit detection <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportedFruits.map((fruit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E7EAE4] p-5 shadow-sm space-y-3 hover:border-[#8FAF76] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#26332B]">{fruit.name}</h3>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${fruit.badgeClass}`}>
                    {fruit.status}
                  </span>
                </div>
                <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#FAFAF5] border border-[#E7EAE4]">
                  <img
                    src={fruit.image}
                    alt={fruit.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-[#5A6A5E] leading-relaxed">
                  <strong className="text-[#26332B]">Visual Features:</strong> {fruit.indicators}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Ledger Stats Widget */}
      {stats && stats.total_predictions > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#E7EAE4] p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4F7D45]">
                  Live Application Ledger
                </span>
                <h3 className="text-2xl font-bold text-[#26332B] mt-0.5">
                  Aggregate Inference Activity
                </h3>
              </div>
              <Link
                to="/history"
                className="text-xs font-medium text-[#4F7D45] hover:underline flex items-center gap-1"
              >
                View full ledger <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#FAFAF5] border border-[#E7EAE4]">
                <p className="text-xs text-[#5A6A5E]">Total Analyzed</p>
                <p className="text-2xl font-bold text-[#26332B] mt-1">{stats.total_predictions}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#E6F4E5] border border-[#C2E2BE]">
                <p className="text-xs text-[#205423]">Likely Fresh</p>
                <p className="text-2xl font-bold text-[#205423] mt-1">{stats.fresh_count}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#FCE8E6] border border-[#F5BEBA]">
                <p className="text-xs text-[#8E2522]">Rotten Samples</p>
                <p className="text-2xl font-bold text-[#8E2522] mt-1">{stats.rotten_count}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF5] border border-[#E7EAE4]">
                <p className="text-xs text-[#5A6A5E]">Avg Model Confidence</p>
                <p className="text-2xl font-bold text-[#26332B] mt-1">
                  {(stats.avg_confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4F7D45]">
            Practical Applications
          </span>
          <h2 className="text-3xl font-bold text-[#26332B] mt-1">
            Why Vision-Based Fruit Inspection?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-[#E7EAE4]">
            <CheckCircle2 className="w-5 h-5 text-[#4F7D45] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-[#26332B]">Reduces Subjective Inspection</h4>
              <p className="text-xs text-[#5A6A5E] mt-1 leading-relaxed">
                Replaces inconsistent manual visual estimation with reproducible mathematical feature extraction.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-[#E7EAE4]">
            <CheckCircle2 className="w-5 h-5 text-[#4F7D45] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-[#26332B]">Rapid Preliminary Screening</h4>
              <p className="text-xs text-[#5A6A5E] mt-1 leading-relaxed">
                Processes images within milliseconds, offering fast triage for sorting setups or educational labs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-[#E7EAE4]">
            <CheckCircle2 className="w-5 h-5 text-[#4F7D45] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-[#26332B]">Standardized Preprocessing Pipeline</h4>
              <p className="text-xs text-[#5A6A5E] mt-1 leading-relaxed">
                Identical RGB resizing and normalization applied during both training and production inference.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-[#E7EAE4]">
            <CheckCircle2 className="w-5 h-5 text-[#4F7D45] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-[#26332B]">Educational & Prototype Ready</h4>
              <p className="text-xs text-[#5A6A5E] mt-1 leading-relaxed">
                Demonstrates academic computer vision fundamentals: convolutions, pooling, activation, and metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#4F7D45] p-8 sm:p-12 text-white text-center space-y-6 shadow-md relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to Check Your Fruit?
            </h2>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              Upload a photograph or use your webcam to test the deep learning freshness classifier on actual fruit samples.
            </p>
            <div className="pt-2">
              <Link
                to="/detect"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[#4F7D45] hover:bg-[#FAFAF5] font-semibold text-sm shadow-md transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                Start Freshness Detection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
