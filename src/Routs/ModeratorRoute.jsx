import { Navigate, useLocation } from 'react-router-dom'
import useUserProfile from '../hooks/useUserProfile.js'
import PrivateRoute from './PrivateRoute.jsx'

function ModeratorRoute({ children }) {
  const location = useLocation()
  const { profile, loading } = useUserProfile()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7FAFC]">
        <span className="loading loading-spinner text-[#3BB273] h-12 w-12"></span>
      </div>
    )
  }

  const role = profile?.role?.toLowerCase()
  if (role === 'moderator') {
    return children
  }

  return <Navigate to="/login" state={{ from: location }} replace />
}

export default function ModeratorRouteWrapper({ children }) {
  return (
    <PrivateRoute>
      <ModeratorRoute>{children}</ModeratorRoute>
    </PrivateRoute>
  )
}
