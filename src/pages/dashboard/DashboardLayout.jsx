import { NavLink, Outlet } from 'react-router-dom'
import useUserProfile from '../../hooks/useUserProfile.js'

const menuByRole = {
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

function DashboardLayout() {
  const { profile, loading } = useUserProfile()
  const role = profile?.role?.toLowerCase() || 'student'
  const menuItems = menuByRole[role] || menuByRole.student

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAFC]">
        <span className="loading loading-spinner text-[#3BB273] h-12 w-12"></span>
      </div>
    )
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-6 sm:px-6 lg:pt-10">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] lg:block">
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-[#E0E7FF] shadow-[0_10px_20px_rgba(30,58,138,0.25)]">
              <img
                src={profile?.imageUrl || '/profile-avatar.jpg'}
                alt={profile?.name || 'Profile'}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-[#0F172A]">{profile?.name || 'MetroCSE User'}</h2>
            <p className="text-xs text-[#64748B]">{profile?.email || ''}</p>
            <span className="mt-3 rounded-full bg-[#E0E7FF] px-3 py-1 text-[11px] font-semibold text-[#1E3A8A]">
              {profile?.role || 'Student'}
            </span>
          </div>

          <nav className="mt-6 space-y-2 text-sm font-semibold text-[#475569]">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 rounded-xl px-3 py-2 transition',
                    isActive ? 'bg-[#1E3A8A] text-white shadow-[0_10px_20px_rgba(30,58,138,0.25)]' : 'hover:text-[#1E3A8A]',
                  ].join(' ')
                }
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default DashboardLayout
