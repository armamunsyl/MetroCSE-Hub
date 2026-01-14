import { useEffect, useMemo, useState } from 'react'
import DashboardSection from './DashboardSection.jsx'
import { batchOptions, sectionOptions } from '../../constants/academicOptions.js'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

const statusOptions = ['All', 'Approved', 'Pending', 'Rejected']

function MyContribution() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [contributions, setContributions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [editData, setEditData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imageName, setImageName] = useState('')
  const [commentBadgeMap, setCommentBadgeMap] = useState({})

  const normalizeBatch = (value) => String(value || '').replace(/^cse\s*/i, '').trim()
  const normalizeSection = (value) => String(value || '').replace(/^sec\s*/i, '').trim()

  const statusValue = String(editData?.status || '').toLowerCase()
  const isPending = statusValue === 'pending'
  const canEdit = statusValue === 'pending' || statusValue === 'rejected'
  const isCt = String(editData?.type || '').toLowerCase() === 'ct'

  useEffect(() => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      setLoading(false)
      return
    }

    const fetchContributions = async () => {
      try {
        setError('')
        setLoading(true)
        const statusParam = statusFilter === 'All' ? '' : `?status=${statusFilter}`
        const response = await fetch(`${apiBaseUrl}/users/contributions${statusParam}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load contributions.')
        }

        const data = await response.json()
        setContributions(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err?.message || 'Failed to load contributions.')
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
  }, [statusFilter])

  useEffect(() => {
    let isMounted = true
    const fetchCommentNotifications = async () => {
      const token = localStorage.getItem('access-token')
      if (!token) return
      try {
        const response = await fetch(
          `${apiBaseUrl}/notifications?type=question_comment&unreadOnly=true&limit=100`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        )
        if (!response.ok) return
        const data = await response.json().catch(() => null)
        const items = Array.isArray(data?.items) ? data.items : []
        const nextMap = items.reduce((acc, item) => {
          const questionId = String(item?.metadata?.questionId || '')
          if (questionId) acc[questionId] = true
          return acc
        }, {})
        if (isMounted) setCommentBadgeMap(nextMap)
      } catch (error) {
        // Keep default state on error.
      }
    }
    fetchCommentNotifications()
    return () => {
      isMounted = false
    }
  }, [])

  const handleViewDetails = async (contributionId) => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setDetailError('Unauthorized access.')
      return
    }

    try {
      setDetailError('')
      setDetailLoading(true)
      const response = await fetch(`${apiBaseUrl}/users/contributions/${contributionId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load contribution details.')
      }

      const data = await response.json()
      setSelected(data)
      setEditData({ ...data })
      setImageFile(null)
      setImageName('')
    } catch (err) {
      setDetailError(err?.message || 'Failed to load contribution details.')
      setSelected(null)
      setEditData(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleEditChange = (field) => (event) => {
    setEditData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSave = async () => {
    if (!selected?._id) return
    const token = localStorage.getItem('access-token')
    if (!token) {
      setDetailError('Unauthorized access.')
      return
    }

    try {
      setSaving(true)
      let questionImageUrl = editData?.questionImageUrl || ''
      if (imageFile) {
        const formPayload = new FormData()
        formPayload.append('image', imageFile)
        const uploadResponse = await fetch(`${apiBaseUrl}/upload/question-image`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formPayload,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image.')
        }

        const uploadData = await uploadResponse.json()
        questionImageUrl = uploadData.url || ''
      }

      const payload = {
        subjectName: editData.subjectName,
        courseCode: editData.courseCode,
        batch: editData.batch,
        semester: editData.semester,
        type: editData.type,
        section: isCt ? editData.section : '',
        facultyName: isCt ? editData.facultyName : '',
        uploaderComment: editData.uploaderComment,
        questionImageUrl,
        status: canEdit && statusValue === 'rejected' ? 'Pending' : editData.status,
      }

      const response = await fetch(`${apiBaseUrl}/users/contributions/${selected._id}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to update contribution.')
      }

      const nextStatus = payload.status || editData.status
      setSelected((prev) => (prev ? { ...prev, ...payload, questionImageUrl } : prev))
      setEditData((prev) => (prev ? { ...prev, ...payload, questionImageUrl } : prev))
      setContributions((prev) => {
        if (statusValue === 'rejected' && String(nextStatus || '').toLowerCase() === 'pending') {
          return prev.filter((item) => item._id !== selected._id)
        }
        return prev.map((item) =>
          item._id === selected._id ? { ...item, ...payload, questionImageUrl } : item,
        )
      })
      setImageFile(null)
      setImageName('')
      if (statusValue === 'rejected' && String(nextStatus || '').toLowerCase() === 'pending') {
        setSelected(null)
        setEditData(null)
      }
    } catch (err) {
      setDetailError(err?.message || 'Failed to update contribution.')
    } finally {
      setSaving(false)
    }
  }

  const rows = useMemo(() => contributions, [contributions])

  return (
    <div className="space-y-6">
      <DashboardSection
        title="My Contribution"
        description="Track the questions, notes, and resources you have contributed."
      />

      <section className="flex flex-wrap items-center gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            type="button"
            className={[
              'rounded-full border px-4 py-1.5 text-xs font-semibold transition',
              statusFilter === status
                ? 'border-[#1E3A8A] bg-[#E0E7FF] text-[#1E3A8A]'
                : 'border-[#E5E7EB] text-[#64748B] hover:text-[#1E3A8A]',
            ].join(' ')}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
        {loading ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">Loading contributions...</div>
        ) : error ? (
          <div className="px-4 py-6 text-sm text-[#DC2626]">{error}</div>
        ) : rows.length === 0 ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">No contributions found.</div>
        ) : (
          <>
            <div className="sm:hidden">
              <div className="divide-y divide-[#E5E7EB]">
                {rows.map((row) => (
                  <div key={row._id} className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                      <span>{row.subjectName || '--'}</span>
                      {commentBadgeMap[String(row._id)] ? (
                        <span className="rounded-full bg-[#DC2626] px-2 py-0.5 text-[10px] font-semibold text-white">
                          New Comment
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                      <span>{row.batch ? `CSE ${row.batch}` : 'CSE --'}</span>
                      <span>{row.type || '--'}</span>
                      <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold text-[#475569]">
                        {row.status || '--'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="mt-2 ml-auto block rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                      onClick={() => handleViewDetails(row._id)}
                    >
                      Details
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[720px] text-left text-sm text-[#475569]">
              <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#475569]">
                <tr>
                  <th className="px-4 py-3 font-semibold text-[#0F172A]">Subject</th>
                  <th className="px-4 py-3 font-semibold text-[#0F172A]">Batch</th>
                  <th className="px-4 py-3 font-semibold text-[#0F172A]">Type</th>
                  <th className="px-4 py-3 font-semibold text-[#0F172A]">Status</th>
                  <th className="px-4 py-3 font-semibold text-[#0F172A]">Details</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id} className="border-t border-[#E5E7EB]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-semibold text-[#0F172A]">
                        <span>{row.subjectName || '--'}</span>
                        {commentBadgeMap[String(row._id)] ? (
                          <span className="rounded-full bg-[#DC2626] px-2 py-0.5 text-[10px] font-semibold text-white">
                            New Comment
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">{row.batch ? `CSE ${row.batch}` : '--'}</td>
                    <td className="px-4 py-3">{row.type || '--'}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold text-[#475569]">
                        {row.status || '--'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                        onClick={() => handleViewDetails(row._id)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </section>

      {selected ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0F172A]/60 px-4 py-6">
          <div className="w-full max-w-[760px] max-h-[85vh] overflow-hidden rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0F172A]">Contribution details</h2>
              <button
                type="button"
                className="text-sm font-semibold text-[#64748B]"
                onClick={() => {
                  setSelected(null)
                  setDetailError('')
                  setDetailLoading(false)
                  setEditData(null)
                  setImageFile(null)
                  setImageName('')
                }}
              >
                Close
              </button>
            </div>

            {detailLoading ? (
              <p className="mt-3 text-sm text-[#64748B]">Loading details...</p>
            ) : detailError ? (
              <p className="mt-3 text-sm text-[#DC2626]">{detailError}</p>
            ) : editData ? (
              <div className="mt-4 max-h-[70vh] space-y-3 overflow-y-auto text-sm text-[#475569]">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-xs font-semibold text-[#64748B]">
                    Subject name
                    <input
                      type="text"
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                      value={editData.subjectName || ''}
                      onChange={handleEditChange('subjectName')}
                      disabled={!canEdit}
                    />
                  </label>
                  <label className="space-y-1 text-xs font-semibold text-[#64748B]">
                    Course code
                    <input
                      type="text"
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                      value={editData.courseCode || ''}
                      onChange={handleEditChange('courseCode')}
                      disabled={!canEdit}
                    />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="space-y-1 text-xs font-semibold text-[#64748B]">
                    Batch
                    <select
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                      value={normalizeBatch(editData.batch)}
                      onChange={handleEditChange('batch')}
                      disabled={!canEdit}
                    >
                      <option value="">Select</option>
                      {batchOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs font-semibold text-[#64748B]">
                    Semester
                    <input
                      type="text"
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                      value={editData.semester || ''}
                      onChange={handleEditChange('semester')}
                      disabled={!canEdit}
                    />
                  </label>
                  <label className="space-y-1 text-xs font-semibold text-[#64748B]">
                    Type
                    <select
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                      value={editData.type || ''}
                      onChange={handleEditChange('type')}
                      disabled={!canEdit}
                    >
                      <option value="Final">Final</option>
                      <option value="CT">CT</option>
                    </select>
                  </label>
                </div>
                {isCt ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1 text-xs font-semibold text-[#64748B]">
                      Section
                      <select
                        className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                        value={normalizeSection(editData.section)}
                        onChange={handleEditChange('section')}
                        disabled={!canEdit}
                      >
                        <option value="">Select</option>
                        {sectionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-1 text-xs font-semibold text-[#64748B]">
                      Faculty name
                      <input
                        type="text"
                        className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                        value={editData.facultyName || ''}
                        onChange={handleEditChange('facultyName')}
                      disabled={!canEdit}
                      />
                    </label>
                  </div>
                ) : null}
                <label className="space-y-1 text-xs font-semibold text-[#64748B]">
                  Uploader comment
                  <textarea
                    rows="2"
                    className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                    value={editData.uploaderComment || ''}
                    onChange={handleEditChange('uploaderComment')}
                      disabled={!canEdit}
                  />
                </label>

                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <p className="text-xs font-semibold text-[#64748B]">Question image</p>
                  {editData.questionImageUrl ? (
                    <img
                      src={editData.questionImageUrl}
                      alt="Question"
                      className="mt-2 max-h-[240px] w-full rounded-lg object-contain"
                    />
                  ) : (
                    <p className="mt-2 text-xs text-[#94A3B8]">No image uploaded.</p>
                  )}
                  {canEdit ? (
                    <label className="mt-3 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-[#CBD5F5] bg-white px-3 py-2 text-xs text-[#475569]">
                      <span>{imageName || 'Upload new image'}</span>
                      <span className="rounded-full bg-[#E0E7FF] px-2 py-0.5 text-[10px] font-semibold text-[#1E3A8A]">
                        Browse
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          setImageFile(file || null)
                          setImageName(file ? file.name : '')
                        }}
                      />
                    </label>
                  ) : null}
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">
                  <p className="text-xs font-semibold text-[#64748B]">Moderator/CR feedback</p>
                  {editData.feedback?.length ? (
                    <div className="mt-2 space-y-2 text-xs text-[#475569]">
                      {editData.feedback.map((item, index) => (
                        <div key={`${item.createdAt || ''}-${index}`} className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2">
                          <p className="font-semibold text-[#0F172A]">{item.message}</p>
                          <p className="mt-1 text-[10px] text-[#94A3B8]">
                            {item.byName || item.byEmail || 'Staff'} {item.role ? `• ${item.role}` : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-[#94A3B8]">No feedback yet.</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-[#64748B]">
                    Status: <span className="text-[#0F172A]">{editData.status || '--'}</span>
                  </span>
                  {canEdit ? (
                    <button
                      type="button"
                      className="rounded-xl bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] disabled:opacity-60"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : statusValue === 'rejected' ? 'Review Again' : 'Save changes'}
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default MyContribution
