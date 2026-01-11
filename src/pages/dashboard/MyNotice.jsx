import { useEffect, useState } from 'react'
import DashboardSection from './DashboardSection.jsx'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/ConfirmModal.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function MyNotice() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState('')

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
      const response = await fetch(`${apiBaseUrl}/notices/user`, {
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

  const handleDelete = async (noticeId) => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      toast.error('Unauthorized access.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/notices/${noticeId}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to delete notice.')
      }
      toast.success('Notice deleted.')
      setNotices((prev) => prev.filter((item) => item._id !== noticeId))
      if (selectedNotice?._id === noticeId) {
        setSelectedNotice(null)
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to delete notice.')
    }
  }

  return (
    <div className="space-y-6">
      <DashboardSection
        title="My Notice"
        description="Create and manage notices you have shared with students."
      />

      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
        {loading ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">Loading notices...</div>
        ) : error ? (
          <div className="px-4 py-6 text-sm font-semibold text-[#DC2626]">{error}</div>
        ) : notices.length === 0 ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">No notices yet.</div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {notices.map((notice) => (
              <div key={notice._id} className="flex flex-wrap items-center gap-4 px-4 py-4">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#0F172A] sm:text-base">{notice.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                    <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#1E3A8A]">
                      {notice.status || 'Pending'}
                    </span>
                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                  onClick={() => setSelectedNotice(notice)}
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedNotice ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0F172A]/60 px-4 py-6">
          <div className="w-full max-w-[560px] rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-[#0F172A]">Notice details</h2>
              <button
                type="button"
                className="text-xs font-semibold text-[#64748B]"
                onClick={() => setSelectedNotice(null)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Title</p>
                <p className="mt-2 text-sm font-semibold text-[#0F172A]">{selectedNotice.title}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Description</p>
                <p className="mt-2 text-sm text-[#475569]">{selectedNotice.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#1E3A8A]">
                  {selectedNotice.status || 'Pending'}
                </span>
                <span>{new Date(selectedNotice.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-[#FCA5A5] px-4 py-2 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FEE2E2]"
                onClick={() => setPendingDeleteId(selectedNotice._id)}
              >
                Delete notice
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={Boolean(pendingDeleteId)}
        title="Delete notice?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setPendingDeleteId('')}
        onConfirm={() => {
          const id = pendingDeleteId
          setPendingDeleteId('')
          handleDelete(id)
        }}
      />
    </div>
  )
}

export default MyNotice
