import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { DetectionPage } from './pages/DetectionPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { HistoryPage } from './pages/HistoryPage'
import { AboutPage } from './pages/AboutPage'

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white text-[#26332B] font-sans antialiased selection:bg-[#E6F4E5] selection:text-[#205423]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detect" element={<DetectionPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
