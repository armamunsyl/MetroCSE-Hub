import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../Provider/AuthProvider.jsx'
import toast from 'react-hot-toast'
import { batchLabels, sectionLabels, batchOptions, sectionOptions } from '../constants/academicOptions.js'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

const filters = {
  batches: batchLabels,
  sections: sectionLabels,
  semesters: ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '3.1', '3.2', '3.3', '4.1', '4.2', '4.3'],
  types: ['Final', 'CT'],
  subjects: [],
}

const courseOptionsRaw = [
  { code: 'CSE 231', name: 'Algorithm Design and Analysis' },
  { code: 'CSE 232', name: 'Algorithm Design and Analysis Lab' },
  { code: 'CSE 421', name: 'Artificial Intelligence' },
  { code: 'CSE 422', name: 'Artificial Intelligence Lab' },
  { code: 'SSS 0312 1207', name: 'Bangladesh Studies' },
  { code: 'CSE 131', name: 'Basic Electronics Engineering' },
  { code: 'CSE 132', name: 'Basic Electronics Engineering Lab' },
  { code: 'STA 215', name: 'Basic Statistics & Probability' },
  { code: 'CSE 215', name: 'Communication Engineering' },
  { code: 'CSE 401', name: 'Computer Graphics & Image Processing' },
  { code: 'CSE 402', name: 'Computer Graphics & Image Processing Lab' },
  { code: 'CSE 213', name: 'Computer Organization & Architecture' },
  { code: 'CSE 133', name: 'Data Structure' },
  { code: 'CSE 134', name: 'Data Structure Lab' },
  { code: 'CSE 223', name: 'Database Management System' },
  { code: 'CSE 224', name: 'Database Management System Lab' },
  { code: 'MAT 0541 1103', name: 'Differential and Integral Calculus' },
  { code: 'MAT 123', name: 'Differential Equation & Laplace Transform' },
  { code: 'CSE 211', name: 'Digital Logic Design' },
  { code: 'CSE 212', name: 'Digital Logic Design Lab' },
  { code: 'CSE 0541 1101', name: 'Discrete Mathematics' },
  { code: 'CSE 441', name: 'Digital Signal Processing' },
  { code: 'CSE 442', name: 'Digital Signal Processing Lab' },
  { code: 'GED 119', name: 'Engineering Ethics and Cyber Law' },
  { code: 'ENG 114', name: 'English I' },
  { code: 'ENG 115', name: 'English II' },
  { code: 'ENG 0231 1101', name: 'English' },
  { code: 'GED 202', name: 'History of Emergence of Bangladesh' },
  { code: 'CSE 123', name: 'Basic Electrical Engineering' },
  { code: 'CSE 124', name: 'Basic Electrical Engineering Lab' },
  { code: 'CSE 469', name: 'Bioinformatics Computing' },
  { code: 'CSE 470', name: 'Bioinformatics Computing Lab' },
  { code: 'GED 431', name: 'Business Communication' },
  { code: 'CSE 200', name: 'Competitive Programming' },
  { code: 'CSE 311', name: 'Computer Networks' },
  { code: 'CSE 312', name: 'Computer Networks Lab' },
  { code: 'GED 215', name: 'Industrial Management & Financial Accounting' },
  { code: 'PSY 0313 1205', name: 'Introduction to Psychology' },
  { code: 'CSE 471', name: 'Machine Learning' },
  { code: 'CSE 472', name: 'Machine Learning' },
  { code: 'MAT 0541 1205', name: 'Mathematical Methods and Complex Variable' },
  { code: 'MAT 135', name: 'Matrices, Complex Variable & Fourier Analysis' },
  { code: 'CSE 237', name: 'Microprocessor & Interfacing' },
  { code: 'CSE 238', name: 'Microprocessor & Interfacing Lab' },
  { code: 'MAT 235', name: 'Numerical Methods' },
  { code: 'CSE 221', name: 'Object Oriented Programming' },
  { code: 'CSE 222', name: 'Object Oriented Programming Lab' },
  { code: 'CSE 321', name: 'Operating System' },
  { code: 'CSE 322', name: 'Operating System Lab' },
  { code: 'PHY 111', name: 'Physics I' },
  { code: 'PHY 123', name: 'Physics II' },
  { code: 'PHY 0533 1101', name: 'Physics' },
  { code: 'GED 213', name: 'Principles of Economics & Entrepreneurship Development' },
  { code: 'CSE 300', name: 'Project' },
  { code: 'CSE 417', name: 'Software Engineering & Design Pattern' },
  { code: 'CSE 418', name: 'Software Engineering & Design Pattern Lab' },
  { code: 'CSE 0613 1203', name: 'Structured Programming' },
  { code: 'CSE 0613 1204', name: 'Structured Programming Lab' },
  { code: 'CSE 429', name: 'Technical Writing and Presentation' },
  { code: 'CSE 323', name: 'Web Programming Lab' },
]

