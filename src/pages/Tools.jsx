import ToolsGrid from '../components/ToolsGrid.jsx'

const tools = [
  {
    title: 'Cover Page Maker',
    description: 'Create professional cover letters easily',
    accent: 'tool-blue',
  },
  {
    title: 'CGPA Calculator',
    description: 'Calculate your CGPA instantly',
    accent: 'tool-amber',
  },
  {
    title: 'CV Templates',
    description: 'Browse editable CV templates',
    accent: 'tool-green',
  },
  {
    title: 'Notes & Resources',
    description: 'Access study materials uploaded by students',
    accent: 'tool-violet',
  },
  {
    title: 'GPA Calculator',
    description: 'Estimate your semester GPA quickly',
    accent: 'tool-amber',
  },
  {
    title: 'Course Planner',
    description: 'Plan credit load and semester targets',
    accent: 'tool-blue',
  },
]

function Tools() {
  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 pb-20 sm:px-8">
      <section className="pt-6 animate-fade-up" style={{ animationDelay: '0.12s' }}>
        <h1 className="text-2xl font-semibold text-[#1E3A8A] sm:text-3xl">Tools</h1>
        <p className="mt-2 text-sm text-[#475569]">
          Useful utilities to speed up your academic workflow.
        </p>
      </section>

      <section className="my-6 animate-fade-up" style={{ animationDelay: '0.18s' }}>
        <div className="flex items-center rounded-full border border-[#E5E7EB] bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)] sm:rounded-2xl sm:border sm:p-2">
          <input
            type="text"
            placeholder="Search tools"
            aria-label="Search tools"
            className="flex-1 bg-transparent px-5 py-2 text-base text-[#475569] outline-none placeholder:text-[#94A3B8]"
          />
          <button
            className="inline-flex items-center gap-2 rounded-full border-l border-[#E5E7EB] px-4 py-2 text-[#1E3A8A] sm:rounded-xl sm:border sm:bg-[#1E3A8A] sm:px-5 sm:py-2 sm:font-semibold sm:text-white"
            type="button"
            aria-label="Search tools"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </section>

      <section className="animate-fade-up" style={{ animationDelay: '0.24s' }}>
        <ToolsGrid tools={tools} />
      </section>
    </main>
  )
}

export default Tools
