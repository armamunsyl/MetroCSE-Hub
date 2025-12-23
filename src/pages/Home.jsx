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
      <SearchBar />

      <section className="mb-12 animate-fade-up" style={{ animationDelay: '0.26s' }}>
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-[#1f2a63]">Question Bank</h2>
          <p className="mt-2 text-sm text-[#5661a4]">
            Browse batch-wise to find class tests and finals faster.
          </p>
        </div>
        <BatchGrid batches={batches} />
      </section>

      <section className="animate-fade-up" style={{ animationDelay: '0.32s' }}>
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-[#1f2a63]">Quick Tools</h2>
          <p className="mt-2 text-sm text-[#5661a4]">
            Helpful academic utilities for your semester workflow.
          </p>
        </div>
        <ToolsGrid tools={tools} />
      </section>
    </main>
  )
}

export default Home
