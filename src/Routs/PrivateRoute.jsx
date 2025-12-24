import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../Provider/AuthProvider.jsx'

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F7FAFC]">
        <span className="loading loading-spinner text-[#3BB273] w-12 h-12"></span>
      </div>
    )
  }

  if (user) {
    return children
  }

  return <Navigate to="/login" state={{ from: location }} replace />
}

export default PrivateRoute
