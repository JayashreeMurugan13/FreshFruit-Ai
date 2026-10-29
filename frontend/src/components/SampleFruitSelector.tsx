import React from 'react'
import { Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react'

interface SampleOption {
  id: string
  name: string
  category: 'Fresh' | 'Rotten'
  fruitType: string
  imagePath: string
  description: string
}

const SAMPLE_FRUITS: SampleOption[] = [
  {
    id: 'sample-apple-fresh',
    name: 'Fresh Gala Apple',
    category: 'Fresh',
    fruitType: 'Apple',
    imagePath: '/assets/fresh_apple.jpg',
    description: 'Crisp red skin, intact stem, natural sheen',
  },
  {
    id: 'sample-apple-rotten',
    name: 'Decaying Apple',
    category: 'Rotten',
    fruitType: 'Apple',
    imagePath: '/assets/rotten_apple.jpg',
    description: 'Extensive browning, sunken surface, fungal growth',
  },
  {
    id: 'sample-banana-fresh',
    name: 'Ripe Fresh Banana',
    category: 'Fresh',
    fruitType: 'Banana',
    imagePath: '/assets/fresh_banana.jpg',
    description: 'Bright uniform yellow peel, firm green stem',
  },
  {
    id: 'sample-banana-rotten',
    name: 'Overripe Rotten Banana',
    category: 'Rotten',
    fruitType: 'Banana',
    imagePath: '/assets/rotten_banana.jpg',
    description: 'Blackened peel, structural softening, decay',
  },
  {
    id: 'sample-orange-fresh',
    name: 'Fresh Citrus Orange',
    category: 'Fresh',
    fruitType: 'Orange',
    imagePath: '/assets/fresh_orange.jpg',
    description: 'Pebbled vibrant orange skin, fresh leaf',
  },
]

interface SampleFruitSelectorProps {
  onSelectSample: (file: File, sampleMeta: SampleOption) => void
  disabled?: boolean
}

export const SampleFruitSelector: React.FC<SampleFruitSelectorProps> = ({ onSelectSample, disabled }) => {
  const handleSelect = async (sample: SampleOption) => {
    try {
      const response = await fetch(sample.imagePath)
      const blob = await response.blob()
      const file = new File([blob], `${sample.id}.jpg`, { type: 'image/jpeg' })
      onSelectSample(file, sample)
    } catch (err) {
      console.error('Failed to load sample image', err)
    }
  }

  return (
    <div className="mt-6 pt-6 border-t border-[#E7EAE4]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#4F7D45]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#26332B]">
            Or Try Curated Test Samples
          </span>
        </div>
        <span className="text-xs text-[#5A6A5E]">Real high-resolution dataset photos</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {SAMPLE_FRUITS.map((sample) => (
          <button
            key={sample.id}
            type="button"
            disabled={disabled}
            onClick={() => handleSelect(sample)}
            className="group relative flex flex-col items-center p-2 rounded-xl border border-[#E7EAE4] bg-white hover:border-[#8FAF76] hover:shadow-md transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#FAFAF5] mb-2">
              <img
                src={sample.imagePath}
                alt={sample.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <span
                className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-0.5 ${
                  sample.category === 'Fresh'
                    ? 'bg-[#E6F4E5] text-[#205423]'
                    : 'bg-[#FCE8E6] text-[#8E2522]'
                }`}
              >
                {sample.category === 'Fresh' ? (
                  <CheckCircle2 className="w-2.5 h-2.5" />
                ) : (
                  <AlertTriangle className="w-2.5 h-2.5" />
                )}
                {sample.category}
              </span>
            </div>
            <span className="text-xs font-medium text-[#26332B] truncate w-full text-center">
              {sample.name}
            </span>
            <span className="text-[10px] text-[#5A6A5E] truncate w-full text-center">
              {sample.fruitType}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
