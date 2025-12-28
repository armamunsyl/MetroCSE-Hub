import { useContext } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { HiHome, HiOutlineBell, HiOutlineSquares2X2, HiOutlineUser, HiOutlineWrenchScrewdriver } from 'react-icons/hi2'
import { HiOutlineDocumentText } from 'react-icons/hi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AuthContext } from '../Provider/AuthProvider.jsx'
import useUserProfile from '../hooks/useUserProfile.js'

const Layout = () => {
  const { pathname } = useLocation()
  const { user, loading } = useContext(AuthContext)
  const { profile, loading: profileLoading } = useUserProfile()
  const isPending = String(profile?.status || '').toLowerCase() === 'pending'
  const isPendingPage = pathname === '/pending'
  const usePendingPadding = isPendingPage || isPending
  const topPadding = usePendingPadding ? 'pt-12 sm:pt-16 md:pt-20' : 'pt-16 sm:pt-24 md:pt-32'

  if (loading || (user && profileLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAFC]">
        <span className="loading loading-spinner text-[#3BB273] h-12 w-12"></span>
      </div>
    )
  }

  return (
    <div className={`relative min-h-screen bg-white pb-24 text-[#0f172a] sm:pb-0 ${topPadding}`}>
      <Navbar />
      <Outlet />
      <Footer />
      {user && !profileLoading && !isPending ? (
        <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#E5E7EB] bg-white/90 text-[#1E3A8A] backdrop-blur-lg shadow-[0_-8px_16px_rgba(0,0,0,0.08)] sm:hidden">
          <div className="mx-auto grid max-w-[640px] grid-cols-6 px-4 py-3">
            {[
              { label: 'Home', icon: HiHome, to: '/' },
              { label: 'Tools', icon: HiOutlineWrenchScrewdriver, to: '/tools' },
              { label: 'Question', icon: HiOutlineDocumentText, to: '/question' },
              { label: 'Notice', icon: HiOutlineBell, to: '/notice' },
              { label: 'Dashboard', icon: HiOutlineSquares2X2, to: '/dashboard' },
              { label: 'Profile', icon: HiOutlineUser, to: '/profile' },
            ].map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex flex-col items-center justify-center transition',
                    isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100',
                  ].join(' ')
                }
                aria-label={item.label}
              >
                {({ isActive }) => (
                  <span
                    className={[
                      'grid h-10 w-10 place-items-center rounded-xl transition',
                      isActive ? 'bg-[#2B4CB3] text-white' : 'bg-white text-[#1E3A8A]',
                    ].join(' ')}
                  >
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </div>
  )
}

export default Layout
