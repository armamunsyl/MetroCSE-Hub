import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HiOutlineArrowLeft, HiOutlineDocumentText, HiOutlineSquares2X2 } from 'react-icons/hi2'
import { AuthContext } from '../Provider/AuthProvider.jsx'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function QuestionDetails() {
  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [commentError, setCommentError] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState('')
  const [questionMenuOpen, setQuestionMenuOpen] = useState(false)
  const [commentMenuOpenId, setCommentMenuOpenId] = useState('')
  const [imageZoom, setImageZoom] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const isZoomed = imageZoom > 1

  const ensureJwt = async (email) => {
    if (!email) {
      return null
    }
    const jwtResponse = await fetch(`${apiBaseUrl}/jwt`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!jwtResponse.ok) {
      return null
    }

    const jwtData = await jwtResponse.json().catch(() => null)
    if (jwtData?.token) {
      localStorage.setItem('access-token', jwtData.token)
      window.dispatchEvent(new Event('auth-token-updated'))
      return jwtData.token
    }
    return null
  }

  const getToken = async () => {
    let token = localStorage.getItem('access-token')
    if (!token && user?.email) {
      token = await ensureJwt(user.email)
    }
    return token
  }

  const fetchQuestionWithToken = async (token) => {
    const response = await fetch(`${apiBaseUrl}/questions/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json().catch(() => null)
    return { response, data }
  }

  const fetchComments = async () => {
    const token = await getToken()
    if (!token) {
      setCommentError('Unauthorized access.')
      return
    }
    try {
      setCommentError('')
      const response = await fetch(`${apiBaseUrl}/comment?questionId=${id}`, {
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
    const fetchQuestion = async () => {
      try {
        setError('')
        setLoading(true)
        const token = await getToken()
        if (!token) {
          setError('Unauthorized access.')
          return
        }

        let { response, data } = await fetchQuestionWithToken(token)
        if (response.status === 401 && user?.email) {
          const refreshedToken = await ensureJwt(user.email)
          if (refreshedToken) {
            const retryResult = await fetchQuestionWithToken(refreshedToken)
            response = retryResult.response
            data = retryResult.data
          }
        }

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('access-token')
            window.dispatchEvent(new Event('auth-token-updated'))
          }
          throw new Error(data?.message || 'Failed to load question details.')
        }

        setQuestion(data)
      } catch (err) {
        setError(err?.message || 'Failed to load question details.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [id, user?.email])

  useEffect(() => {
    if (question?._id) {
      fetchComments()
    }
  }, [question?._id])

  const questionImages = useMemo(() => {
    const images = Array.isArray(question?.questionImageUrls) ? question.questionImageUrls : []
    const primary = question?.questionImageUrl ? [question.questionImageUrl] : []
    const merged = [...images, ...primary].filter(Boolean)
    return Array.from(new Set(merged))
  }, [question?.questionImageUrls, question?.questionImageUrl])

  useEffect(() => {
    if (questionImages.length > 0) {
      setImageZoom(1)
      setActiveImageIndex(0)
    }
  }, [questionImages])

  const initials = useMemo(() => {
    const name = question?.uploaderName || ''
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }, [question?.uploaderName])
  const activeImage = questionImages[activeImageIndex]

  const handleSubmitComment = async (event) => {
    event.preventDefault()
    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty.')
      return
    }
    const token = await getToken()
    if (!token) {
      setCommentError('Unauthorized access.')
      return
    }

    try {
      setCommentSubmitting(true)
      setCommentError('')
      const endpoint = editingCommentId ? `${apiBaseUrl}/comment/${editingCommentId}` : `${apiBaseUrl}/comment`
      const method = editingCommentId ? 'PATCH' : 'POST'
      const payload = editingCommentId
        ? { message: commentText.trim() }
        : { questionId: id, message: commentText.trim() }
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
    const token = await getToken()
    if (!token) {
      setCommentError('Unauthorized access.')
      toast.error('Unauthorized access.')
      return
    }
    try {
      setCommentError('')
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
      setCommentError(err?.message || 'Failed to delete comment.')
      toast.error(err?.message || 'Failed to delete comment.')
    }
  }

  const handleReport = async (targetType, targetId) => {
    const token = await getToken()
    if (!token) {
      toast.error('Unauthorized access.')
      return
    }
    try {
      const response = await fetch(`${apiBaseUrl}/reports`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ targetType, targetId }),
      })
      if (!response.ok) {
        throw new Error('Failed to submit report.')
      }
      toast.success('Reported to admin.')
    } catch (err) {
      toast.error(err?.message || 'Failed to submit report.')
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 pb-20 sm:px-8">
      <section className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <div>
          <Link
            to="/question"
            className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] shadow-[0_6px_14px_rgba(15,23,42,0.08)]"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Back to questions
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-[#0F172A] sm:text-3xl">Question details</h1>
          <p className="mt-1 text-sm text-[#64748B]">Review the uploaded question and author information.</p>
        </div>
      </section>

      {loading ? (
        <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-6 text-sm text-[#64748B]">
          Loading question details...
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-6 text-sm font-semibold text-[#B91C1C]">
          {error}
        </div>
      ) : question ? (
        <>
          <div className="mt-8 lg:hidden">
            <div className="rounded-3xl border border-[#0F172A] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-3">
                <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-xl border border-[#0F172A]/10 bg-[#EEF2FF] text-[#1E3A8A]">
                  {question.uploaderImage ? (
                    <img
                      src={question.uploaderImage}
                      alt={question.uploaderName || 'Uploader'}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-semibold">{initials || 'U'}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{question.uploaderName || 'Unknown'}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#475569]">
                    <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 font-semibold text-[#0369A1]">
                      {question.uploaderRole || 'Student'}
                    </span>
                    <span className="rounded-full bg-[#E2E8F0] px-2 py-0.5 font-semibold text-[#475569]">
                      {question.uploaderBatch ? `CSE ${question.uploaderBatch}` : 'CSE --'}
                    </span>
                    <span className="rounded-full bg-[#EDE9FE] px-2 py-0.5 font-semibold text-[#4C1D95]">
                      {question.uploaderSection || '--'}
                    </span>
                    <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 font-semibold text-[#166534]">
                      {question.uploaderScore ?? 0}
                    </span>
                  </div>
                </div>
                <div className="relative ml-auto">
                  <button
                    type="button"
                    className="rounded-full border border-[#E2E8F0] px-2 py-1 text-xs font-semibold text-[#475569]"
                    onClick={() => setQuestionMenuOpen((prev) => !prev)}
                  >
                    ⋯
                  </button>
                  {questionMenuOpen ? (
                    <div className="absolute right-0 top-9 z-10 w-44 rounded-xl border border-[#E5E7EB] bg-white p-2 text-xs text-[#475569] shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                      <button
                        type="button"
                        className="w-full rounded-lg px-3 py-2 text-left font-semibold text-[#DC2626] hover:bg-[#FEE2E2]"
                        onClick={() => {
                          setQuestionMenuOpen(false)
                          handleReport('question', question._id)
                        }}
                      >
                        Report to admin
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 text-sm font-semibold text-[#0F172A]">
                {question.subjectName || '--'}
                <span className="text-[#94A3B8]">,</span>{' '}
                {question.batch ? `CSE ${question.batch}` : 'CSE --'}
                <span className="text-[#94A3B8]">,</span>{' '}
                {question.section || '--'}
                <span className="text-[#94A3B8]">,</span>{' '}
                {question.facultyName || '--'}
                <span className="text-[#94A3B8]">,</span>{' '}
                {question.semester || '--'}
                <span className="text-[#94A3B8]">,</span>{' '}
                {question.type || '--'}
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Uploader comment</p>
                <p className="mt-2 text-sm text-[#475569]">
                  {question.uploaderComment || 'No comment provided.'}
                </p>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-[#0F172A]">Question image</h2>
                  <div className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] text-[#475569]">
                    <button
                      type="button"
                      className="rounded-full px-2 py-0.5 font-semibold text-[#1E3A8A]"
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
                      className="w-20"
                      aria-label="Zoom level"
                    />
                    <button
                      type="button"
                      className="rounded-full px-2 py-0.5 font-semibold text-[#1E3A8A]"
                      onClick={() => setImageZoom((zoom) => Math.min(3, Number((zoom + 0.2).toFixed(1))))}
                    >
                      +
                    </button>
                  </div>
                </div>
                {questionImages.length > 1 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {questionImages.map((imageUrl, index) => (
                      <button
                        key={`${imageUrl}-${index}`}
                        type="button"
                        className={[
                          'h-12 w-12 overflow-hidden rounded-xl border transition',
                          index === activeImageIndex ? 'border-[#1E3A8A]' : 'border-[#E2E8F0]',
                        ].join(' ')}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img src={imageUrl} alt="Question thumbnail" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
                <div
                  className={[
                    'mt-3 flex min-h-[280px] rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-3',
                    isZoomed ? 'items-start justify-start overflow-auto' : 'items-center justify-center overflow-hidden',
                  ].join(' ')}
                >
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt="Question"
                      className="h-auto max-w-none object-contain"
                      style={{
                        width: '100%',
                        transform: `scale(${imageZoom})`,
                        transformOrigin: 'top left',
                      }}
                    />
                  ) : (
                    <div className="text-sm text-[#94A3B8]">No image uploaded for this question.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 hidden lg:grid lg:grid-cols-[320px_1fr] lg:gap-6">
            <aside className="space-y-4 rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-3">
                <div className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#EEF2FF] text-[#1E3A8A]">
                  {question.uploaderImage ? (
                    <img
                      src={question.uploaderImage}
                      alt={question.uploaderName || 'Uploader'}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-base font-semibold">{initials || 'U'}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{question.uploaderName || 'Unknown'}</p>
                  <p className="text-xs text-[#64748B]">
                    {question.uploaderBatch ? `CSE ${question.uploaderBatch}` : 'CSE --'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
                <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 font-semibold text-[#1E3A8A]">
                  {question.uploaderRole || 'Student'}
                </span>
                <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 font-semibold">
                  {question.uploaderSection ? `Sec ${question.uploaderSection}` : 'Sec --'}
                </span>
                <span className="rounded-full bg-[#ECFEFF] px-2.5 py-1 font-semibold text-[#0F766E]">
                  Score {question.uploaderScore ?? 0}
                </span>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Question info</p>
                <div className="mt-3 space-y-2 text-sm text-[#475569]">
                  <div className="flex items-center gap-2">
                    <HiOutlineDocumentText className="h-4 w-4 text-[#1E3A8A]" />
                    <span className="font-semibold text-[#0F172A]">{question.subjectName || '--'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineSquares2X2 className="h-4 w-4 text-[#1E3A8A]" />
                    <span>{question.batch ? `CSE ${question.batch}` : 'CSE --'}</span>
                  </div>
                  <div className="grid gap-2 text-xs text-[#64748B] sm:grid-cols-2">
                    <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                      <span className="text-[10px] uppercase text-[#94A3B8]">Course</span>
                      <p className="text-sm font-semibold text-[#0F172A]">{question.courseCode || '--'}</p>
                    </div>
                    <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                      <span className="text-[10px] uppercase text-[#94A3B8]">Semester</span>
                      <p className="text-sm font-semibold text-[#0F172A]">{question.semester || '--'}</p>
                    </div>
                    <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                      <span className="text-[10px] uppercase text-[#94A3B8]">Type</span>
                      <p className="text-sm font-semibold text-[#0F172A]">{question.type || '--'}</p>
                    </div>
                    <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                      <span className="text-[10px] uppercase text-[#94A3B8]">Section</span>
                      <p className="text-sm font-semibold text-[#0F172A]">{question.section || '--'}</p>
                    </div>
                    <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 sm:col-span-2">
                      <span className="text-[10px] uppercase text-[#94A3B8]">Faculty</span>
                      <p className="text-sm font-semibold text-[#0F172A]">{question.facultyName || '--'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Uploader comment</p>
                <p className="mt-2 text-sm text-[#475569]">
                  {question.uploaderComment || 'No comment provided.'}
                </p>
              </div>
            </aside>

            <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-[#0F172A]">Question image</h2>
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-full border border-[#E2E8F0] px-2 py-1 text-xs font-semibold text-[#475569]"
                      onClick={() => setQuestionMenuOpen((prev) => !prev)}
                    >
                      ⋯
                    </button>
                    {questionMenuOpen ? (
                      <div className="absolute right-0 top-9 z-10 w-44 rounded-xl border border-[#E5E7EB] bg-white p-2 text-xs text-[#475569] shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left font-semibold text-[#DC2626] hover:bg-[#FEE2E2]"
                          onClick={() => {
                            setQuestionMenuOpen(false)
                            handleReport('question', question._id)
                          }}
                        >
                          Report to admin
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
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
              </div>
              {questionImages.length > 1 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {questionImages.map((imageUrl, index) => (
                    <button
                      key={`${imageUrl}-${index}`}
                      type="button"
                      className={[
                        'h-14 w-14 overflow-hidden rounded-2xl border transition',
                        index === activeImageIndex ? 'border-[#1E3A8A]' : 'border-[#E2E8F0]',
                      ].join(' ')}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={imageUrl} alt="Question thumbnail" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}

              <div
                className={[
                  'mt-4 flex min-h-[320px] rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-3',
                  isZoomed ? 'items-start justify-start overflow-auto' : 'items-center justify-center overflow-hidden',
                ].join(' ')}
              >
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt="Question"
                    className="h-auto max-w-none object-contain"
                    style={{
                      width: '100%',
                      transform: `scale(${imageZoom})`,
                      transformOrigin: 'top left',
                    }}
                  />
                ) : (
                  <div className="text-sm text-[#94A3B8]">No image uploaded for this question.</div>
                )}
              </div>
            </section>
          </div>
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
                      <div className="relative">
                        <button
                          type="button"
                          className="rounded-full border border-[#E2E8F0] px-2 py-1 text-xs font-semibold text-[#475569]"
                          onClick={() =>
                            setCommentMenuOpenId((prev) => (prev === comment._id ? '' : comment._id))
                          }
                        >
                          ⋯
                        </button>
                        {commentMenuOpenId === comment._id ? (
                          <div className="absolute right-0 top-9 z-10 w-44 rounded-xl border border-[#E5E7EB] bg-white p-2 text-xs text-[#475569] shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                            <button
                              type="button"
                              className="w-full rounded-lg px-3 py-2 text-left font-semibold text-[#DC2626] hover:bg-[#FEE2E2]"
                              onClick={() => {
                                setCommentMenuOpenId('')
                                handleReport('comment', comment._id)
                              }}
                            >
                              Report to admin
                            </button>
                          </div>
                        ) : null}
                      </div>
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
              const id = pendingDeleteId
              setPendingDeleteId('')
              handleDeleteComment(id)
            }}
          />
        </>
      ) : null}
    </main>
  )
}

export default QuestionDetails
