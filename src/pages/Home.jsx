import Hero from '../components/Hero.jsx'
import SearchBar from '../components/SearchBar.jsx'
import BatchGrid from '../components/BatchGrid.jsx'
import ToolsGrid from '../components/ToolsGrid.jsx'

const batches = [
  { id: 64, questions: 156 },
  { id: 63, questions: 142 },
  { id: 62, questions: 137 },
  { id: 61, questions: 145 },
  { id: 60, questions: 120 },
  { id: 59, questions: 129 },
  { id: 58, questions: 133 },
  { id: 57, questions: 111 },
]

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
]

function Home() {
  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 pb-20 sm:px-8">
      <Hero />
      <div className="mb-5 mt-5">
        <h2 className="text-2xl font-semibold text-[#1E3A8A]">Quick Tools</h2>
        <p className="hidden md:block mt-2 text-sm text-[#475569]">
          Helpful academic utilities for your semester workflow.
        </p>
      </div>
      <ToolsGrid tools={tools} />
      <SearchBar />

      <section className="mb-12 animate-fade-up" style={{ animationDelay: '0.26s' }}>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-[#1E3A8A]">Question Bank</h2>
            <p className="mt-2 text-sm text-[#475569]">
              Browse batch-wise to find class tests and finals faster.
            </p>
          </div>
          <a
            href="/question"
            className="hidden md:block rounded-xl border border-[#1E3A8A] px-4 py-2 text-sm font-semibold text-[#1E3A8A] shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition hover:bg-[#1E3A8A] hover:text-white"
          >
            View More
          </a>
        </div>
        <BatchGrid batches={batches} />
      </section>

    </main>
  )
}

export default Home
