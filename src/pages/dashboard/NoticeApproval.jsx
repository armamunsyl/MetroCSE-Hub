import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import DashboardSection from './DashboardSection.jsx'
import ConfirmModal from '../../components/ConfirmModal.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function NoticeApproval() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [pendingAction, setPendingAction] = useState('')

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
      const response = await fetch(`${apiBaseUrl}/admin/notices?status=Pending`, {
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

  const handleDecision = async (action) => {
    if (!selectedNotice?._id) return
    const token = localStorage.getItem('access-token')
    if (!token) {
      toast.error('Unauthorized access.')
      return
    }
    try {
      setActionLoading(true)
      const response = await fetch(`${apiBaseUrl}/admin/notices/${selectedNotice._id}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })
      if (!response.ok) {
        throw new Error('Failed to update notice.')
      }
      toast.success(action === 'approve' ? 'Notice approved.' : 'Notice rejected.')
      setNotices((prev) => prev.filter((item) => item._id !== selectedNotice._id))
      setSelectedNotice(null)
    } catch (err) {
      toast.error(err?.message || 'Failed to update notice.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Notice Approval"
        description="Review and approve notices submitted by students."
      />

      <section className="overflow-hidden border-0 bg-transparent shadow-none sm:rounded-2xl sm:border sm:border-[#E5E7EB] sm:bg-white sm:shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
        {loading ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">Loading notices...</div>
        ) : error ? (
          <div className="px-4 py-6 text-sm font-semibold text-[#DC2626]">{error}</div>
        ) : null}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[560px] text-left text-sm text-[#475569]">
            <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#475569]">
              <tr>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Title</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Uploader</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Details</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((item) => (
                <tr key={item._id} className="border-t border-[#E5E7EB]">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">{item.title}</td>
                  <td className="px-4 py-3">{item.authorName || 'Student'}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                      onClick={() => setSelectedNotice(item)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden">
          <div className="bg-[#F8FAFC] px-2 py-3 text-xs font-semibold text-[#475569]">Pending notices</div>
          <div className="overflow-x-hidden">
            <table className="w-full table-fixed text-left text-[11px] text-[#475569]">
              <thead className="bg-[#F8FAFC] uppercase tracking-wide text-[#475569]">
                <tr>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">Title</th>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">Uploader</th>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">View</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((item) => (
                  <tr key={item._id} className="border-t border-[#E5E7EB]">
                    <td className="px-2 py-2 font-semibold text-[#0F172A]">
                      <span className="block break-words">{item.title}</span>
                    </td>
                    <td className="px-2 py-2">{item.authorName || 'Student'}</td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        className="rounded-md border border-[#E5E7EB] px-2 py-1 text-[10px] font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                        onClick={() => setSelectedNotice(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selectedNotice ? (
        <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-[#E5E7EB] bg-[#EEF2FF] text-[#1E3A8A]">
                {selectedNotice.authorImage ? (
                  <img
                    src={selectedNotice.authorImage}
                    alt={selectedNotice.authorName || 'Uploader'}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-sm font-semibold">{initials(selectedNotice.authorName)}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {selectedNotice.authorName || 'Student'}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#475569]">
                  <span className="rounded-full bg-[#E2E8F0] px-2 py-0.5 font-semibold text-[#475569]">
                    {selectedNotice.authorBatch ? `CSE ${selectedNotice.authorBatch}` : 'CSE --'}
                  </span>
                  <span className="rounded-full bg-[#EDE9FE] px-2 py-0.5 font-semibold text-[#4C1D95]">
                    {selectedNotice.authorSection || '--'}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-[#64748B]"
              onClick={() => setSelectedNotice(null)}
            >
              Close
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Title</p>
            <p className="mt-2 text-sm font-semibold text-[#0F172A]">{selectedNotice.title}</p>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Description</p>
            <p className="mt-2 text-sm text-[#475569]">{selectedNotice.description}</p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#0F172A] transition hover:bg-[#1E3A8A] hover:text-white disabled:opacity-60"
              onClick={() => setPendingAction('reject')}
              disabled={actionLoading}
            >
              Reject
            </button>
            <button
              type="button"
              className="rounded-xl bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95 disabled:opacity-60"
              onClick={() => setPendingAction('approve')}
              disabled={actionLoading}
            >
              Approve
            </button>
          </div>
        </section>
      ) : null}

      <ConfirmModal
        isOpen={Boolean(pendingAction)}
        title={pendingAction === 'approve' ? 'Approve notice?' : 'Reject notice?'}
        description="This action will update the notice status."
        confirmLabel={pendingAction === 'approve' ? 'Approve' : 'Reject'}
        onCancel={() => setPendingAction('')}
        onConfirm={() => {
          const action = pendingAction
          setPendingAction('')
          handleDecision(action)
        }}
        isProcessing={actionLoading}
      />
    </div>
  )
}

export default NoticeApproval
