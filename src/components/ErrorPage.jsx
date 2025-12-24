import { Link } from 'react-router-dom'

function ErrorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#EEF2FF] via-[#F8FAFF] to-[#E2E8FF] px-6 py-16">
      <div className="mx-auto w-full max-w-[720px] text-center">
        <div className="relative mx-auto mb-10 grid h-44 w-44 place-items-center rounded-[36px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
          <div className="absolute -right-4 -top-4 h-10 w-10 rounded-full bg-[#1E3A8A]/15" />
          <div className="absolute -bottom-5 left-6 h-12 w-12 rounded-full bg-[#DC2626]/15" />
          <svg viewBox="0 0 120 120" className="h-24 w-24 text-[#1E3A8A]" aria-hidden="true">
            <path
              d="M26 72l28-24 24 20 16-20"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="26" cy="72" r="6" fill="currentColor" />
            <circle cx="54" cy="48" r="6" fill="currentColor" />
            <circle cx="78" cy="68" r="6" fill="currentColor" />
            <circle cx="94" cy="48" r="6" fill="currentColor" />
          </svg>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#1E3A8A]">
          MetroCSE Hub
        </p>
        <h1 className="mt-3 text-5xl font-semibold text-[#0F172A] sm:text-6xl">404</h1>
        <p className="mt-2 text-lg font-semibold text-[#1E3A8A]">Page not found</p>
        <p className="mx-auto mt-4 max-w-[520px] text-sm text-[#64748B] sm:text-base">
          The link may be broken or the page has moved. Try heading back home or explore the latest
          tools and question bank.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-[#1E3A8A] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(30,58,138,0.3)] transition hover:brightness-95"
          >
            Back to Home
          </Link>
          <Link
            to="/question"
            className="rounded-full border border-[#1E3A8A]/20 bg-white px-6 py-2.5 text-sm font-semibold text-[#1E3A8A] shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition hover:border-[#1E3A8A]"
          >
            Browse Questions
          </Link>
        </div>
      </div>
    </main>
  )
}

export default ErrorPage
