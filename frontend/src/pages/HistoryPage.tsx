import React, { useState, useEffect, useCallback } from 'react'
import {
  History as HistoryIcon,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { api } from '../services/api'
import type { HistoryItem, StatsSummary } from '../types'
import { Link } from 'react-router-dom'

export const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [stats, setStats] = useState<StatsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [filterClass, setFilterClass] = useState<'all' | 'Fresh' | 'Rotten'>('all')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Clear modal state
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.getHistory({
        search: searchQuery,
        filter: filterClass,
        sort: sortOrder,
        page,
        limit: 10,
      })
      setItems(data.items)
      setTotalPages(data.pages || 1)
      setTotalCount(data.total || 0)

      // Fetch stats
      const statsData = await api.getStats()
      setStats(statsData)
    } catch (err: any) {
      setError(err.message || 'Failed to load history ledger.')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, filterClass, sortOrder, page])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleClearHistory = async () => {
    setIsClearing(true)
    try {
      await api.clearHistory()
      setIsClearModalOpen(false)
      fetchHistory()
    } catch (err: any) {
      setError(err.message || 'Failed to clear history.')
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F6EE] border border-[#C2E2BE] text-xs font-semibold text-[#4F7D45] mb-2">
            <HistoryIcon className="w-3.5 h-3.5" />
            SQLite Persistent Storage
          </div>
          <h1 className="text-3xl font-bold text-[#26332B] tracking-tight">
            Prediction History Ledger
          </h1>
          <p className="text-sm text-[#5A6A5E] mt-1">
            Audit log of verified model classifications, confidence scores, and timestamps.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            Clear Ledger
          </button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#FCE8E6] border border-[#F5BEBA] text-[#8E2522] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Aggregate Statistics Overview */}
      {stats && stats.total_predictions > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E7EAE4] shadow-xs">
            <p className="text-xs text-[#5A6A5E]">Total Inferences</p>
            <p className="text-2xl font-bold text-[#26332B] mt-1">{stats.total_predictions}</p>
          </div>
          <div className="bg-[#E6F4E5] p-5 rounded-2xl border border-[#C2E2BE] shadow-xs">
            <p className="text-xs text-[#205423]">Likely Fresh</p>
            <p className="text-2xl font-bold text-[#205423] mt-1">
              {stats.fresh_count}
              <span className="text-xs font-normal ml-1">
                ({Math.round((stats.fresh_count / stats.total_predictions) * 100)}%)
              </span>
            </p>
          </div>
          <div className="bg-[#FCE8E6] p-5 rounded-2xl border border-[#F5BEBA] shadow-xs">
            <p className="text-xs text-[#8E2522]">Potential Spoilage</p>
            <p className="text-2xl font-bold text-[#8E2522] mt-1">
              {stats.rotten_count}
              <span className="text-xs font-normal ml-1">
                ({Math.round((stats.rotten_count / stats.total_predictions) * 100)}%)
              </span>
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E7EAE4] shadow-xs">
            <p className="text-xs text-[#5A6A5E]">Avg Model Confidence</p>
            <p className="text-2xl font-bold text-[#26332B] mt-1">
              {Math.round(stats.avg_confidence * 100)}%
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E7EAE4] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#849688] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID or description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAFAF5] border border-[#E7EAE4] text-xs focus:outline-none focus:border-[#4F7D45] text-[#26332B]"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center rounded-xl bg-[#FAFAF5] p-1 border border-[#E7EAE4]">
            <button
              onClick={() => {
                setFilterClass('all')
                setPage(1)
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterClass === 'all'
                  ? 'bg-white text-[#26332B] shadow-xs font-semibold'
                  : 'text-[#5A6A5E] hover:text-[#26332B]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilterClass('Fresh')
                setPage(1)
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterClass === 'Fresh'
                  ? 'bg-[#E6F4E5] text-[#205423] font-semibold'
                  : 'text-[#5A6A5E] hover:text-[#205423]'
              }`}
            >
              Fresh
            </button>
            <button
              onClick={() => {
                setFilterClass('Rotten')
                setPage(1)
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterClass === 'Rotten'
                  ? 'bg-[#FCE8E6] text-[#8E2522] font-semibold'
                  : 'text-[#5A6A5E] hover:text-[#8E2522]'
              }`}
            >
              Rotten
            </button>
          </div>

          {/* Sort toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAFAF5] border border-[#E7EAE4] text-xs font-medium text-[#26332B] hover:bg-neutral-100 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#5A6A5E]" />
            <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Table / List View */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-[#E7EAE4] p-16 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#4F7D45] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#26332B]">Reading SQLite database records…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E7EAE4] p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FAFAF5] border border-[#E7EAE4] flex items-center justify-center text-[#849688] mx-auto">
            <HistoryIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#26332B]">No Prediction Records Found</h3>
            <p className="text-xs text-[#5A6A5E] mt-1 max-w-sm mx-auto">
              {searchQuery || filterClass !== 'all'
                ? 'No predictions match the active search or filter criteria.'
                : 'Run your first fruit freshness analysis on the detection page to start populating the ledger.'}
            </p>
          </div>
          <Link
            to="/detect"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4F7D45] hover:bg-[#3E6336] text-white text-xs font-medium shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Analyze a Fruit Image
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E7EAE4] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF5] border-b border-[#E7EAE4] text-[#5A6A5E] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Sample</th>
                  <th className="py-3.5 px-4">Prediction</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Model Core</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Record ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7EAE4]">
                {items.map((item) => {
                  const isFresh = item.prediction === 'Fresh'
                  const dateStr = new Date(item.timestamp).toLocaleString(undefined, {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })
                  return (
                    <tr key={item.id} className="hover:bg-[#FAFAF5]/60 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#FAFAF5] border border-[#E7EAE4] flex items-center justify-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-[#849688]">No img</span>
                          )}
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold ${
                            isFresh
                              ? 'bg-[#E6F4E5] text-[#205423]'
                              : 'bg-[#FCE8E6] text-[#8E2522]'
                          }`}
                        >
                          {isFresh ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                          {isFresh ? 'Likely Fresh' : 'Spoilage Signs'}
                        </span>
                      </td>

                      {/* Confidence */}
                      <td className="py-3 px-4 font-semibold text-[#26332B]">
                        {(item.confidence * 100).toFixed(1)}%
                      </td>

                      {/* Model */}
                      <td className="py-3 px-4 text-[#5A6A5E] font-mono">
                        {item.model_name}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-[#5A6A5E]">
                        {dateStr}
                      </td>

                      {/* ID */}
                      <td className="py-3 px-4 font-mono text-[11px] text-[#849688] truncate max-w-[120px]">
                        {item.id}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="py-4 px-6 border-t border-[#E7EAE4] bg-[#FAFAF5] flex items-center justify-between text-xs text-[#5A6A5E]">
              <span>
                Showing page {page} of {totalPages} ({totalCount} total records)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#E7EAE4] bg-white disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#E7EAE4] bg-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Clearing History */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#E7EAE4] shadow-xl animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#26332B]">Clear Prediction Ledger?</h3>
              <p className="text-xs text-[#5A6A5E] mt-1 leading-relaxed">
                This will permanently remove all saved inference history and thumbnail references from the local SQLite database. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                disabled={isClearing}
                className="px-4 py-2 rounded-xl border border-[#E7EAE4] text-xs font-semibold text-[#26332B] hover:bg-[#FAFAF5]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClearHistory}
                disabled={isClearing}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
              >
                {isClearing ? 'Deleting Records…' : 'Yes, Clear Ledger'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
