import { Link } from 'react-router-dom'
function BatchGrid({ batches }) {
  const mobileBatches = batches.slice(0, 6)

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        {mobileBatches.map((batch) => (
          <Link
            key={batch.id}
            to={`/question?batch=${batch.id}`}
            className="relative flex flex-col items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-4 text-center shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:border-[#1E3A8A] hover:shadow-[0_12px_20px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:gap-4 sm:p-4 sm:text-left"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-white sm:h-11 sm:w-11">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <rect x="8" y="6" width="28" height="36" rx="6" fill="#FFFFFF" />
                <rect x="12" y="14" width="20" height="4" rx="2" fill="#1E3A8A" />
                <rect x="12" y="22" width="16" height="4" rx="2" fill="#1E3A8A" />
                <rect x="12" y="30" width="12" height="4" rx="2" fill="#1E3A8A" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-[#0F172A]">Batch {batch.id}</div>
              <div className="mt-1 text-xs text-[#475569] sm:text-sm">
                {batch.questions} Questions
              </div>
            </div>
            <span className="absolute right-3 top-3 rounded-lg bg-[#1E3A8A] px-2 py-1 text-xs font-semibold text-white">
              {batch.id}
            </span>
          </Link>
        ))}
        {batches.slice(6).map((batch) => (
          <Link
            key={batch.id}
            to={`/question?batch=${batch.id}`}
            className="relative hidden flex-col items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-4 text-center shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:border-[#1E3A8A] hover:shadow-[0_12px_20px_rgba(0,0,0,0.08)] sm:flex sm:flex-row sm:items-center sm:gap-4 sm:p-4 sm:text-left"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-white sm:h-11 sm:w-11">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <rect x="8" y="6" width="28" height="36" rx="6" fill="#FFFFFF" />
                <rect x="12" y="14" width="20" height="4" rx="2" fill="#1E3A8A" />
                <rect x="12" y="22" width="16" height="4" rx="2" fill="#1E3A8A" />
                <rect x="12" y="30" width="12" height="4" rx="2" fill="#1E3A8A" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-[#0F172A]">Batch {batch.id}</div>
              <div className="mt-1 text-xs text-[#475569] sm:text-sm">
                {batch.questions} Questions
              </div>
            </div>
            <span className="absolute right-3 top-3 rounded-lg bg-[#1E3A8A] px-2 py-1 text-xs font-semibold text-white">
              {batch.id}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-4 flex justify-center sm:hidden">
        <Link to={"/all-batch"}>
          <button
            type="button"
            className="rounded-full border border-[#1E3A8A] bg-white px-6 py-2 text-sm font-semibold text-[#1E3A8A] shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
          >
            See More
          </button>
        </Link>
      </div>
    </div>
  )
}

export default BatchGrid
