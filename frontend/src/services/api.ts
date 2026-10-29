import type { HealthStatus, ModelInfo, PredictionResult, HistoryItem, StatsSummary } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = {
  async getHealth(): Promise<HealthStatus> {
    const res = await fetch(`${BASE_URL}/health`)
    if (!res.ok) {
      throw new Error(`Health check failed with status ${res.status}`)
    }
    return res.json()
  },

  async getModelInfo(): Promise<ModelInfo> {
    const res = await fetch(`${BASE_URL}/model-info`)
    if (!res.ok) {
      throw new Error(`Failed to load model info with status ${res.status}`)
    }
    return res.json()
  },

  async predictFruit(file: File | Blob, fruitType?: string): Promise<PredictionResult> {
    const formData = new FormData()
    formData.append('file', file)
    if (fruitType) {
      formData.append('fruit_type', fruitType)
    }

    const res = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      let errMessage = 'Analysis failed'
      try {
        const errorData = await res.json()
        errMessage = errorData.detail || errorData.message || errMessage
      } catch {
        errMessage = `Server error (${res.status})`
      }
      throw new Error(errMessage)
    }

    return res.json()
  },

  async getHistory(params?: {
    search?: string
    filter?: string
    sort?: 'asc' | 'desc'
    page?: number
    limit?: number
  }): Promise<{ items: HistoryItem[]; total: number; page: number; pages: number }> {
    const query = new URLSearchParams()
    if (params?.search) query.append('search', params.search)
    if (params?.filter && params.filter !== 'all') query.append('filter', params.filter)
    if (params?.sort) query.append('sort', params.sort)
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())

    const res = await fetch(`${BASE_URL}/history?${query.toString()}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch history with status ${res.status}`)
    }
    return res.json()
  },

  async getHistoryItem(id: string): Promise<HistoryItem> {
    const res = await fetch(`${BASE_URL}/history/${id}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch history record ${id}`)
    }
    return res.json()
  },

  async clearHistory(): Promise<{ success: boolean; deleted_count: number }> {
    const res = await fetch(`${BASE_URL}/history`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      throw new Error(`Failed to clear history with status ${res.status}`)
    }
    return res.json()
  },

  async getStats(): Promise<StatsSummary> {
    const res = await fetch(`${BASE_URL}/stats`)
    if (!res.ok) {
      throw new Error(`Failed to fetch stats with status ${res.status}`)
    }
    return res.json()
  },
}
