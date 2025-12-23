const batches = [
  { id: 26, questions: 156 },
  { id: 25, questions: 142 },
  { id: 24, questions: 137 },
  { id: 23, questions: 145 },
  { id: 22, questions: 120 },
  { id: 21, questions: 129 },
  { id: 20, questions: 133 },
  { id: 19, questions: 111 },
  { id: 18, questions: 118 },
  { id: 17, questions: 104 },
  { id: 16, questions: 98 },
  { id: 15, questions: 92 },
]

const AllBatch = () => {
  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 pb-20 sm:px-8">
      <section className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0F172A] sm:text-3xl">
          All Batches
        </h1>
        <p className="mt-2 text-sm text-[#475569]">
          Browse every batch and jump directly to their question sets.
        </p>
      </section>

      <section className="mb-8 grid gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_8px_16px_rgba(0,0,0,0.06)] sm:grid-cols-4">
        <div className="sm:col-span-2">
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
              placeholder="Search by batch or course code"
              className="w-full bg-transparent text-sm text-[#475569] outline-none placeholder:text-[#94A3B8]"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-[#475569]">Filter</label>
          <select className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]">
            <option>All Batches</option>
            <option>Batch 26-23</option>
            <option>Batch 22-19</option>
            <option>Batch 18-15</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-[#475569]">Sort</label>
          <select className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Most Questions</option>
          </select>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {batches.map((batch) => (
          <button
            key={batch.id}
            type="button"
            className="relative rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition hover:border-[#1E3A8A] hover:shadow-[0_12px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#E5E7EB] text-[#1E3A8A]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M7 4h7l3 3v13H7z" />
                  <path d="M14 4v4h4" />
                  <path d="M9 12h6" />
                  <path d="M9 16h6" />
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[#0F172A] sm:text-sm">
                  Batch {batch.id}
                </div>
                <div className="mt-1 text-[11px] text-[#475569] sm:text-xs">
                  {batch.questions} Questions
                </div>
              </div>
            </div>
          </button>
        ))}
      </section>
    </main>
  )
}

export default AllBatch
