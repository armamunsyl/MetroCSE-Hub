import { useEffect, useState } from 'react'
import DashboardSection from './DashboardSection.jsx'
import toast from 'react-hot-toast'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFeedbacks = async () => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      setLoading(false)
      return
    }
    try {
      setError('')
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/feedback`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to load feedback.')
      }
      const data = await response.json()
      setFeedbacks(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load feedback.')
      toast.error(err?.message || 'Failed to load feedback.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Admin Feedback"
        description="Review feedback and guidance from the admin team."
      />

      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
        {loading ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">Loading feedback...</div>
        ) : error ? (
          <div className="px-4 py-6 text-sm font-semibold text-[#DC2626]">{error}</div>
        ) : feedbacks.length === 0 ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">No feedback yet.</div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {feedbacks.map((item) => (
              <div key={item._id} className="px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{item.title}</p>
                    <p className="mt-1 text-xs text-[#64748B]">
                      From {item.createdByName || 'Admin'} • {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#1E3A8A]">
                    {item.targetType === 'email'
                      ? 'Direct'
                      : item.targetType === 'batch-section'
                        ? 'Batch + Section'
                        : 'Batch'}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[#475569]">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminFeedback
