import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="fixed left-0 right-0 top-0 z-20 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-lg animate-fade-up"
      style={{ animationDelay: '0.05s' }}
    >
      <div className="mx-auto flex max-w-[1160px] items-center justify-between px-3 py-2 sm:px-8 sm:py-3">
        <div>
          <Link to="/">
            <div className="text-lg font-semibold text-[#1E3A8A]">MetroCSE Hub</div>
          </Link>
          <div className="mt-1 hidden text-sm text-[#475569] md:block">
            CSE Department, Metropolitan University
          </div>
        </div>

        <nav className="hidden items-center gap-4 text-sm font-semibold text-[#475569] md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                'whitespace-nowrap rounded-full px-3 py-1.5 transition-colors hover:text-[#1E3A8A]',
                isActive ? 'bg-[#E0E7FF] text-[#1E3A8A]' : '',
              ].join(' ')
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/tools"
            className={({ isActive }) =>
              [
                'whitespace-nowrap rounded-full px-3 py-1.5 transition-colors hover:text-[#1E3A8A]',
                isActive ? 'bg-[#E0E7FF] text-[#1E3A8A]' : '',
              ].join(' ')
            }
          >
            Tools
          </NavLink>
          <NavLink
            to="/question"
            className={({ isActive }) =>
              [
                'whitespace-nowrap rounded-full px-3 py-1.5 transition-colors hover:text-[#1E3A8A]',
                isActive ? 'bg-[#E0E7FF] text-[#1E3A8A]' : '',
              ].join(' ')
            }
          >
            Question Bank
          </NavLink>
          <NavLink
            to="/notice"
            className={({ isActive }) =>
              [
                'whitespace-nowrap rounded-full px-3 py-1.5 transition-colors hover:text-[#1E3A8A]',
                isActive ? 'bg-[#E0E7FF] text-[#1E3A8A]' : '',
              ].join(' ')
            }
          >
            Notice
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              [
                'whitespace-nowrap rounded-full px-3 py-1.5 transition-colors hover:text-[#1E3A8A]',
                isActive ? 'bg-[#E0E7FF] text-[#1E3A8A]' : '',
              ].join(' ')
            }
          >
            Dashboard
          </NavLink>
          <Link to={"/login"} >
            <button
              className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-left text-white shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:brightness-90"
              type="button"
            >
              Login
            </button>
          </Link>
        </nav>

        <button
          className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#1E3A8A] shadow-[0_6px_12px_rgba(0,0,0,0.08)] transition hover:text-[#1E3A8A] md:hidden"
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
        <div className="border-t border-[#E5E7EB] bg-white px-6 pb-6 pt-4 text-sm font-semibold text-[#475569] shadow-[0_12px_24px_rgba(0,0,0,0.08)] md:hidden">
          <div className="grid gap-3">
            <NavLink
              to="/question"
              className={({ isActive }) =>
                [
                  'rounded-xl px-3 py-2 transition hover:text-[#1E3A8A]',
                  isActive ? 'bg-[#E0E7FF] text-[#1E3A8A]' : '',
                ].join(' ')
              }
            >
              Question Bank
            </NavLink>
            <NavLink
              to="/tools"
              className={({ isActive }) =>
                [
                  'rounded-xl px-3 py-2 transition hover:text-[#1E3A8A]',
                  isActive ? 'bg-[#E0E7FF] text-[#1E3A8A]' : '',
                ].join(' ')
              }
            >
              Tools
            </NavLink>
            <Link to={"/login"} >
              <button
                className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-left text-white shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:brightness-90"
                type="button"
              >
                Login
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
