const notices = [
  {
    id: 1,
    title: 'Midterm schedule updated',
    name: 'Sakib Ahmed',
    role: 'Student',
    batch: 'CSE 61',
  },
  {
    id: 2,
    title: 'Lab submission deadline',
    name: 'Mariam Khan',
    role: 'Student',
    batch: 'CSE 60',
  },
  {
    id: 3,
    title: 'New notes uploaded',
    name: 'Nayeem Rahman',
    role: 'Student',
    batch: 'CSE 59',
  },
  {
    id: 4,
    title: 'Project group list posted',
    name: 'Tahsin Islam',
    role: 'Student',
    batch: 'CSE 58',
  },
  {
    id: 5,
    title: 'Makeup class announcement',
    name: 'Nusrat Jahan',
    role: 'Student',
    batch: 'CSE 57',
  },
  {
    id: 6,
    title: 'Feedback form open',
    name: 'Rafi Hasan',
    role: 'Student',
    batch: 'CSE 61',
  },
]

function Notice() {
  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 pb-20 sm:px-8">
      <section className="pt-6 animate-fade-up" style={{ animationDelay: '0.12s' }}>
        <h2 className="text-2xl font-semibold text-[#1E3A8A] sm:text-3xl">Notice and Feedback</h2>
        <p className="mt-2 text-sm text-[#475569]">
          Latest updates and feedback from students.
        </p>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
        <div className="divide-y divide-[#E5E7EB]">
          {notices.map((notice) => (
            <div key={notice.id} className="flex items-center gap-4 px-4 py-4">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-[#E5E7EB] text-[#1E3A8A]">
                <span className="text-sm font-semibold">
                  {notice.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#0F172A] sm:text-base">{notice.title}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                  <span>{notice.name}</span>
                  <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#1E3A8A]">
                    {notice.role}
                  </span>
                  <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold text-[#475569]">
                    {notice.batch}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Notice
