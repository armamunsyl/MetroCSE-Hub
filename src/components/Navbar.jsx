import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="fixed left-0 right-0 top-0 z-20 border-b border-[rgba(210,220,255,0.6)] bg-[rgba(245,247,255,0.72)] backdrop-blur-lg animate-fade-up"
      style={{ animationDelay: '0.05s' }}
    >
      <div className="mx-auto flex max-w-[1160px] items-center justify-between px-3 py-2 sm:px-8 sm:py-3">
        <div>
          <div className="text-lg font-semibold text-[#22306b]">MetroCSE Hub</div>
          <div className="mt-1 hidden text-sm text-[#4a5691] md:block">
            CSE Department, Metropolitan University
          </div>
        </div>

        <nav className="hidden items-center gap-4 text-sm font-semibold text-[#2a3167] md:flex">
          <a href="#" className="whitespace-nowrap transition-colors hover:text-[#3754c9]">
            Question Bank
          </a>
          <a href="#" className="whitespace-nowrap transition-colors hover:text-[#3754c9]">
            Tools
          </a>
          <button
            className="rounded-xl bg-gradient-to-r from-[#5b8dff] to-[#7a4bff] px-5 py-2.5 text-white shadow-[0_10px_20px_rgba(90,99,216,0.18)]"
            type="button"
          >
            Login
          </button>
        </nav>

        <button
          className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(167,183,255,0.6)] bg-white/70 text-[#2a3167] shadow-[0_8px_18px_rgba(66,83,171,0.15)] transition hover:text-[#3754c9] md:hidden"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="relative flex h-5 w-5 flex-col items-center justify-between">
            <span className="h-0.5 w-full rounded-full bg-current transition group-hover:w-4" />
            <span className="h-0.5 w-full rounded-full bg-current" />
            <span className="h-0.5 w-3/4 self-end rounded-full bg-current transition group-hover:w-full" />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[rgba(210,220,255,0.6)] bg-white/90 px-6 pb-6 pt-4 text-sm font-semibold text-[#2a3167] shadow-[0_18px_30px_rgba(36,44,98,0.12)] md:hidden">
          <div className="grid gap-3">
            <a href="#" className="rounded-xl px-3 py-2 transition hover:bg-[#eef2ff]">
              Question Bank
            </a>
            <a href="#" className="rounded-xl px-3 py-2 transition hover:bg-[#eef2ff]">
              Tools
            </a>
            <button
              className="rounded-xl bg-gradient-to-r from-[#5b8dff] to-[#7a4bff] px-5 py-2.5 text-left text-white shadow-[0_10px_20px_rgba(90,99,216,0.18)]"
              type="button"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
