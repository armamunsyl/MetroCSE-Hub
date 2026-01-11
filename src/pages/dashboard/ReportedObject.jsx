import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import DashboardSection from './DashboardSection.jsx'
import ConfirmModal from '../../components/ConfirmModal.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function ReportedObject() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [selectedTarget, setSelectedTarget] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [pendingAction, setPendingAction] = useState('')

  const fetchReports = async () => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      setLoading(false)
      return
    }
    try {
      setError('')
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/admin/reports?status=Pending`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to load reports.')
      }
      const data = await response.json()
      setReports(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load reports.')
      toast.error(err?.message || 'Failed to load reports.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
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

  const handleViewDetails = async (reportId) => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      toast.error('Unauthorized access.')
      return
    }
    try {
      const response = await fetch(`${apiBaseUrl}/admin/reports/${reportId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to load report.')
      }
      const data = await response.json()
      setSelectedReport(data.report || null)
      setSelectedTarget(data.target || null)
    } catch (err) {
      toast.error(err?.message || 'Failed to load report.')
    }
  }

  const handleAction = async (action) => {
    if (!selectedReport?._id) return
    const token = localStorage.getItem('access-token')
    if (!token) {
      toast.error('Unauthorized access.')
      return
    }
    try {
      setActionLoading(true)
      const response = await fetch(`${apiBaseUrl}/admin/reports/${selectedReport._id}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })
      if (!response.ok) {
        throw new Error('Failed to update report.')
      }
      toast.success(action === 'delete' ? 'Reported item deleted.' : 'Report ignored.')
      setReports((prev) => prev.filter((item) => item._id !== selectedReport._id))
      setSelectedReport(null)
      setSelectedTarget(null)
    } catch (err) {
      toast.error(err?.message || 'Failed to update report.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Reported Object"
        description="Review reported questions and comments."
      />

      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
        {loading ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">Loading reports...</div>
        ) : error ? (
          <div className="px-4 py-6 text-sm font-semibold text-[#DC2626]">{error}</div>
        ) : reports.length === 0 ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">No reports yet.</div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {reports.map((report) => (
              <div key={report._id} className="flex flex-wrap items-center gap-4 px-4 py-4">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#0F172A]">
                    {report.targetType === 'question' ? 'Question report' : 'Comment report'}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                    <span>{report.reporterName || report.reporterEmail}</span>
                    <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#1E3A8A]">
                      {report.reporterRole || 'Student'}
                    </span>
                    <span>{new Date(report.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                  onClick={() => handleViewDetails(report._id)}
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedReport ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0F172A]/60 px-4 py-6">
          <div className="w-full max-w-[640px] rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#0F172A]">Report details</h2>
                <p className="mt-1 text-xs text-[#64748B]">
                  {selectedReport.targetType === 'question' ? 'Question report' : 'Comment report'}
                </p>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-[#64748B]"
                onClick={() => {
                  setSelectedReport(null)
                  setSelectedTarget(null)
                }}
              >
                Close
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-[#E5E7EB] bg-white text-[#1E3A8A]">
                {selectedReport.reporterImage ? (
                  <img
                    src={selectedReport.reporterImage}
                    alt={selectedReport.reporterName || 'Reporter'}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-sm font-semibold">{initials(selectedReport.reporterName)}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {selectedReport.reporterName || selectedReport.reporterEmail}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#475569]">
                  <span className="rounded-full bg-[#E2E8F0] px-2 py-0.5 font-semibold text-[#475569]">
                    {selectedReport.reporterBatch ? `CSE ${selectedReport.reporterBatch}` : 'CSE --'}
                  </span>
                  <span className="rounded-full bg-[#EDE9FE] px-2 py-0.5 font-semibold text-[#4C1D95]">
                    {selectedReport.reporterSection || '--'}
                  </span>
                  <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 font-semibold text-[#1E3A8A]">
                    {selectedReport.reporterRole || 'Student'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              {selectedReport.targetType === 'question' ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Question</p>
                  <p className="mt-2 text-sm font-semibold text-[#0F172A]">
                    {selectedTarget?.subjectName || 'Unknown subject'}
                  </p>
                  <p className="mt-1 text-sm text-[#475569]">
                    {selectedTarget?.batch ? `CSE ${selectedTarget.batch}` : 'CSE --'} ·{' '}
                    {selectedTarget?.semester || '--'} · {selectedTarget?.type || '--'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Comment</p>
                  <p className="mt-2 text-sm font-semibold text-[#0F172A]">
                    {selectedTarget?.message || 'No content found.'}
                  </p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    {selectedTarget?.authorName || selectedTarget?.authorEmail || 'Unknown'}
                  </p>
                </>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#475569]"
                onClick={() => setPendingAction('ignore')}
                disabled={actionLoading}
              >
                Ignore
              </button>
              <button
                type="button"
                className="rounded-xl bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(220,38,38,0.28)] transition hover:brightness-95 disabled:opacity-60"
                onClick={() => setPendingAction('delete')}
                disabled={actionLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={Boolean(pendingAction)}
        title={pendingAction === 'delete' ? 'Delete reported item?' : 'Ignore report?'}
        description={
          pendingAction === 'delete'
            ? 'This will remove the reported content.'
            : 'The reported content will remain.'
        }
        confirmLabel={pendingAction === 'delete' ? 'Delete' : 'Ignore'}
        onCancel={() => setPendingAction('')}
        onConfirm={() => {
          const action = pendingAction
          setPendingAction('')
          handleAction(action)
        }}
        isProcessing={actionLoading}
      />
    </div>
  )
}

export default ReportedObject
