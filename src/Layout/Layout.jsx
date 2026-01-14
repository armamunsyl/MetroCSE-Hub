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
      <a
        href="https://whatsapp.com/channel/0029VbAzdNb6RGJ8zhGZQr28"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_24px_rgba(37,211,102,0.35)] transition hover:scale-105 sm:bottom-6 max-sm:bottom-24"
        aria-label="Join our WhatsApp channel"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366]/60" />
        <svg viewBox="0 0 32 32" className="relative h-6 w-6" aria-hidden="true">
          <path
            d="M19.1 17.8c-.2-.1-1.1-.5-1.3-.6-.2-.1-.3-.1-.5.1-.1.2-.5.6-.6.7-.1.1-.2.1-.4 0-.2-.1-.8-.3-1.5-1-.6-.6-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.1-.2.2-.3.1-.1.1-.2.2-.4.1-.2 0-.3 0-.4s-.5-1.2-.7-1.6c-.2-.4-.3-.3-.5-.3h-.4c-.1 0-.3 0-.5.2-.2.2-.6.6-.6 1.4 0 .8.6 1.6.7 1.7.1.1 1.2 1.9 3 2.7 1.7.7 1.7.5 2 .5.3 0 1-.4 1.1-.8.1-.4.1-.7.1-.8-.1-.1-.2-.1-.4-.2z"
            fill="currentColor"
          />
          <path
            d="M16 4.5C9.7 4.5 4.5 9.7 4.5 16c0 2.1.6 4.2 1.6 6L4.5 27.5l5.7-1.5c1.7 1 3.7 1.5 5.8 1.5 6.3 0 11.5-5.2 11.5-11.5S22.3 4.5 16 4.5zm0 21c-1.9 0-3.7-.5-5.2-1.4l-.4-.3-3.3.9.9-3.2-.3-.4c-1-1.6-1.5-3.5-1.5-5.1C6.2 10.6 10.6 6.2 16 6.2s9.8 4.4 9.8 9.8-4.4 9.5-9.8 9.5z"
            fill="currentColor"
          />
        </svg>
      </a>
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
