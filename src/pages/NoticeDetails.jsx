import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AuthContext } from '../Provider/AuthProvider.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function NoticeDetails() {
  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [commentError, setCommentError] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState('')

  const getToken = () => localStorage.getItem('access-token')

  const fetchNotice = async () => {
    const token = getToken()
    if (!token) {
      setError('Unauthorized access.')
      setLoading(false)
      return
    }
    try {
      setError('')
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/notices/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to load notice.')
      }
      const data = await response.json()
      setNotice(data)
    } catch (err) {
      setError(err?.message || 'Failed to load notice.')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    const token = getToken()
    if (!token) {
      setCommentError('Unauthorized access.')
      return
    }
    try {
      setCommentError('')
      const response = await fetch(`${apiBaseUrl}/notice-comments?noticeId=${id}`, {
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
      setCommentError(err?.message || 'Failed to load comments.')
    }
  }

  useEffect(() => {
    fetchNotice()
  }, [id])

  useEffect(() => {
    if (notice?._id) {
      fetchComments()
    }
  }, [notice?._id])

  const initials = useMemo(() => {
    const name = notice?.authorName || ''
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }, [notice?.authorName])

  const handleSubmitComment = async (event) => {
    event.preventDefault()
    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty.')
      return
    }
    const token = getToken()
    if (!token) {
      setCommentError('Unauthorized access.')
      return
    }

    try {
      setCommentSubmitting(true)
      setCommentError('')
      const endpoint = editingCommentId
        ? `${apiBaseUrl}/notice-comments/${editingCommentId}`
        : `${apiBaseUrl}/notice-comments`
      const method = editingCommentId ? 'PATCH' : 'POST'
      const payload = editingCommentId
        ? { message: commentText.trim() }
        : { noticeId: id, message: commentText.trim() }
      const response = await fetch(endpoint, {
        method,
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error('Failed to save comment.')
      }
      setCommentText('')
      setEditingCommentId('')
      toast.success(editingCommentId ? 'Comment updated.' : 'Comment posted.')
      await fetchComments()
    } catch (err) {
      setCommentError(err?.message || 'Failed to save comment.')
      toast.error(err?.message || 'Failed to save comment.')
    } finally {
      setCommentSubmitting(false)
    }
  }

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id)
    setCommentText(comment.message || '')
  }

  const handleDeleteComment = async (commentId) => {
    const token = getToken()
    if (!token) {
      setCommentError('Unauthorized access.')
      toast.error('Unauthorized access.')
      return
    }
    try {
      setCommentError('')
      const response = await fetch(`${apiBaseUrl}/notice-comments/${commentId}`, {
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
      setCommentError(err?.message || 'Failed to delete comment.')
      toast.error(err?.message || 'Failed to delete comment.')
    }
  }

  return (
    <main className="mx-auto w-full max-w-[980px] px-4 pb-20 sm:px-8">
      <section className="pt-4">
        <Link
          to="/notice"
          className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] shadow-[0_6px_14px_rgba(15,23,42,0.08)]"
        >
          Back to notices
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-[#0F172A] sm:text-3xl">Notice details</h1>
      </section>

      {loading ? (
        <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-6 text-sm text-[#64748B]">
          Loading notice...
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-6 text-sm font-semibold text-[#B91C1C]">
          {error}
        </div>
      ) : notice ? (
        <>
          <section className="mt-6 rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-start gap-4">
              <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-[#E5E7EB] bg-white text-[#1E3A8A]">
                {notice.authorImage ? (
                  <img
                    src={notice.authorImage}
                    alt={notice.authorName || 'Uploader'}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-sm font-semibold">{initials || 'U'}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">{notice.authorName || 'Student'}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#475569]">
                  <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 font-semibold text-[#1E3A8A]">
                    {notice.authorRole || 'Student'}
                  </span>
                  <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 font-semibold text-[#475569]">
                    {notice.authorBatch ? `CSE ${notice.authorBatch}` : 'CSE --'}
                  </span>
                  <span className="rounded-full bg-[#EDE9FE] px-2 py-0.5 font-semibold text-[#4C1D95]">
                    {notice.authorSection || '--'}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#94A3B8]">
                  {new Date(notice.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Title</p>
              <p className="mt-2 text-lg font-semibold text-[#0F172A]">{notice.title}</p>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Description</p>
              <p className="mt-2 text-sm text-[#475569]">{notice.description}</p>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <h2 className="text-lg font-semibold text-[#0F172A]">Comments</h2>
            <div className="mt-6 space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-[#94A3B8]">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 overflow-hidden rounded-full bg-white">
                          {comment.authorImage ? (
                            <img
                              src={comment.authorImage}
                              alt={comment.authorName || 'User'}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-xs font-semibold text-[#1E3A8A]">
                              {(comment.authorName || 'U').slice(0, 1)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {comment.authorName || 'User'}
                          </p>
                          <p className="text-[11px] text-[#94A3B8]">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[#475569]">
                            <span className="rounded-full bg-white px-2 py-0.5 font-semibold">
                              {comment.authorBatch ? `CSE ${comment.authorBatch}` : 'CSE --'}
                            </span>
                            <span className="rounded-full bg-[#EDE9FE] px-2 py-0.5 font-semibold text-[#4C1D95]">
                              {comment.authorSection || '--'}
                            </span>
                            <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 font-semibold text-[#1E3A8A]">
                              {comment.authorRole || 'Student'}
                            </span>
                            <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 font-semibold text-[#166534]">
                              Score {comment.authorScore ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      {comment.authorEmail === user?.email ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="text-xs font-semibold text-[#1E3A8A]"
                            onClick={() => handleEditComment(comment)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-xs font-semibold text-[#DC2626]"
                            onClick={() => setPendingDeleteId(comment._id)}
                          >
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <p className="mt-3 text-base font-semibold text-[#0F172A]">{comment.message}</p>
                  </div>
                ))
              )}
            </div>

            <form className="mt-6 space-y-3" onSubmit={handleSubmitComment}>
              <textarea
                rows="3"
                className="w-full rounded-2xl border border-[#E2E8F0] px-3 py-2 text-sm text-[#475569] outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
              />
              {commentError ? <p className="text-xs font-semibold text-[#DC2626]">{commentError}</p> : null}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95 disabled:opacity-60"
                  disabled={commentSubmitting}
                >
                  {commentSubmitting ? 'Saving...' : editingCommentId ? 'Update comment' : 'Post comment'}
                </button>
                {editingCommentId ? (
                  <button
                    type="button"
                    className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#475569]"
                    onClick={() => {
                      setEditingCommentId('')
                      setCommentText('')
                    }}
                  >
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <ConfirmModal
            isOpen={Boolean(pendingDeleteId)}
            title="Delete comment?"
            description="This action cannot be undone."
            confirmLabel="Delete"
            onCancel={() => setPendingDeleteId('')}
            onConfirm={() => {
              const commentId = pendingDeleteId
              setPendingDeleteId('')
              handleDeleteComment(commentId)
            }}
          />
        </>
      ) : null}
    </main>
  )
}

export default NoticeDetails
