import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardSection from './DashboardSection.jsx'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/ConfirmModal.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function MyComment() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState('')
  const [editingText, setEditingText] = useState('')
  const [saving, setSaving] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState('')

  const fetchComments = async () => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      toast.error('Unauthorized access.')
      setLoading(false)
      return
    }

    try {
      setError('')
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/comment/user`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load comments.')
      }

      const data = await response.json()
      setComments(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load comments.')
      toast.error(err?.message || 'Failed to load comments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const handleEdit = (comment) => {
    setEditingId(comment._id)
    setEditingText(comment.message || '')
  }

  const handleCancel = () => {
    setEditingId('')
    setEditingText('')
  }

  const handleSave = async () => {
    if (!editingId) return
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      toast.error('Unauthorized access.')
      return
    }
    const message = editingText.trim()
    if (!message) {
      setError('Comment cannot be empty.')
      toast.error('Comment cannot be empty.')
      return
    }

    try {
      setSaving(true)
      setError('')
      const response = await fetch(`${apiBaseUrl}/comment/${editingId}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error('Failed to update comment.')
      }

      toast.success('Comment updated.')
      handleCancel()
      await fetchComments()
    } catch (err) {
      setError(err?.message || 'Failed to update comment.')
      toast.error(err?.message || 'Failed to update comment.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (commentId) => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      toast.error('Unauthorized access.')
      return
    }

    try {
      setError('')
      const response = await fetch(`${apiBaseUrl}/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment.')
      }

      toast.success('Comment deleted.')
      await fetchComments()
    } catch (err) {
      setError(err?.message || 'Failed to delete comment.')
      toast.error(err?.message || 'Failed to delete comment.')
    }
  }

  return (
    <div className="space-y-6">
      <DashboardSection
        title="My Comment"
        description="See the latest comments and replies you have posted."
      />

      <section className="rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        {loading ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">Loading comments...</div>
        ) : error ? (
          <div className="px-4 py-6 text-sm font-semibold text-[#DC2626]">{error}</div>
        ) : comments.length === 0 ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">No comments yet.</div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {comments.map((comment) => (
              <div key={comment._id} className="px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-[#94A3B8]">Question</p>
                    <Link
                      to={`/question/${comment.questionId}`}
                      className="text-sm font-semibold text-[#1E3A8A] hover:underline"
                    >
                      {comment.questionSubject || 'View question'}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-[#64748B]">
                      <span>{comment.questionBatch ? `CSE ${comment.questionBatch}` : 'CSE --'}</span>
                      <span>{comment.questionType || '--'}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>

                {editingId === comment._id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      rows="3"
                      className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm text-[#475569] outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
                      value={editingText}
                      onChange={(event) => setEditingText(event.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-[#1E3A8A] px-3 py-1 text-xs font-semibold text-white"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-[#E2E8F0] px-3 py-1 text-xs font-semibold text-[#475569]"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-3 text-sm text-[#475569]">{comment.message}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs font-semibold">
                      <button
                        type="button"
                        className="text-[#1E3A8A]"
                        onClick={() => handleEdit(comment)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-[#DC2626]"
                        onClick={() => setPendingDeleteId(comment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <ConfirmModal
        isOpen={Boolean(pendingDeleteId)}
        title="Delete comment?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setPendingDeleteId('')}
        onConfirm={() => {
          const id = pendingDeleteId
          setPendingDeleteId('')
          handleDelete(id)
        }}
        isProcessing={saving}
      />
    </div>
  )
}

export default MyComment
