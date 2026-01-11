import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

const createForm = () => ({
  title: '',
  description: '',
})

function Notice() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState(createForm())
  const [submitting, setSubmitting] = useState(false)

  const fetchNotices = async () => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      setLoading(false)
      return
    }
    try {
      setError('')
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/notices?status=Approved`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to load notices.')
      }
      const data = await response.json()
      setNotices(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load notices.')
      toast.error(err?.message || 'Failed to load notices.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()
  }, [])

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('access-token')
    if (!token) {
      toast.error('Unauthorized access.')
      return
    }
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required.')
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`${apiBaseUrl}/notices`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to submit notice.')
      }
      toast.success('Notice submitted for review.')
      setFormData(createForm())
      setModalOpen(false)
    } catch (err) {
      toast.error(err?.message || 'Failed to submit notice.')
    } finally {
      setSubmitting(false)
    }
  }

  const initials = useMemo(() => {
    return (name) =>
      String(name || '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
  }, [])

  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 pb-20 sm:px-8">
      <section className="flex flex-wrap items-center justify-between gap-4 pt-6 animate-fade-up" style={{ animationDelay: '0.12s' }}>
        <div>
          <h2 className="text-2xl font-semibold text-[#1E3A8A] sm:text-3xl">Notice and Feedback</h2>
          <p className="mt-2 text-sm text-[#475569]">
            Latest updates and feedback from students.
          </p>
        </div>
        <button
          type="button"
          className="rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95"
          onClick={() => setModalOpen(true)}
        >
          Add Notice
        </button>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
        <div className="divide-y divide-[#E5E7EB]">
          {loading ? (
            <div className="px-4 py-6 text-sm text-[#64748B]">Loading notices...</div>
          ) : error ? (
            <div className="px-4 py-6 text-sm font-semibold text-[#DC2626]">{error}</div>
          ) : notices.length === 0 ? (
            <div className="px-4 py-6 text-sm text-[#64748B]">No notices yet.</div>
          ) : (
            notices.map((notice) => (
              <Link
                key={notice._id}
                to={`/notice/${notice._id}`}
                className="flex items-start gap-4 px-4 py-4 transition hover:bg-[#F8FAFC]"
              >
                <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-[#E5E7EB] bg-white text-[#1E3A8A]">
                  {notice.authorImage ? (
                    <img
                      src={notice.authorImage}
                      alt={notice.authorName || 'Uploader'}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-semibold">{initials(notice.authorName)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#0F172A] sm:text-base">{notice.title}</div>
                  <p className="mt-2 text-sm text-[#475569]">{notice.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                    <span>{notice.authorName || 'Student'}</span>
                    <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#1E3A8A]">
                      {notice.authorRole || 'Student'}
                    </span>
                    <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold text-[#475569]">
                      {notice.authorBatch ? `CSE ${notice.authorBatch}` : 'CSE --'}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#0F172A]/40 px-3">
          <div className="w-full max-w-[520px] rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.25)] sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#0F172A] sm:text-base">Add notice</h2>
              <button
                type="button"
                className="text-xs font-semibold text-[#64748B] sm:text-sm"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
            <form className="mt-4 space-y-3 text-sm text-[#475569]" onSubmit={handleSubmit}>
              <label className="space-y-2 text-xs font-semibold text-[#475569] sm:text-sm">
                Title
                <input
                  type="text"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-normal text-[#475569]"
                  value={formData.title}
                  onChange={handleChange('title')}
                />
              </label>
              <label className="space-y-2 text-xs font-semibold text-[#475569] sm:text-sm">
                Description
                <textarea
                  rows="4"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-normal text-[#475569]"
                  value={formData.description}
                  onChange={handleChange('description')}
                />
              </label>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#475569] sm:px-4 sm:text-sm"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1E3A8A] px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95 sm:px-4 sm:text-sm"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default Notice
