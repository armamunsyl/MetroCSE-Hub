import { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../../Provider/AuthProvider.jsx'
import DashboardSection from './DashboardSection.jsx'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/ConfirmModal.jsx'

function ContributeRequest() {
  const { user } = useContext(AuthContext)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [activePreviewIndex, setActivePreviewIndex] = useState(0)
  const [imageZoom, setImageZoom] = useState(1)
  const [feedbackNote, setFeedbackNote] = useState('')
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [pendingDecision, setPendingDecision] = useState('')

  const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

  useEffect(() => {
    const token = localStorage.getItem('access-token')
    if (!token || !user?.email) {
      setLoading(false)
      return
    }

    const fetchRequests = async () => {
      try {
        setError('')
        setLoading(true)
        const response = await fetch(`${apiBaseUrl}/contributions?status=Pending`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load contribution requests.')
        }

        const data = await response.json()
        setRequests(data)
    } catch (err) {
      setError(err?.message || 'Failed to load contribution requests.')
      toast.error(err?.message || 'Failed to load contribution requests.')
    } finally {
      setLoading(false)
    }
  }

    fetchRequests()
  }, [user?.email])

  useEffect(() => {
    if (imagePreviewUrl) {
      setImageZoom(1)
    }
  }, [imagePreviewUrl])

  const requestImages = useMemo(() => {
    const images = Array.isArray(selectedRequest?.questionImageUrls) ? selectedRequest.questionImageUrls : []
    const primary = selectedRequest?.questionImageUrl ? [selectedRequest.questionImageUrl] : []
    return [...images, ...primary].filter(Boolean)
  }, [selectedRequest?.questionImageUrls, selectedRequest?.questionImageUrl])

  useEffect(() => {
    setActivePreviewIndex(0)
    setImagePreviewUrl('')
  }, [selectedRequest?._id])

  const openPreviewAt = (index) => {
    const url = requestImages[index]
    if (!url) return
    setActivePreviewIndex(index)
    setImagePreviewUrl(url)
  }

  const handleViewDetails = async (requestId) => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setDetailError('Unauthorized access.')
      toast.error('Unauthorized access.')
      return
    }

    try {
      setDetailError('')
      setDetailLoading(true)
      const response = await fetch(`${apiBaseUrl}/contributions/${requestId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load contribution details.')
      }

      const data = await response.json()
      setSelectedRequest(data)
      setFeedbackNote('')
    } catch (err) {
      setDetailError(err?.message || 'Failed to load contribution details.')
      toast.error(err?.message || 'Failed to load contribution details.')
      setSelectedRequest(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDecision = async (action) => {
    if (!selectedRequest?._id) return
    const token = localStorage.getItem('access-token')
    if (!token) {
      setDetailError('Unauthorized access.')
      toast.error('Unauthorized access.')
      return
    }

    try {
      const normalizedAction = String(action || '').toLowerCase()
      setActionLoading(true)
      const response = await fetch(`${apiBaseUrl}/contributions/${selectedRequest._id}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ action, feedback: feedbackNote }),
      })

      if (!response.ok) {
        throw new Error('Failed to update request.')
      }

      toast.success(`Request ${normalizedAction === 'approve' ? 'approved' : 'rejected'}.`)
      setRequests((prev) => prev.filter((item) => item._id !== selectedRequest._id))
      setSelectedRequest(null)
      setFeedbackNote('')
    } catch (err) {
      setDetailError(err?.message || 'Failed to update request.')
      toast.error(err?.message || 'Failed to update request.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Contribute Request"
        description="Approve or reject contribution requests submitted by users."
      />

      <section className="overflow-hidden border-0 bg-transparent shadow-none sm:rounded-2xl sm:border sm:border-[#E5E7EB] sm:bg-white sm:shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
        {loading ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">Loading requests...</div>
        ) : error ? (
          <div className="px-4 py-6 text-sm text-[#DC2626]">{error}</div>
        ) : null}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[560px] text-left text-sm text-[#475569]">
            <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#475569]">
              <tr>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Subject</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Uploader</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Details</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((item) => (
                <tr key={item._id} className="border-t border-[#E5E7EB]">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">{item.subjectName}</td>
                  <td className="px-4 py-3">{item.uploaderName}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                      onClick={() => handleViewDetails(item._id)}
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
          <div className="bg-[#F8FAFC] px-2 py-3 text-xs font-semibold text-[#475569]">Contribution requests</div>
          <div className="overflow-x-hidden">
            <table className="w-full table-fixed text-left text-[11px] text-[#475569]">
              <thead className="bg-[#F8FAFC] uppercase tracking-wide text-[#475569]">
                <tr>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">Subject</th>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">Uploader</th>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">View</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item) => (
                  <tr key={item._id} className="border-t border-[#E5E7EB]">
                    <td className="px-2 py-2 font-semibold text-[#0F172A]">
                      <span className="block break-words">{item.subjectName}</span>
                    </td>
                    <td className="px-2 py-2">{item.uploaderName}</td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        className="rounded-md border border-[#E5E7EB] px-2 py-1 text-[10px] font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                        onClick={() => handleViewDetails(item._id)}
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

      {detailLoading || detailError || selectedRequest ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#0F172A]/40 px-3">
          <div className="w-full max-w-[360px] rounded-2xl bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.25)] sm:max-w-[420px] sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#0F172A] sm:text-base">Contribution details</h2>
              <button
                type="button"
                className="text-xs font-semibold text-[#64748B] sm:text-sm"
                onClick={() => {
                  setSelectedRequest(null)
                  setDetailError('')
                  setDetailLoading(false)
                  setImagePreviewUrl('')
                  setFeedbackNote('')
                }}
              >
                Close
              </button>
            </div>
            {detailLoading ? (
              <p className="mt-3 text-xs text-[#64748B] sm:text-sm">Loading details...</p>
            ) : detailError ? (
              <p className="mt-3 text-xs text-[#DC2626] sm:text-sm">{detailError}</p>
            ) : selectedRequest ? (
              <div className="mt-3 max-h-[70vh] space-y-2 overflow-y-auto text-xs text-[#475569] sm:max-h-none sm:text-sm">
                <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <div className="h-9 w-9 overflow-hidden rounded-full border border-[#E2E8F0] bg-[#F8FAFC]">
                    {selectedRequest.uploaderProfileImage ? (
                      <img
                        src={selectedRequest.uploaderProfileImage}
                        alt={selectedRequest.uploaderName}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
                      <span>Uploader</span>
                      <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-semibold text-[#0369A1]">
                        CSE {selectedRequest.uploaderBatch || '--'}
                      </span>
                      <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-semibold text-[#15803D]">
                        Sec {selectedRequest.uploaderSection || '--'}
                      </span>
                      <span className="rounded-full bg-[#FFEDD5] px-2 py-0.5 text-[10px] font-semibold text-[#C2410C]">
                        Score {selectedRequest.uploaderContributionScore ?? 0}
                      </span>
                    </div>
                    <p className="font-semibold text-[#0F172A]">{selectedRequest.uploaderName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <span className="text-[#64748B]">Subject</span>
                  <span className="font-semibold text-[#0F172A]">{selectedRequest.subjectName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                    <span className="text-[#64748B]">Course code</span>
                    <span className="font-semibold text-[#0F172A]">{selectedRequest.courseCode}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                    <span className="text-[#64748B]">Batch</span>
                    <span className="font-semibold text-[#0F172A]">{selectedRequest.batch}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                    <span className="text-[#64748B]">Semester</span>
                    <span className="font-semibold text-[#0F172A]">{selectedRequest.semester}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                    <span className="text-[#64748B]">Type</span>
                    <span className="font-semibold text-[#0F172A]">{selectedRequest.type}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2 ${
                      String(selectedRequest.type || '').toLowerCase() === 'ct' ? '' : 'col-span-2'
                    }`}
                  >
                    <span className="text-[#64748B]">Status</span>
                    <span className="font-semibold text-[#0F172A]">{selectedRequest.status}</span>
                  </div>
                  {String(selectedRequest.type || '').toLowerCase() === 'ct' ? (
                    <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                      <span className="text-[#64748B]">Section</span>
                      <span className="font-semibold text-[#0F172A]">{selectedRequest.section}</span>
                    </div>
                  ) : null}
                </div>
                {String(selectedRequest.type || '').toLowerCase() === 'ct' ? (
                  <>
                    <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                      <span className="text-[#64748B]">Faculty</span>
                      <span className="font-semibold text-[#0F172A]">{selectedRequest.facultyName}</span>
                    </div>
                  </>
                ) : null}
                {requestImages.length > 0 ? (
                  <div className="rounded-xl border border-[#E2E8F0] px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B]">Question images</span>
                      <button
                        type="button"
                        className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                        onClick={() => openPreviewAt(0)}
                      >
                        View
                      </button>
                    </div>
                    {requestImages.length > 1 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {requestImages.map((imageUrl, index) => (
                          <button
                            key={`${imageUrl}-${index}`}
                            type="button"
                            className={[
                              'h-12 w-12 overflow-hidden rounded-lg border transition',
                              index === activePreviewIndex ? 'border-[#1E3A8A]' : 'border-[#E2E8F0]',
                            ].join(' ')}
                            onClick={() => openPreviewAt(index)}
                          >
                            <img src={imageUrl} alt="Question thumbnail" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <span className="text-[#64748B]">Comment</span>
                  <span className="font-semibold text-[#0F172A]">{selectedRequest.uploaderComment || '--'}</span>
                </div>
                <div className="rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <label className="text-xs font-semibold text-[#64748B]" htmlFor="request-feedback">
                    Feedback (optional)
                  </label>
                  <textarea
                    id="request-feedback"
                    rows="2"
                    className="mt-2 w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#475569] outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
                    placeholder="Share feedback before approval..."
                    value={feedbackNote}
                    onChange={(event) => setFeedbackNote(event.target.value)}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#0F172A] transition hover:bg-[#1E3A8A] hover:text-white disabled:opacity-60"
                    onClick={() => setPendingDecision('reject')}
                    disabled={actionLoading}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-[#1E3A8A] px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95 disabled:opacity-60"
                    onClick={() => setPendingDecision('approve')}
                    disabled={actionLoading}
                  >
                    Approve
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {imagePreviewUrl ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0F172A]/60 px-4 py-6">
          <div className="w-full max-w-[860px] max-h-[80vh] overflow-hidden rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-[#0F172A]">Question image</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-2 py-1 text-xs text-[#475569]">
                  <button
                    type="button"
                    className="rounded-full px-2 py-1 font-semibold text-[#1E3A8A] hover:bg-[#EFF6FF]"
                    onClick={() => setImageZoom((zoom) => Math.max(1, Number((zoom - 0.2).toFixed(1))))}
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={imageZoom}
                    onChange={(event) => setImageZoom(Number(event.target.value))}
                    className="w-24"
                    aria-label="Zoom level"
                  />
                  <button
                    type="button"
                    className="rounded-full px-2 py-1 font-semibold text-[#1E3A8A] hover:bg-[#EFF6FF]"
                    onClick={() => setImageZoom((zoom) => Math.min(3, Number((zoom + 0.2).toFixed(1))))}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="rounded-full px-2 py-1 text-[11px] font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                    onClick={() => setImageZoom(1)}
                  >
                    Reset
                  </button>
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#64748B]"
                  onClick={() => setImagePreviewUrl('')}
                >
                  Close
                </button>
              </div>
            </div>
            {requestImages.length > 1 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {requestImages.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    type="button"
                    className={[
                      'h-12 w-12 overflow-hidden rounded-lg border transition',
                      index === activePreviewIndex ? 'border-[#1E3A8A]' : 'border-[#E2E8F0]',
                    ].join(' ')}
                    onClick={() => openPreviewAt(index)}
                  >
                    <img src={imageUrl} alt="Question thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
            <div className="mt-4 flex max-h-[60vh] items-center justify-center overflow-auto rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2">
              <img
                src={imagePreviewUrl}
                alt="Question"
                className="max-h-[60vh] w-auto max-w-full object-contain transition-transform"
                style={{ transform: `scale(${imageZoom})`, transformOrigin: 'center' }}
              />
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={Boolean(pendingDecision)}
        title={pendingDecision === 'approve' ? 'Approve request?' : 'Reject request?'}
        description="This action will update the request status."
        confirmLabel={pendingDecision === 'approve' ? 'Approve' : 'Reject'}
        onCancel={() => setPendingDecision('')}
        onConfirm={() => {
          const action = pendingDecision
          setPendingDecision('')
          handleDecision(action)
        }}
        isProcessing={actionLoading}
      />
    </div>
  )
}

export default ContributeRequest
