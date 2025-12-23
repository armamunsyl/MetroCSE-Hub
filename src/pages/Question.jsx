import { useState } from 'react'

const filters = {
  batches: ['CSE 57', 'CSE 578', 'CSE 59', 'CSE 57', 'CSE 60', 'CSE 61', 'CSE 62', 'CSE 63', 'CSE 64'],
  sections: ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F', 'Sec G', 'Sec H'],
  semesters: ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '3.1', '3.2', '3.3', '4.1', '4.2', '4.3'],
  types: ['Final', 'CT'],
  subjects: ['AD&A', 'Data Structure', 'Structured Programming', 'DLD', 'BEE 1', 'BEE 2'],
}

const questions = Array.from({ length: 20 }).map((_, index) => ({
  id: index + 1,
  code: filters.batches[index % filters.batches.length],
  subject: filters.subjects[index % filters.subjects.length],
  type: filters.types[index % filters.types.length],
  section: filters.sections[index % filters.sections.length],
  semester: filters.semesters[index % filters.semesters.length],
  year: 2024 - (index % 3),
}))

const PAGE_SIZE = 10

const Question = () => {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(questions.length / PAGE_SIZE)
  const startIndex = (page - 1) * PAGE_SIZE
  const pageRows = questions.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 pb-20 sm:px-8">
      <section className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0F172A] sm:text-3xl">Questions</h1>
        <p className="mt-2 text-sm text-[#475569]">
          Recent 10 questions with filters for batch, section, semester, type, and subject.
        </p>
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

      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_16px_rgba(0,0,0,0.06)]">
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[720px] text-left text-sm text-[#475569]">
            <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#475569]">
              <tr>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Batch</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Subject</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Type</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Section</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Semester</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Year</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} className="border-t border-[#E5E7EB]">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">{row.code}</td>
                  <td className="px-4 py-3">{row.subject}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">{row.section}</td>
                  <td className="px-4 py-3">{row.semester}</td>
                  <td className="px-4 py-3">{row.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="hidden items-center justify-between px-4 py-3 text-xs text-[#475569] sm:flex">
          <button
            type="button"
            className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-[#1E3A8A] disabled:opacity-50"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
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
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>

        <div className="sm:hidden">
          <div className="bg-[#F8FAFC] px-4 py-3 text-xs font-semibold text-[#475569]">Recent Questions</div>
          <div className="divide-y divide-[#E5E7EB]">
            {pageRows.map((row) => (
              <div key={row.id} className="flex items-center gap-3 px-4 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#E5E7EB] text-[#1E3A8A]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 7h6l2 2h8v8H4z" />
                    <path d="M4 7V5a1 1 0 0 1 1-1h4l2 2" />
                  </svg>
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#0F172A]">{row.code}</div>
                  <div className="text-xs text-[#475569]">{row.subject}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-3 text-xs text-[#475569]">
            <button
              type="button"
              className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-[#1E3A8A] disabled:opacity-50"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
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
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Question
