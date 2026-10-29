export type FreshnessClass = 'Fresh' | 'Rotten'

export interface PredictionResult {
  id: string
  prediction: FreshnessClass
  confidence: number
  model_name: string
  timestamp: string
  disclaimer: string
  explanation: string
  is_uncertain?: boolean
  warning?: string | null
  image_url?: string
  fruit_type?: string
}

export interface ModelInfo {
  model_name: string
  model_type: string
  input_size: [number, number]
  classes: string[]
  is_trained: boolean
  trained_at?: string
  total_parameters?: number
  metrics?: {
    accuracy: number
    precision: number
    recall: number
    f1_score: number
    test_samples_count: number
    confusion_matrix: number[][]
  }
}

export interface HealthStatus {
  status: 'healthy' | 'degraded'
  model_available: boolean
  model_name: string
  version: string
  database_connected: boolean
}

export interface HistoryItem {
  id: string
  prediction: FreshnessClass
  confidence: number
  model_name: string
  timestamp: string
  image_url?: string
  fruit_type?: string
  explanation?: string
}

export interface StatsSummary {
  total_predictions: number
  fresh_count: number
  rotten_count: number
  avg_confidence: number
  fresh_percentage: number
}

export interface SupportedFruit {
  id: string
  name: string
  image: string
  status: 'trained' | 'evaluating' | 'planned'
  description: string
  freshIndicators: string[]
  rottenIndicators: string[]
}
