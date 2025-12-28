import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HiOutlineArrowLeft, HiOutlineDocumentText, HiOutlineSquares2X2 } from 'react-icons/hi2'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function QuestionDetails() {
  const { id } = useParams()
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageZoom, setImageZoom] = useState(1)

  useEffect(() => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      setLoading(false)
      return
    }

    const fetchQuestion = async () => {
      try {
        setError('')
        setLoading(true)
        const response = await fetch(`${apiBaseUrl}/questions/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load question details.')
        }

        const data = await response.json()
        setQuestion(data)
      } catch (err) {
        setError(err?.message || 'Failed to load question details.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [id])

  useEffect(() => {
    if (question?.questionImageUrl) {
      setImageZoom(1)
    }
  }, [question?.questionImageUrl])

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
                <div className="mt-3 flex min-h-[280px] items-center justify-center overflow-auto rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-3">
                  {question.questionImageUrl ? (
                    <img
                      src={question.questionImageUrl}
                      alt="Question"
                      className="max-h-[60vh] w-auto max-w-full object-contain transition-transform"
                      style={{ transform: `scale(${imageZoom})`, transformOrigin: 'center' }}
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
                <h2 className="text-lg font-semibold text-[#0F172A]">Question image</h2>
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

              <div className="mt-4 flex min-h-[320px] items-center justify-center overflow-auto rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-3">
                {question.questionImageUrl ? (
                  <img
                    src={question.questionImageUrl}
                    alt="Question"
                    className="max-h-[70vh] w-auto max-w-full object-contain transition-transform"
                    style={{ transform: `scale(${imageZoom})`, transformOrigin: 'center' }}
                  />
                ) : (
                  <div className="text-sm text-[#94A3B8]">No image uploaded for this question.</div>
                )}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </main>
  )
}

export default QuestionDetails
