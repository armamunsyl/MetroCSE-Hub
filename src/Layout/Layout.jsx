import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Layout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f5f7ff] via-[#fdfcff] to-[#f5f2ff] pb-24 text-[#1d2457] pt-16 sm:pb-0 sm:pt-24 md:pt-32">
      <div className="pointer-events-none absolute -top-44 -left-28 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#cfe1ff,transparent_60%)] opacity-70" />
      <div className="pointer-events-none absolute -bottom-60 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_60%_60%,#e3d6ff,transparent_60%)] opacity-70" />
      <Navbar />
      <Outlet />
      <Footer />
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/50 bg-white/45 text-[#1d2457] backdrop-blur-lg shadow-[0_-12px_24px_rgba(36,44,98,0.12)] sm:hidden">
        <div className="mx-auto grid max-w-[640px] grid-cols-6 px-4 py-3">
          {[
            { label: 'Home', src: '/home.png' },
            { label: 'Tools', src: '/tools.png' },
            { label: 'Question', src: '/question.png' },
            { label: 'Notice', src: '/notice.png' },
            { label: 'Dashboard', src: '/dashboard.png' },
            { label: 'Profile', src: '/profile.png' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex flex-col items-center justify-center text-[#4a5691] transition hover:text-[#1f2a63]"
              aria-label={item.label}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#7a88ff]">
                <img
                  src={item.src}
                  alt={item.label}
                  className="h-6 w-6 drop-shadow-[0_8px_16px_rgba(60,84,190,0.5)]"
                  loading="lazy"
                />
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Layout
