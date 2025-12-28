import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

const filters = {
  batches: ['CSE 57', 'CSE 57', 'CSE 59', 'CSE 57', 'CSE 60', 'CSE 61', 'CSE 62', 'CSE 63', 'CSE 64'],
  sections: ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F', 'Sec G', 'Sec H'],
  semesters: ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '3.1', '3.2', '3.3', '4.1', '4.2', '4.3'],
  types: ['Final', 'CT'],
  subjects: ['AD&A', 'Data Structure', 'Structured Programming', 'DLD', 'BEE 1', 'BEE 2'],
}

const Question = () => {
  const [page, setPage] = useState(1)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    subject: '',
    courseCode: '',
    batch: '',
    semester: '',
    section: '',
    facultyName: '',
    examType: 'CT',
    comment: '',
  })
  const [imageName, setImageName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const isFinal = formData.examType === 'Final'
  const PAGE_SIZE = 10
  const totalPages = Math.max(1, Math.ceil(questions.length / PAGE_SIZE))
  const startIndex = (page - 1) * PAGE_SIZE
  const pageRows = questions.slice(startIndex, startIndex + PAGE_SIZE)

  useEffect(() => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      setLoading(false)
      return
    }

    const fetchQuestions = async () => {
      try {
        setError('')
        setLoading(true)
        const response = await fetch(`${apiBaseUrl}/questions?status=Approved`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load questions.')
        }

        const data = await response.json()
        setQuestions(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err?.message || 'Failed to load questions.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const getInitials = useMemo(() => {
    return (name) =>
      String(name || '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
  }, [])

  const handleFieldChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('access-token')
    if (!token) {
      setSubmitError('Unauthorized access.')
      return
    }

    try {
      setSubmitError('')
      setSubmitting(true)
      let questionImageUrl = ''

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
        subjectName: formData.subject,
        courseCode: formData.courseCode,
        batch: formData.batch,
        semester: formData.semester,
        type: formData.examType,
        section: formData.examType === 'CT' ? formData.section : '',
        facultyName: formData.examType === 'CT' ? formData.facultyName : '',
        questionImageUrl,
        uploaderComment: formData.comment,
      }

      const response = await fetch(`${apiBaseUrl}/questions`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit question.')
      }

      setModalOpen(false)
      setFormData({
        subject: '',
        courseCode: '',
        batch: '',
        semester: '',
        section: '',
        facultyName: '',
        examType: 'CT',
        comment: '',
      })
      setImageName('')
      setImageFile(null)
    } catch (err) {
      setSubmitError(err?.message || 'Failed to submit question.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 pb-20 sm:px-8">
      <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] sm:text-3xl">Questions</h1>
          <p className="mt-2 text-sm text-[#475569]">
            Recent 10 questions with filters for batch, section, semester, type, and subject.
          </p>
        </div>
        <button
          type="button"
          className="rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95"
          onClick={() => setModalOpen(true)}
        >
          Upload Question
        </button>
      </section>

      <section className="mb-8 grid gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_8px_16px_rgba(0,0,0,0.06)]">
        <div>
          <label className="text-xs font-semibold text-[#475569]">Search</label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 py-2">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-[#1E3A8A]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="text"
              placeholder="Search by course code, subject, or year"
              className="w-full bg-transparent text-sm text-[#475569] outline-none placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="text-xs font-semibold text-[#475569]">Batch</label>
            <select className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]">
              <option>All</option>
              {filters.batches.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569]">Section</label>
            <select className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]">
              <option>All</option>
              {filters.sections.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569]">Semester</label>
            <select className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]">
              <option>All</option>
              {filters.semesters.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569]">Type</label>
            <select className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]">
              <option>All</option>
              {filters.types.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569]">Subject</label>
            <select className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]">
              <option>All</option>
              {filters.subjects.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
        <div className="divide-y divide-[#E5E7EB]">
          {loading ? (
            <div className="px-4 py-6 text-sm text-[#64748B]">Loading approved questions...</div>
          ) : error ? (
            <div className="px-4 py-6 text-sm font-semibold text-[#DC2626]">{error}</div>
          ) : pageRows.length === 0 ? (
            <div className="px-4 py-6 text-sm text-[#64748B]">No approved questions found.</div>
          ) : (
            pageRows.map((row) => (
              <Link
                key={row._id}
                to={`/question/${row._id}`}
                className="flex items-center gap-4 px-4 py-4 transition hover:bg-[#F8FAFC]"
              >
                <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-[#E5E7EB] bg-[#EEF2FF] text-[#1E3A8A]">
                  {row.uploaderImage ? (
                    <img
                      src={row.uploaderImage}
                      alt={row.uploaderName || 'Uploader'}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-semibold">{getInitials(row.uploaderName)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#0F172A] sm:text-base">
                    {row.subjectName || '--'}
                    <span className="text-[#94A3B8]">,</span>{' '}
                    {row.batch ? `CSE ${row.batch}` : 'CSE --'}
                  </div>
                  <div className="mt-2 inline-flex flex-wrap items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-xs text-[#64748B]">
                    <span className="max-w-[140px] truncate font-semibold text-[#0F172A] sm:max-w-none sm:truncate-none">
                      {row.uploaderName || 'Unknown'}
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#475569]">
                      {row.uploaderBatch ? `CSE ${row.uploaderBatch}` : 'CSE --'}
                    </span>
                    <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#1E3A8A]">
                      {row.uploaderRole || 'Student'}
                    </span>
                    <span className="hidden rounded-full bg-[#ECFEFF] px-2 py-0.5 text-[11px] font-semibold text-[#0F766E] sm:inline-flex">
                      Score {row.uploaderScore ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-3 text-xs text-[#475569]">
          <button
            type="button"
            className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-[#1E3A8A] disabled:opacity-50"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1 || loading || pageRows.length === 0}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-[#1E3A8A] disabled:opacity-50"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages || loading || pageRows.length === 0}
          >
            Next
          </button>
        </div>
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#0F172A]/40 px-3">
          <div className="w-full max-w-[520px] rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.25)] sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#0F172A] sm:text-base">Upload question</h2>
              <button
                type="button"
                className="text-xs font-semibold text-[#64748B] sm:text-sm"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
            <form
              className="mt-3 max-h-[75vh] space-y-3 overflow-y-auto text-xs text-[#475569] sm:mt-4 sm:max-h-none sm:space-y-4 sm:text-sm"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <label className="space-y-1 text-xs font-semibold text-[#475569] sm:col-span-2 sm:space-y-2">
                  Subject
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                    value={formData.subject}
                    onChange={handleFieldChange('subject')}
                  />
                </label>
                <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:gap-4">
                  <label className="space-y-1 text-xs font-semibold text-[#475569] sm:space-y-2">
                    Course code
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                      value={formData.courseCode}
                      onChange={handleFieldChange('courseCode')}
                    />
                  </label>
                  <label className="space-y-1 text-xs font-semibold text-[#475569] sm:space-y-2">
                    Batch
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                      value={formData.batch}
                      onChange={handleFieldChange('batch')}
                    />
                  </label>
                </div>
                <label className="space-y-1 text-xs font-semibold text-[#475569] sm:space-y-2">
                  Semester
                  <select
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                    value={formData.semester}
                    onChange={handleFieldChange('semester')}
                  >
                    <option value="">Select</option>
                    {filters.semesters.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-xs font-semibold text-[#475569] sm:space-y-2">
                  Type
                  <select
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                    value={formData.examType}
                    onChange={handleFieldChange('examType')}
                  >
                    <option value="Final">Final</option>
                    <option value="CT">CT</option>
                  </select>
                </label>
                {!isFinal ? (
                  <>
                    <label className="space-y-1 text-xs font-semibold text-[#475569] sm:space-y-2">
                      Section
                      <input
                        type="text"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                        value={formData.section}
                        onChange={handleFieldChange('section')}
                      />
                    </label>
                    <label className="space-y-1 text-xs font-semibold text-[#475569] sm:col-span-2 sm:space-y-2">
                      Faculty name
                      <input
                        type="text"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                        value={formData.facultyName}
                        onChange={handleFieldChange('facultyName')}
                      />
                    </label>
                  </>
                ) : null}
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-[#CBD5F5] bg-[#F8FAFF] px-3 py-2 text-xs text-[#475569] sm:px-4 sm:py-3 sm:text-sm">
                <span className="text-xs sm:text-sm">
                  {imageName ? imageName : 'Upload image'}
                </span>
                <span className="rounded-full bg-[#E0E7FF] px-2.5 py-1 text-[10px] font-semibold text-[#1E3A8A] sm:px-3 sm:text-xs">
                  Browse
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    setImageName(file ? file.name : '')
                    setImageFile(file || null)
                  }}
                />
              </label>

              <label className="space-y-1 text-xs font-semibold text-[#475569] sm:space-y-2">
                Comment
                <textarea
                  rows="2"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                  value={formData.comment}
                  onChange={handleFieldChange('comment')}
                />
              </label>
              {submitError ? <p className="text-xs font-semibold text-[#DC2626]">{submitError}</p> : null}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[11px] font-semibold text-[#475569] sm:px-4 sm:text-xs"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1E3A8A] px-3 py-2 text-[11px] font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95 sm:px-4 sm:text-xs"
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

export default Question
