function DashboardSection({ title, description }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">Dashboard</p>
      <h1 className="mt-2 text-2xl font-semibold text-[#0F172A]">{title}</h1>
      <p className="mt-2 text-sm text-[#64748B]">{description}</p>
    </div>
  )
}

export default DashboardSection
