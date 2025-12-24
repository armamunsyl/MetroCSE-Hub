import DashboardSection from './DashboardSection.jsx'

function DashboardOverview() {
  return (
    <div className="space-y-6">
      <DashboardSection
        title="Welcome back!"
        description="Track your contributions, notices, and approvals from one place."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Total Contributions', value: '12', tone: 'bg-[#E0F2FE] text-[#0369A1]' },
          { label: 'Pending Requests', value: '3', tone: 'bg-[#FEF3C7] text-[#B45309]' },
          { label: 'New Notices', value: '5', tone: 'bg-[#EDE9FE] text-[#6D28D9]' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold text-[#64748B]">{stat.label}</p>
            <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-lg font-semibold ${stat.tone}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
        <h2 className="text-sm font-semibold text-[#1E3A8A]">Recent Activity</h2>
        <ul className="mt-3 space-y-2 text-sm text-[#475569]">
          <li>Contribution submitted for CSE 220.</li>
          <li>Notice posted for upcoming quiz.</li>
          <li>Feedback received from admin.</li>
        </ul>
      </div>
    </div>
  )
}

export default DashboardOverview
