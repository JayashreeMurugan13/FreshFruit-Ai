import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Leaf, Cpu, Menu, X, Sparkles } from 'lucide-react'
import { api } from '../services/api'
import type { HealthStatus } from '../types'

export const Navbar: React.FC = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [health, setHealth] = useState<HealthStatus | null>(null)

  useEffect(() => {
    api.getHealth()
      .then(setHealth)
      .catch(() => setHealth({ status: 'degraded', model_available: false, model_name: 'None', version: '1.0', database_connected: false }))
  }, [location.pathname])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/detect', label: 'Detect Freshness' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/history', label: 'History' },
    { to: '/about', label: 'About' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E7EAE4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#F0F6EE] border border-[#C2E2BE] flex items-center justify-center text-[#4F7D45] group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 fill-[#4F7D45]/15" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xl tracking-tight text-[#26332B]">FreshSight</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-medium bg-[#4F7D45] text-white">AI</span>
              </div>
              <p className="text-[11px] text-[#5A6A5E] hidden sm:block tracking-wide">Fruit Freshness Vision System</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'text-[#4F7D45] bg-[#F0F6EE]'
                      : 'text-[#26332B] hover:text-[#4F7D45] hover:bg-[#FAFAF5]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Model Status & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAFAF5] border border-[#E7EAE4] text-xs font-medium text-[#5A6A5E]">
              <span className={`w-2 h-2 rounded-full ${health?.model_available ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <Cpu className="w-3.5 h-3.5 text-[#4F7D45]" />
              <span>{health?.model_available ? 'CNN Active' : 'Model Pending'}</span>
            </div>

            <Link
              to="/detect"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4F7D45] hover:bg-[#3E6336] text-white text-sm font-medium shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Fruit
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/detect"
              className="px-3 py-1.5 rounded-lg bg-[#4F7D45] text-white text-xs font-medium"
            >
              Analyze
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#26332B] hover:bg-[#FAFAF5]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7EAE4] bg-white px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                isActive(link.to) ? 'bg-[#F0F6EE] text-[#4F7D45]' : 'text-[#26332B] hover:bg-[#FAFAF5]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E7EAE4] flex items-center justify-between text-xs text-[#5A6A5E]">
            <span>Model: {health?.model_name || 'Convolutional Network'}</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${health?.model_available ? 'bg-[#E6F4E5] text-[#205423]' : 'bg-amber-100 text-amber-800'}`}>
              {health?.model_available ? 'Ready' : 'Setup Required'}
            </span>
          </div>
        </div>
      )}
    </header>
  )
}
