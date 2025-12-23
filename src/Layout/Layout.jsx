import { Outlet } from 'react-router-dom'
import { HiHome, HiOutlineBell, HiOutlineSquares2X2, HiOutlineUser, HiOutlineWrenchScrewdriver } from 'react-icons/hi2'
import { HiOutlineDocumentText } from 'react-icons/hi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Layout = () => {
  return (
    <div className="relative min-h-screen bg-white pb-24 text-[#0f172a] pt-16 sm:pb-0 sm:pt-24 md:pt-32">
      <Navbar />
      <Outlet />
      <Footer />
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#E5E7EB] bg-white/90 text-[#1E3A8A] backdrop-blur-lg shadow-[0_-8px_16px_rgba(0,0,0,0.08)] sm:hidden">
        <div className="mx-auto grid max-w-[640px] grid-cols-6 px-4 py-3">
          {[
            { label: 'Home', icon: HiHome },
            { label: 'Tools', icon: HiOutlineWrenchScrewdriver },
            { label: 'Question', icon: HiOutlineDocumentText },
            { label: 'Notice', icon: HiOutlineBell },
            { label: 'Dashboard', icon: HiOutlineSquares2X2 },
            { label: 'Profile', icon: HiOutlineUser },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex flex-col items-center justify-center text-[#1E3A8A] transition hover:text-[#1E3A8A]"
              aria-label={item.label}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Layout
