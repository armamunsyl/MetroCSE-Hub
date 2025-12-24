import { HiOutlineCog6Tooth } from 'react-icons/hi2'

const profile = {
  name: 'Sakib Ahmed',
  email: 'sakib.ahmed@student.metrouni.edu',
  batch: 'Batch 25',
  section: 'A',
  studentId: '2310312010',
  contributionScore: 120,
}

function Profile() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F1FF] via-[#F7F6FF] to-[#F2F7FF] px-4 pb-16 pt-8 sm:-mt-6 md:-mt-12">
      <div className="mx-auto w-full max-w-[440px]">
        <section className="rounded-[28px] bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur">
          <header className="flex items-center justify-between text-[#1E3A8A]">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#1E3A8A] shadow-[0_6px_14px_rgba(15,23,42,0.12)]"
              aria-label="Go back"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M15.75 19L8.75 12L15.75 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">Profile</h1>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#1E3A8A] shadow-[0_6px_14px_rgba(15,23,42,0.12)]"
              aria-label="Settings"
            >
              <HiOutlineCog6Tooth className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E2E8FF] p-1">
              <div className="h-full w-full overflow-hidden rounded-full border-[3px] border-white">
                <img
                  src="/profile-avatar.jpg"
                  alt={profile.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <span className="mt-3 rounded-full bg-[#2B4CB3] px-4 py-1 text-xs font-semibold text-white shadow-[0_6px_12px_rgba(43,76,179,0.3)]">
              Student
            </span>
            <h2 className="mt-4 text-xl font-semibold text-[#1E293B]">{profile.name}</h2>
            <p className="mt-1 text-sm text-[#64748B]">{profile.email}</p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white/70">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 text-sm">
              <span className="text-[#64748B]">Batch:</span>
              <span className="font-semibold text-[#1E293B]">{profile.batch}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 text-sm">
              <span className="text-[#64748B]">Section:</span>
              <span className="font-semibold text-[#1E293B]">{profile.section}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 text-sm">
              <span className="text-[#64748B]">ID:</span>
              <span className="font-semibold text-[#1E293B]">{profile.studentId}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-[#64748B]">Contribution Score:</span>
              <span className="rounded-full bg-[#EF4444] px-4 py-1 text-xs font-semibold text-white">
                {profile.contributionScore}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Profile
