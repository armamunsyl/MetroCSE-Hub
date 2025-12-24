import { Navigate, useLocation } from 'react-router-dom'
import useUserProfile from '../hooks/useUserProfile.js'
import PrivateRoute from './PrivateRoute.jsx'

function RoleGate({ children, allow }) {
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
  if (allow.includes(role)) {
    return children
  }

  return <Navigate to="/login" state={{ from: location }} replace />
}

export default function RoleRoute({ children, allow }) {
  return (
    <PrivateRoute>
      <RoleGate allow={allow}>{children}</RoleGate>
    </PrivateRoute>
  )
}
