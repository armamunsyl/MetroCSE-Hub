import { Link } from 'react-router-dom'
import DashboardSection from './DashboardSection.jsx'

function MyProfile() {
  return (
    <div className="space-y-6">
      <DashboardSection
        title="My Profile"
        description="View your personal details and update your profile picture."
      />
      <Link
        to="/profile"
        className="inline-flex rounded-full bg-[#1E3A8A] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95"
      >
        Go to Profile
      </Link>
    </div>
  )
}

export default MyProfile
