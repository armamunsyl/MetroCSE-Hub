import { useContext } from 'react'
import { AuthContext } from '../Provider/AuthProvider.jsx'
import useUserProfile from '../hooks/useUserProfile.js'
import Home from './Home.jsx'
import PublicLanding from './PublicLanding.jsx'
import PendingApproval from './PendingApproval.jsx'

function LandingGate() {
  const { user, loading } = useContext(AuthContext)
  const { profile, loading: profileLoading } = useUserProfile()

  if (loading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F7FAFC]">
        <span className="loading loading-spinner text-[#3BB273] w-12 h-12"></span>
      </div>
    )
  }

  if (!user) {
    return <PublicLanding />
  }

  const status = String(profile?.status || '').toLowerCase()
  if (status === 'pending') {
    return <PendingApproval />
  }

  return <Home />
}

export default LandingGate
