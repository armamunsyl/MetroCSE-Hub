import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Provider/AuthProvider.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function useUserProfile() {
  const { user } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tokenVersion, setTokenVersion] = useState(0)

  useEffect(() => {
    const handleTokenUpdate = () => {
      setTokenVersion((version) => version + 1)
    }
    window.addEventListener('auth-token-updated', handleTokenUpdate)
    return () => window.removeEventListener('auth-token-updated', handleTokenUpdate)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('access-token')
    if (!user?.email) {
      setProfile(null)
      setLoading(false)
      return
    }
    if (!token) {
      setProfile(null)
      setLoading(true)
      return
    }

    const fetchProfile = async () => {
      try {
        setError('')
        const response = await fetch(`${apiBaseUrl}/users/profile`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load profile.')
        }

        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err?.message || 'Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [tokenVersion, user?.email])

  return { profile, loading, error }
}

export default useUserProfile
