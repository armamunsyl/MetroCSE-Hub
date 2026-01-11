import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  HiOutlineBell,
  HiOutlineChartBarSquare,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClipboardDocumentCheck,
  HiOutlineExclamationTriangle,
  HiOutlineHome,
  HiOutlinePhoto,
  HiOutlineSquares2X2,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineXMark,
} from 'react-icons/hi2'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { AuthContext } from '../Provider/AuthProvider.jsx'
import useUserProfile from '../hooks/useUserProfile.js'

const dashboardMenuByRole = {
  student: [
    { label: 'Dashboard Overview', to: '/dashboard' },
    { label: 'My Profile', to: '/dashboard/profile' },
    { label: 'My Contribution', to: '/dashboard/my-contribution' },
    { label: 'Pending Contribution', to: '/dashboard/pending-contribution' },
    { label: 'My Notice', to: '/dashboard/my-notice' },
    { label: 'My Comment', to: '/dashboard/my-comment' },
    { label: 'Admin Feedback', to: '/dashboard/admin-feedback' },
  ],
  moderator: [
    { label: 'Dashboard Overview', to: '/dashboard' },
    { label: 'My Profile', to: '/dashboard/profile' },
    { label: 'My Contribution', to: '/dashboard/my-contribution' },
    { label: 'Contribute Request', to: '/dashboard/contribute-request' },
    { label: 'My Notice', to: '/dashboard/my-notice' },
    { label: 'My Comment', to: '/dashboard/my-comment' },
    { label: 'Account Approval', to: '/dashboard/account-approval' },
    { label: 'Admin Feedback', to: '/dashboard/admin-feedback' },
  ],
  cr: [
    { label: 'Dashboard Overview', to: '/dashboard' },
    { label: 'My Profile', to: '/dashboard/profile' },
    { label: 'My Contribution', to: '/dashboard/my-contribution' },
    { label: 'Contribute Request', to: '/dashboard/contribute-request' },
    { label: 'My Notice', to: '/dashboard/my-notice' },
    { label: 'My Comment', to: '/dashboard/my-comment' },
    { label: 'Account Approval', to: '/dashboard/account-approval' },
    { label: 'Admin Feedback', to: '/dashboard/admin-feedback' },
  ],
  admin: [
    { label: 'Dashboard Overview', to: '/dashboard' },
    { label: 'My Profile', to: '/dashboard/profile' },
    { label: 'Manage User', to: '/dashboard/manage-user' },
    { label: 'My Contribution', to: '/dashboard/my-contribution' },
    { label: 'Contribute Request', to: '/dashboard/contribute-request' },
    { label: 'My Notice', to: '/dashboard/my-notice' },
    { label: 'My Comment', to: '/dashboard/my-comment' },
    { label: 'Account Approval', to: '/dashboard/account-approval' },
    { label: 'Notice Approval', to: '/dashboard/notice-approval' },
    { label: 'User Feedback', to: '/dashboard/user-feedback' },
    { label: 'Reported Object', to: '/dashboard/reported-object' },
    { label: 'Add Banner', to: '/dashboard/add-banner' },
    { label: 'Analytics', to: '/dashboard/analytics' },
  ],
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, loading, logOut } = useContext(AuthContext)
  const { profile, loading: profileLoading } = useUserProfile()
  const [avatarUrl, setAvatarUrl] = useState('/profile-avatar.jpg')
  const avatarAlt = user?.displayName || 'Profile'
  const handleAvatarError = useCallback(() => {
    setAvatarUrl('/profile-avatar.jpg')
  }, [])
  const avatarStorageKey = useMemo(() => {
    if (!user) return ''
    const identifier = user?.uid || user?.email || 'anonymous'
    return `profile-avatar:${identifier}`
  }, [user?.uid, user?.email])
  const initials = useMemo(() => {
    const name = user?.displayName || ''
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }, [user?.displayName])

  useEffect(() => {
    const syncAvatar = () => {
      localStorage.removeItem('profile-avatar')
      if (!user) {
        setAvatarUrl('/profile-avatar.jpg')
        return
      }
      if (profile?.imageUrl) {
        setAvatarUrl(profile.imageUrl)
        return
      }
      const storedAvatar = avatarStorageKey ? localStorage.getItem(avatarStorageKey) : null
      if (storedAvatar) {
        setAvatarUrl(storedAvatar)
        return
      }
      setAvatarUrl(user?.photoURL || '/profile-avatar.jpg')
    }

    syncAvatar()
    window.addEventListener('profile-avatar-updated', syncAvatar)
    return () => window.removeEventListener('profile-avatar-updated', syncAvatar)
  }, [avatarStorageKey, profile?.imageUrl, user, user?.photoURL])

  const dashboardMenuItems = dashboardMenuByRole[profile?.role?.toLowerCase() || 'student'] || []
  const isPending = String(profile?.status || '').toLowerCase() === 'pending'
  const showNavLinks = Boolean(user) && !profileLoading && !isPending
  const showAuthButtons = !loading && !user
  const showPendingActions = !loading && !profileLoading && user && isPending

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

        {showNavLinks ? (
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
            {loading ? null : (
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-[#E5E7EB] px-2.5 py-1.5 shadow-[0_6px_14px_rgba(15,23,42,0.12)]"
              >
              <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-[#E0E7FF] text-[11px] font-semibold text-[#1E3A8A]">
                {initials || 'U'}
                <img
                  src={avatarUrl}
                  alt={avatarAlt}
                  className="absolute inset-0 h-full w-full rounded-full object-cover"
                  onError={handleAvatarError}
                  loading="eager"
                />
              </span>
                <span className="max-w-[120px] truncate text-sm font-semibold text-[#1E3A8A]">
                  {user?.displayName || 'Profile'}
                </span>
              </Link>
            )}
          </nav>
        ) : (
          <div className="hidden items-center gap-3 md:flex">
            {showAuthButtons ? (
              <>
                <Link
                  to="/login"
                  className="rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:brightness-90"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-semibold text-[#1E3A8A] shadow-[0_8px_16px_rgba(15,23,42,0.08)] hover:bg-[#F8FAFC]"
                >
                  Register
                </Link>
              </>
            ) : showPendingActions ? (
              <button
                type="button"
                onClick={() => logOut()}
                className="rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:brightness-90"
              >
                Log out
              </button>
            ) : null}
          </div>
        )}

        {showNavLinks ? (
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
        ) : (
          <div className="flex items-center gap-2 md:hidden">
            {showAuthButtons ? (
              <>
                <Link
                  to="/login"
                  className="rounded-full bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#1E3A8A] shadow-[0_8px_16px_rgba(15,23,42,0.08)]"
                >
                  Register
                </Link>
              </>
            ) : showPendingActions ? (
              <button
                type="button"
                onClick={() => logOut()}
                className="rounded-full bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
              >
                Log out
              </button>
            ) : null}
          </div>
        )}
      </div>

      {showNavLinks && menuOpen && (
        <div className="fixed left-0 top-0 z-50 h-screen w-screen md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#0F172A]/50"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[60%] min-w-[240px] overflow-y-auto bg-white px-5 pb-24 pt-16 shadow-[0_30px_60px_rgba(15,23,42,0.25)]">
            <button
              type="button"
              className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-[#0F172A]/10 text-[#1E3A8A]"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <HiOutlineXMark className="h-5 w-5" />
            </button>
            {loading ? null : user ? (
              <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
                <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#E0E7FF] text-xs font-semibold text-[#1E3A8A]">
                  {initials || 'U'}
                  <img
                    src={avatarUrl}
                    alt={avatarAlt}
                    className="absolute inset-0 h-full w-full rounded-full object-cover"
                    onError={handleAvatarError}
                    loading="eager"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {user?.displayName || 'Profile'}
                  </p>
                  <p className="text-xs text-[#64748B]">{profile?.role || 'Student'}</p>
                </div>
              </div>
            ) : (
              <div className="border-b border-[#E5E7EB] pb-4">
                <Link
                  to="/login"
                  className="inline-flex rounded-full bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white"
                >
                  Login
                </Link>
              </div>
            )}

            <div className="mt-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
                Dashboard Menu
              </p>
              <div className="grid gap-2">
                {dashboardMenuItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/dashboard'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
                        isActive
                          ? 'bg-[#1E3A8A] text-white shadow-[0_8px_18px_rgba(30,58,138,0.22)]'
                          : 'text-[#475569] hover:text-[#1E3A8A]',
                      ].join(' ')
                    }
                  >
                    <span className="text-base">
                      {{
                        '/dashboard': <HiOutlineSquares2X2 />,
                        '/dashboard/profile': <HiOutlineUser />,
                        '/dashboard/manage-user': <HiOutlineUsers />,
                        '/dashboard/my-contribution': <HiOutlineDocumentText />,
                        '/dashboard/pending-contribution': <HiOutlineClipboardDocumentCheck />,
                        '/dashboard/contribute-request': <HiOutlineClipboardDocumentCheck />,
                        '/dashboard/my-notice': <HiOutlineBell />,
                        '/dashboard/my-comment': <HiOutlineChatBubbleLeftRight />,
                        '/dashboard/account-approval': <HiOutlineClipboardDocumentCheck />,
                        '/dashboard/notice-approval': <HiOutlineBell />,
                        '/dashboard/admin-feedback': <HiOutlineChatBubbleLeftRight />,
                        '/dashboard/user-feedback': <HiOutlineChatBubbleLeftRight />,
                        '/dashboard/reported-object': <HiOutlineExclamationTriangle />,
                        '/dashboard/add-banner': <HiOutlinePhoto />,
                        '/dashboard/analytics': <HiOutlineChartBarSquare />,
                      }[item.to] || <HiOutlineHome />}
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