const courseOptions = [...courseOptionsRaw].sort((a, b) => a.name.localeCompare(b.name))
const subjectOptions = Array.from(new Set(courseOptions.map((course) => course.name)))
filters.subjects = subjectOptions

const Question = () => {
  const { user } = useContext(AuthContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [questions, setQuestions] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtersState, setFiltersState] = useState({
    search: '',
    batch: 'All',
    section: 'All',
    semester: 'All',
    type: 'All',
    subject: 'All',
  })
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
  const [imageFiles, setImageFiles] = useState([])
  const isFinal = formData.examType === 'Final'
  const [reportMenuId, setReportMenuId] = useState('')
  const PAGE_SIZE = 10
  const normalizedBatch = (value) =>
    String(value || '')
      .toLowerCase()
      .replace(/^cse\s*/i, '')
      .trim()

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const pageRows = questions

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

  const fetchQuestionsWithToken = async (token) => {
    const queryParams = new URLSearchParams({
      status: 'Approved',
      page: String(page),
      limit: String(PAGE_SIZE),
    })
    if (filtersState.search.trim()) {
      queryParams.set('search', filtersState.search.trim())
    }
    if (filtersState.batch !== 'All') {
      queryParams.set('batch', normalizedBatch(filtersState.batch))
    }
    if (filtersState.section !== 'All') {
      queryParams.set('section', filtersState.section)
    }
    if (filtersState.semester !== 'All') {
      queryParams.set('semester', filtersState.semester)
    }
    if (filtersState.type !== 'All') {
      queryParams.set('type', filtersState.type)
    }
    if (filtersState.subject !== 'All') {
      queryParams.set('subject', filtersState.subject)
    }
    const response = await fetch(`${apiBaseUrl}/questions?${queryParams.toString()}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json().catch(() => null)
    return { response, data }
  }

  useEffect(() => {
    const batchParam = searchParams.get('batch')
    if (batchParam) {
      setFiltersState((prev) => ({
        ...prev,
        batch: `CSE ${batchParam}`,
      }))
    }
  }, [searchParams])

  useEffect(() => {
    setPage(1)
  }, [filtersState])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setError('')
        setLoading(true)
        const token = await getToken()
        if (!token) {
          setError('Unauthorized access.')
          return
        }

        let { response, data } = await fetchQuestionsWithToken(token)
        if (response.status === 401 && user?.email) {
          const refreshedToken = await ensureJwt(user.email)
          if (refreshedToken) {
            const retryResult = await fetchQuestionsWithToken(refreshedToken)
            response = retryResult.response
            data = retryResult.data
          }
        }

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('access-token')
            window.dispatchEvent(new Event('auth-token-updated'))
          }
          throw new Error(data?.message || 'Failed to load questions.')
        }

        if (data && Array.isArray(data.items)) {
          setQuestions(data.items)
          setTotalCount(data.total || 0)
        } else {
          setQuestions(Array.isArray(data) ? data : [])
          setTotalCount(Array.isArray(data) ? data.length : 0)
        }
      } catch (err) {
        setError(err?.message || 'Failed to load questions.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [user?.email, page, filtersState])

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
    const value = event.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'subject') {
      const selectedCourse = courseOptions.find((course) => course.name === value)
      if (selectedCourse) {
        setFormData((prev) => ({ ...prev, courseCode: selectedCourse.code }))
      }
    }
  }

  const handleFilterChange = (field) => (event) => {
    const value = event.target.value
    setFiltersState((prev) => ({ ...prev, [field]: value }))
    if (field === 'batch') {
      if (value === 'All') {
        setSearchParams((prevParams) => {
          const nextParams = new URLSearchParams(prevParams)
          nextParams.delete('batch')
          return nextParams
        })
      } else {
        const batchValue = normalizedBatch(value)
        setSearchParams((prevParams) => {
          const nextParams = new URLSearchParams(prevParams)
          nextParams.set('batch', batchValue)
          return nextParams
        })
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('access-token')
    if (!token) {
      setSubmitError('Unauthorized access.')
      toast.error('Unauthorized access.')
      return
    }

    try {
      setSubmitError('')
      setSubmitting(true)
      let questionImageUrl = ''
      let questionImageUrls = []

      if (imageFiles.length > 0) {
        const uploadedUrls = []
        for (const file of imageFiles) {
          const formPayload = new FormData()
          formPayload.append('image', file)
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
          if (uploadData?.url) {
            uploadedUrls.push(uploadData.url)
          }
        }
        questionImageUrls = uploadedUrls
        questionImageUrl = uploadedUrls[0] || ''
      }

      const selectedCourse = courseOptions.find((course) => course.name === formData.subject)
      const payload = {
        subjectName: formData.subject,
        courseCode: selectedCourse ? selectedCourse.code : formData.courseCode,
        batch: formData.batch,
        semester: formData.semester,
        type: formData.examType,
        section: formData.examType === 'CT' ? formData.section : '',
        facultyName: formData.examType === 'CT' ? formData.facultyName : '',
        questionImageUrl,
        questionImageUrls,
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

      toast.success('Question submitted for approval.')
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
      setImageFiles([])
    } catch (err) {
      setSubmitError(err?.message || 'Failed to submit question.')
      toast.error(err?.message || 'Failed to submit question.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReport = async (questionId) => {
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
        body: JSON.stringify({ targetType: 'question', targetId: questionId }),
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
              value={filtersState.search}
              onChange={handleFilterChange('search')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="text-xs font-semibold text-[#475569]">Batch</label>
            <select
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]"
              value={filtersState.batch}
              onChange={handleFilterChange('batch')}
            >
              <option>All</option>
              {filters.batches.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569]">Section</label>
            <select
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]"
              value={filtersState.section}
              onChange={handleFilterChange('section')}
            >
              <option>All</option>
              {filters.sections.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569]">Semester</label>
            <select
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]"
              value={filtersState.semester}
              onChange={handleFilterChange('semester')}
            >
              <option>All</option>
              {filters.semesters.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569]">Type</label>
            <select
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]"
              value={filtersState.type}
              onChange={handleFilterChange('type')}
            >
              <option>All</option>
              {filters.types.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569]">Subject</label>
            <select
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]"
              value={filtersState.subject}
              onChange={handleFilterChange('subject')}
            >
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
              <div key={row._id} className="px-4 py-4 transition hover:bg-[#F8FAFC]">
                <div className="flex items-start justify-between gap-3 sm:hidden">
                  <Link to={`/question/${row._id}`} className="flex-1">
                    <div className="text-sm font-semibold text-[#0F172A]">
                      {row.subjectName || '--'}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                      <span>{row.batch ? `CSE ${row.batch}` : 'CSE --'}</span>
                      <span>Sec {row.section || '--'}</span>
                      <span>{row.type || '--'}</span>
                    </div>
                  </Link>
                  <Link
                    to={`/question/${row._id}`}
                    className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                  >
                    Details
                  </Link>
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-lg border border-[#E5E7EB] px-2 py-1 text-xs font-semibold text-[#475569]"
                      onClick={() => setReportMenuId((prev) => (prev === row._id ? '' : row._id))}
                    >
                      ⋯
                    </button>
                    {reportMenuId === row._id ? (
                      <div className="absolute right-0 top-9 z-10 w-40 rounded-xl border border-[#E5E7EB] bg-white p-2 text-xs text-[#475569] shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left font-semibold text-[#DC2626] hover:bg-[#FEE2E2]"
                          onClick={() => {
                            setReportMenuId('')
                            handleReport(row._id)
                          }}
                        >
                          Report to admin
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <Link
                  to={`/question/${row._id}`}
                  className="hidden items-center gap-4 sm:flex"
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
                <div className="hidden sm:flex justify-end">
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-lg border border-[#E5E7EB] px-2 py-1 text-xs font-semibold text-[#475569]"
                      onClick={() => setReportMenuId((prev) => (prev === row._id ? '' : row._id))}
                    >
                      ⋯
                    </button>
                    {reportMenuId === row._id ? (
                      <div className="absolute right-0 top-9 z-10 w-40 rounded-xl border border-[#E5E7EB] bg-white p-2 text-xs text-[#475569] shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left font-semibold text-[#DC2626] hover:bg-[#FEE2E2]"
                          onClick={() => {
                            setReportMenuId('')
                            handleReport(row._id)
                          }}
                        >
                          Report to admin
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
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
                  <select
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                    value={formData.subject}
                    onChange={handleFieldChange('subject')}
                  >
                    <option value="">Select</option>
                    {courseOptions.map((course) => (
                      <option key={course.code} value={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:gap-4">
                  <label className="space-y-1 text-xs font-semibold text-[#475569] sm:space-y-2">
                    Course code
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                      value={formData.courseCode}
                      onChange={handleFieldChange('courseCode')}
                      readOnly
                    />
                  </label>
                  <label className="space-y-1 text-xs font-semibold text-[#475569] sm:space-y-2">
                    Batch
                    <select
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                      value={formData.batch}
                      onChange={handleFieldChange('batch')}
                    >
                      <option value="">Select</option>
                      {batchOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
                      <select
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-sm font-normal text-[#475569] sm:px-3 sm:py-2"
                        value={formData.section}
                        onChange={handleFieldChange('section')}
                      >
                        <option value="">Select</option>
                        {sectionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
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

              <div className="space-y-2">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-[#CBD5F5] bg-[#F8FAFF] px-3 py-2 text-xs text-[#475569] sm:px-4 sm:py-3 sm:text-sm">
                  <span className="text-xs sm:text-sm">
                    {imageFiles.length > 0
                      ? `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} selected`
                      : 'Upload images'}
                  </span>
                  <span className="rounded-full bg-[#E0E7FF] px-2.5 py-1 text-[10px] font-semibold text-[#1E3A8A] sm:px-3 sm:text-xs">
                    Browse
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(event) => {
                      const files = Array.from(event.target.files || [])
                      setImageFiles(files)
                    }}
                  />
                </label>
                {imageFiles.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#64748B]">
                    {imageFiles.map((file) => (
                      <span
                        key={`${file.name}-${file.lastModified}`}
                        className="rounded-full border border-[#E2E8F0] bg-white px-2 py-1"
                      >
                        {file.name}
                      </span>
                    ))}
                    <button
                      type="button"
                      className="rounded-full border border-[#E2E8F0] px-2 py-1 font-semibold text-[#1E3A8A]"
                      onClick={() => setImageFiles([])}
                    >
                      Clear
                    </button>
                  </div>
                ) : null}
              </div>

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
