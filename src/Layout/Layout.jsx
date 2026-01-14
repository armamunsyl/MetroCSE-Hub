import { useContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { HiHome, HiOutlineBell, HiOutlineSquares2X2, HiOutlineUser, HiOutlineWrenchScrewdriver } from 'react-icons/hi2'
import { HiOutlineDocumentText } from 'react-icons/hi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AuthContext } from '../Provider/AuthProvider.jsx'
import useUserProfile from '../hooks/useUserProfile.js'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

const Layout = () => {
  const { pathname } = useLocation()
  const { user, loading } = useContext(AuthContext)
  const { profile, loading: profileLoading } = useUserProfile()
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [unreadByType, setUnreadByType] = useState({})
  const isAuthRoute = pathname === '/login' || pathname === '/register'
  const isPending = String(profile?.status || '').toLowerCase() === 'pending'
  const isPendingPage = pathname === '/pending'
  const usePendingPadding = isPendingPage || isPending
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isToolsRoute = pathname.startsWith('/tools')
  const isQuestionRoute = pathname.startsWith('/question')
  const isNoticeRoute = pathname.startsWith('/notice')
  const isHomeRoute = pathname === '/'
  const topPadding = usePendingPadding
    ? 'pt-12 sm:pt-16 md:pt-20'
    : isDashboardRoute || isToolsRoute || isQuestionRoute || isNoticeRoute || isHomeRoute
      ? 'pt-12 sm:pt-16 md:pt-20'
      : 'pt-16 sm:pt-24 md:pt-32'

  useEffect(() => {
    let isMounted = true
    const fetchMobileBadges = async () => {
      if (!user?.email) {
        if (isMounted) {
          setUnreadNotifications(0)
          setUnreadByType({})
        }
        return
      }
      let token = localStorage.getItem('access-token')
      if (!token) {
        const jwtResponse = await fetch(`${apiBaseUrl}/jwt`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }),
        })
        if (jwtResponse.ok) {
          const jwtData = await jwtResponse.json().catch(() => null)
          if (jwtData?.token) {
            localStorage.setItem('access-token', jwtData.token)
            window.dispatchEvent(new Event('auth-token-updated'))
            token = jwtData.token
          }
        }
      }
      if (!token) return
      try {
        const response = await fetch(`${apiBaseUrl}/notifications/summary`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) return
        const data = await response.json().catch(() => null)
        if (!isMounted) return
        setUnreadNotifications(Number(data?.unreadCount || 0))
        setUnreadByType(data?.unreadByType || {})
      } catch (error) {
        // Keep default state on error.
      }
    }
    const handleRefresh = () => {
      fetchMobileBadges()
    }
    fetchMobileBadges()
    window.addEventListener('notifications-read', handleRefresh)
    return () => {
      isMounted = false
      window.removeEventListener('notifications-read', handleRefresh)
    }
  }, [user?.email])

  useEffect(() => {
    const typesToMark = []
    if (pathname.startsWith('/notice')) {
      typesToMark.push('notice_published')
    }
    if (pathname.startsWith('/question')) {
      typesToMark.push('question_published')
    }
    if (pathname.startsWith('/dashboard/notice-approval')) {
      typesToMark.push('notice_request')
    }

    if (!typesToMark.length || !user?.email) return

    const shouldMark = typesToMark.some((type) => Number(unreadByType?.[type] || 0) > 0)
    if (!shouldMark) return

    const markRead = async () => {
      let token = localStorage.getItem('access-token')
      if (!token) {
        const jwtResponse = await fetch(`${apiBaseUrl}/jwt`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }),
        })
        if (jwtResponse.ok) {
          const jwtData = await jwtResponse.json().catch(() => null)
          if (jwtData?.token) {
            localStorage.setItem('access-token', jwtData.token)
            window.dispatchEvent(new Event('auth-token-updated'))
            token = jwtData.token
          }
        }
      }
      if (!token) return
      await fetch(`${apiBaseUrl}/notifications/read-type`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ types: typesToMark }),
      })
      window.dispatchEvent(new Event('notifications-read'))
    }

    markRead()
  }, [pathname, unreadByType, user?.email])

  if ((loading && !isAuthRoute) || (user && profileLoading)) {
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
                      'relative grid h-10 w-10 place-items-center rounded-xl transition',
                      isActive ? 'bg-[#2B4CB3] text-white' : 'bg-white text-[#1E3A8A]',
                    ].join(' ')}
                  >
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                    {item.to === '/question' && Number(unreadByType?.question_published || 0) > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#DC2626]" />
                    ) : null}
                    {item.to === '/notice' && Number(unreadByType?.notice_published || 0) > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#DC2626]" />
                    ) : null}
                    {item.to === '/dashboard' && unreadNotifications > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#DC2626]" />
                    ) : null}
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
