import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, ShieldAlert, Cpu, GitBranch } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-[#FAFAF5] border-t border-[#E7EAE4] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#C2E2BE] flex items-center justify-center text-[#4F7D45]">
                <Leaf className="w-4 h-4 fill-[#4F7D45]/20" />
              </div>
              <span className="font-semibold text-lg text-[#26332B]">FreshSight AI</span>
            </div>
            <p className="text-sm text-[#5A6A5E] max-w-md leading-relaxed">
              Deep learning-based fruit freshness classification utilizing computer vision algorithms and convolutional neural network feature extraction. Designed as an academic engineering demonstration.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#849688]">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Full-Stack Computer Vision Pipeline • PyTorch / NumPy CNN</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#26332B] mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-[#5A6A5E]">
              <li><Link to="/" className="hover:text-[#4F7D45] transition-colors">Home</Link></li>
              <li><Link to="/detect" className="hover:text-[#4F7D45] transition-colors">Detect Freshness</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#4F7D45] transition-colors">How It Works</Link></li>
              <li><Link to="/history" className="hover:text-[#4F7D45] transition-colors">Prediction History</Link></li>
              <li><Link to="/about" className="hover:text-[#4F7D45] transition-colors">About Project</Link></li>
            </ul>
          </div>

          {/* Technical Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#26332B] mb-3">Architecture</h4>
            <ul className="space-y-2 text-sm text-[#5A6A5E]">
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-[#4F7D45]" /> MobileNetV2 / CNN Core</li>
              <li>RGB Preprocessing (224×224)</li>
              <li>FastAPI Async REST API</li>
              <li>SQLite Prediction Ledger</li>
              <li>React 19 + TypeScript + Vite</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="pt-6 border-t border-[#E7EAE4] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#5A6A5E]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Academic Disclaimer:</strong> This system provides an AI visual estimate based on surface features and is not a substitute for official microbiological or food safety inspection.
            </p>
          </div>
          <p className="text-[#849688]">
            &copy; {new Date().getFullYear()} FreshSight AI Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
