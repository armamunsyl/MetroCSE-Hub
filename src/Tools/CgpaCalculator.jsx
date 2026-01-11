import { useMemo, useState } from 'react'

const gradingScale = [
  { letter: 'A+', point: 4.0, range: '80-100' },
  { letter: 'A', point: 3.75, range: '75-<80' },
  { letter: 'A-', point: 3.5, range: '70-<75' },
  { letter: 'B+', point: 3.25, range: '65-<70' },
  { letter: 'B', point: 3.0, range: '60-<65' },
  { letter: 'B-', point: 2.75, range: '55-<60' },
  { letter: 'C+', point: 2.5, range: '50-<55' },
  { letter: 'C', point: 2.25, range: '45-<50' },
  { letter: 'D', point: 2.0, range: '40-<45' },
  { letter: 'F', point: 0.0, range: 'Below 40' },
]

const createRow = () => ({
  id: crypto.randomUUID(),
  course: '',
  credit: '',
  grade: '',
})

const gradePointMap = gradingScale.reduce((acc, grade) => {
  acc[grade.letter] = grade.point
  return acc
}, {})

const CgpaCalculator = () => {
  const [rows, setRows] = useState([createRow(), createRow(), createRow()])

  const totals = useMemo(() => {
    let totalCredits = 0
    let totalPoints = 0

    rows.forEach((row) => {
      const credit = Number(row.credit)
      if (!credit || Number.isNaN(credit)) return
      const point = gradePointMap[row.grade]
      if (point === undefined) return

      totalCredits += credit
      totalPoints += credit * point
    })

    return {
      totalCredits,
      totalPoints,
      cgpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
    }
  }, [rows])

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  const addRow = () => {
    setRows((prev) => [...prev, createRow()])
  }

  const removeRow = (id) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev))
  }

  const resetRows = () => {
    setRows([createRow(), createRow(), createRow()])
  }

  return (
    <main className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-6 sm:px-6">
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A] sm:text-3xl">CGPA Calculator</h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Enter course grades and credit hours to calculate your CGPA.
            </p>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase text-[#94A3B8]">Current CGPA</p>
            <p className="mt-1 text-2xl font-semibold text-[#1E3A8A]">{totals.cgpa.toFixed(2)}</p>
            <p className="text-xs text-[#64748B]">Total credits: {totals.totalCredits || 0}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#E5E7EB]">
          <div className="grid grid-cols-[1.2fr_0.6fr_0.6fr_0.5fr_0.3fr] gap-2 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            <span>Course</span>
            <span>Credits</span>
            <span>Grade</span>
            <span>Points</span>
            <span></span>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {rows.map((row) => {
              const point = gradePointMap[row.grade]
              return (
                <div
                  key={row.id}
                  className="grid grid-cols-[1.2fr_0.6fr_0.6fr_0.5fr_0.3fr] items-center gap-2 px-4 py-3 text-sm text-[#334155]"
                >
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm text-[#334155] outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
                    placeholder="Course name (optional)"
                    value={row.course}
                    onChange={(event) => updateRow(row.id, 'course', event.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm text-[#334155] outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
                    placeholder="3"
                    value={row.credit}
                    onChange={(event) => updateRow(row.id, 'credit', event.target.value)}
                  />
                  <select
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#334155] outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
                    value={row.grade}
                    onChange={(event) => updateRow(row.id, 'grade', event.target.value)}
                  >
                    <option value="">Select</option>
                    {gradingScale.map((grade) => (
                      <option key={grade.letter} value={grade.letter}>
                        {grade.letter}
                      </option>
                    ))}
                  </select>
                  <div className="text-sm font-semibold text-[#1E3A8A]">
                    {point !== undefined ? point.toFixed(2) : '--'}
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-[#E2E8F0] px-2 py-1 text-xs font-semibold text-[#64748B] transition hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-50"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length === 1}
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95"
            onClick={addRow}
          >
            Add course
          </button>
          <button
            type="button"
            className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
            onClick={resetRows}
          >
            Reset
          </button>
          <div className="ml-auto text-sm text-[#64748B]">
            Formula: CGPA = Σ(credit × grade point) ÷ Σ(credit)
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
          <h2 className="text-lg font-semibold text-[#0F172A]">Grading Scale &amp; Points</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#475569]">
            {gradingScale.map((grade) => (
              <li key={grade.letter} className="flex items-center justify-between">
                <span className="font-semibold text-[#0F172A]">{grade.letter}</span>
                <span>
                  {grade.range} ({grade.point.toFixed(2)} points)
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
          <h2 className="text-lg font-semibold text-[#0F172A]">CGPA Calculation</h2>
          <ol className="mt-4 space-y-3 text-sm text-[#475569]">
            <li>
              <span className="font-semibold text-[#0F172A]">Grade Points:</span> Multiply the grade point for each
              course by its credit hours.
            </li>
            <li>
              <span className="font-semibold text-[#0F172A]">Sum:</span> Add these products for all courses in a
              semester.
            </li>
            <li>
              <span className="font-semibold text-[#0F172A]">Divide:</span> Divide that sum by the total credit hours
              attempted.
            </li>
            <li>
              <span className="font-semibold text-[#0F172A]">CGPA:</span> Repeat semester-by-semester to get your
              cumulative GPA.
            </li>
          </ol>
        </div>
      </section>
    </main>
  )
}

export default CgpaCalculator
