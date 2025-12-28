import { Link } from 'react-router-dom'
import {
  HiOutlineBell,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSquares2X2,
  HiOutlineUser,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2'
import { HiOutlineDocumentText } from 'react-icons/hi'

const featureCards = [
  {
    title: 'Question Bank, Sorted',
    description: 'Batch-wise questions, organized by course so you can revise faster.',
    icon: HiOutlineDocumentText,
    tone: 'text-[#D97706]',
    halo: 'from-[#FDE68A] via-[#FEF3C7] to-[#FFFBEB]',
  },
  {
    title: 'Smart Tools',
    description: 'Cover page maker, CGPA calculator, and other time-saving utilities.',
    icon: HiOutlineWrenchScrewdriver,
    tone: 'text-[#0EA5E9]',
    halo: 'from-[#BAE6FD] via-[#E0F2FE] to-[#F0F9FF]',
  },
  {
    title: 'Notices & Updates',
    description: 'Stay synced with department notices and class announcements.',
    icon: HiOutlineBell,
    tone: 'text-[#10B981]',
    halo: 'from-[#BBF7D0] via-[#DCFCE7] to-[#F0FDF4]',
  },
  {
    title: 'Community Support',
    description: 'Discuss with classmates, share notes, and get feedback.',
    icon: HiOutlineChatBubbleLeftRight,
    tone: 'text-[#6366F1]',
    halo: 'from-[#C7D2FE] via-[#E0E7FF] to-[#EEF2FF]',
  },
]

const accessSteps = [
  'Click “Register” with your MetroCSE email and student ID.',
  'Complete your profile so we can verify your batch and section.',
  'After approval, log in to unlock the full dashboard and tools.',
]

function PublicLanding() {
  return (
    <main
      className="relative overflow-hidden"
      style={{
        '--landing-ink': '#0F172A',
        '--landing-primary': '#1E3A8A',
        '--landing-accent': '#F59E0B',
        '--landing-muted': '#64748B',
      }}
    >
      <div className="pointer-events-none absolute -top-20 right-[-180px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle_at_center,#FFE8B5,transparent_65%)] opacity-80 animate-pulse-soft" />
      <div className="pointer-events-none absolute left-[-140px] top-40 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle_at_center,#C7D2FE,transparent_60%)] opacity-70 animate-pulse-soft" />
      <div className="pointer-events-none absolute right-10 top-24 hidden h-16 w-16 rounded-full border border-[#E2E8F0] bg-white/70 shadow-[0_12px_30px_rgba(15,23,42,0.12)] lg:block animate-float">
        <div className="absolute left-3 top-3 h-2 w-2 rounded-full bg-[#F59E0B]" />
        <div className="absolute right-3 bottom-4 h-1.5 w-1.5 rounded-full bg-[#1E3A8A]" />
      </div>

      <section className="relative mx-auto w-full max-w-[1160px] px-4 pb-16 pt-6 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B] shadow-[0_10px_24px_rgba(15,23,42,0.08)] animate-fade-up"
              style={{ animationDelay: '0.05s' }}
            >
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              MetroCSE Hub
            </div>
            <h1
              className="text-3xl font-semibold leading-tight text-[color:var(--landing-ink)] sm:text-4xl lg:text-5xl animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              A focused campus hub for CSE students to learn, share, and stay in sync.
            </h1>
            <p
              className="max-w-xl text-base text-[color:var(--landing-muted)] sm:text-lg animate-fade-up"
              style={{ animationDelay: '0.16s' }}
            >
              This preview shows what MetroCSE Hub offers. Log in or register to unlock the
              full question bank, tools, notices, and dashboards.
            </p>
            <div className="flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '0.22s' }}>
              <Link
                to="/login"
                className="rounded-xl bg-[color:var(--landing-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(30,58,138,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(30,58,138,0.3)]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl border border-[#CBD5F5] bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--landing-primary)] shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5"
              >
                Register
              </Link>
            </div>
            <div className="grid gap-3 rounded-2xl border border-[#E2E8F0] bg-white/95 p-5 text-sm text-[color:var(--landing-muted)] shadow-[0_14px_30px_rgba(15,23,42,0.08)] animate-fade-up" style={{ animationDelay: '0.28s' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#1E3A8A]">
                  <HiOutlineUser className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[color:var(--landing-ink)]">
                    Student verification required
                  </p>
                  <p className="text-xs text-[color:var(--landing-muted)]">
                    Access is granted after your batch and section are confirmed.
                  </p>
                </div>
              </div>
              <div className="grid gap-1 text-xs">
                <span className="font-semibold text-[color:var(--landing-ink)]">Quick access steps</span>
                {accessSteps.map((step) => (
                  <div key={step} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 top-6 hidden h-full w-full rounded-3xl border border-[#E2E8F0] bg-white/40 backdrop-blur-sm lg:block" />
            <div className="relative space-y-4 rounded-3xl border border-[#E2E8F0] bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.15)] animate-fade-up animate-float" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
                    Overview
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[color:var(--landing-ink)]">
                    What you will unlock
                  </h2>
                </div>
                <span className="rounded-full bg-[#FDE68A] px-3 py-1 text-xs font-semibold text-[#92400E]">
                  Preview
                </span>
              </div>
              <div className="grid gap-4">
                {featureCards.map((card) => (
                  <div
                    key={card.title}
                    className="flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_12px_26px_rgba(15,23,42,0.08)]"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.halo}`}
                    >
                      <card.icon className={`h-6 w-6 ${card.tone}`} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--landing-ink)]">{card.title}</p>
                      <p className="mt-1 text-xs text-[color:var(--landing-muted)]">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center text-xs text-[color:var(--landing-muted)]">
                <div>
                  <p className="text-lg font-semibold text-[color:var(--landing-ink)]">4+</p>
                  <p>Core tools</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-[color:var(--landing-ink)]">60+</p>
                  <p>Batch archives</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-[color:var(--landing-ink)]">1 hub</p>
                  <p>Daily updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-[1160px] px-4 pb-20 sm:px-8">
        <div className="rounded-3xl border border-[#E2E8F0] bg-white/80 p-6 shadow-[0_24px_48px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
                Experience flow
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[color:var(--landing-ink)]">
                One login, every academic resource
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-[color:var(--landing-muted)]">
              <span className="flex items-center gap-1 rounded-full border border-[#E2E8F0] px-3 py-1.5">
                <HiOutlineSquares2X2 className="h-4 w-4" />
                Dashboard
              </span>
              <span className="flex items-center gap-1 rounded-full border border-[#E2E8F0] px-3 py-1.5">
                <HiOutlineDocumentText className="h-4 w-4" />
                Question Bank
              </span>
              <span className="flex items-center gap-1 rounded-full border border-[#E2E8F0] px-3 py-1.5">
                <HiOutlineWrenchScrewdriver className="h-4 w-4" />
                Tools
              </span>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFC] p-4">
              <p className="text-sm font-semibold text-[color:var(--landing-ink)]">Overview</p>
              <p className="mt-2 text-xs text-[color:var(--landing-muted)]">
                All important resources grouped into one clean portal with batch filters.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFC] p-4">
              <p className="text-sm font-semibold text-[color:var(--landing-ink)]">Feature access</p>
              <p className="mt-2 text-xs text-[color:var(--landing-muted)]">
                Tools, notices, and contribution history are unlocked after login.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFC] p-4">
              <p className="text-sm font-semibold text-[color:var(--landing-ink)]">Stay updated</p>
              <p className="mt-2 text-xs text-[color:var(--landing-muted)]">
                Announcements and updates appear in the dashboard once verified.
              </p>
            </div>
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#0F172A] text-white">
            <div className="flex w-[200%] animate-slide-loop items-center gap-6 px-6 py-4 text-sm font-semibold uppercase tracking-[0.35em]">
              {['MetroCSE Hub', 'Question Bank', 'Smart Tools', 'Notices', 'Community'].map((item) => (
                <span key={item} className="whitespace-nowrap text-[#F8FAFC]">
                  {item}
                </span>
              ))}
              {['MetroCSE Hub', 'Question Bank', 'Smart Tools', 'Notices', 'Community'].map((item) => (
                <span key={`${item}-dup`} className="whitespace-nowrap text-[#F8FAFC]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PublicLanding
