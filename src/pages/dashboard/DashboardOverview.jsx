import { useContext, useEffect, useState } from 'react'
import DashboardSection from './DashboardSection.jsx'
import { AuthContext } from '../../Provider/AuthProvider.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function DashboardOverview() {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalContributions: 0,
    pendingRequests: 0,
    newNotices: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  const ensureJwt = async (email) => {
    if (!email) return null
    const jwtResponse = await fetch(`${apiBaseUrl}/jwt`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!jwtResponse.ok) {
      return null
    }

    const jwtData = await jwtResponse.json().catch(() => null)
    if (jwtData?.token) {
      localStorage.setItem('access-token', jwtData.token)
      window.dispatchEvent(new Event('auth-token-updated'))
      return jwtData.token
    }
    return null
  }

  const getToken = async () => {
    let token = localStorage.getItem('access-token')
    if (!token && user?.email) {
      token = await ensureJwt(user.email)
    }
    return token
  }

  useEffect(() => {
    let isMounted = true
    const fetchOverview = async () => {
      try {
        setLoading(true)
        const token = await getToken()
        if (!token) return
        const response = await fetch(`${apiBaseUrl}/dashboard/overview`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) return
        const data = await response.json()
        if (!isMounted) return
        setStats({
          totalContributions: data?.stats?.totalContributions || 0,
          pendingRequests: data?.stats?.pendingRequests || 0,
          newNotices: data?.stats?.newNotices || 0,
        })
        setRecentActivity(Array.isArray(data?.recentActivity) ? data.recentActivity : [])
      } catch (error) {
        // Keep fallback values on error.
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    fetchOverview()
    return () => {
      isMounted = false
    }
  }, [user?.email])

  const statCards = [
    { label: 'Total Contributions', value: stats.totalContributions, tone: 'bg-[#E0F2FE] text-[#0369A1]' },
    { label: 'Pending Requests', value: stats.pendingRequests, tone: 'bg-[#FEF3C7] text-[#B45309]' },
    { label: 'New Notices', value: stats.newNotices, tone: 'bg-[#EDE9FE] text-[#6D28D9]' },
  ]

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Welcome back!"
        description="Track your contributions, notices, and approvals from one place."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold text-[#64748B]">{stat.label}</p>
            <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-lg font-semibold ${stat.tone}`}>
              {loading ? '...' : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
        <h2 className="text-sm font-semibold text-[#1E3A8A]">Recent Activity</h2>
        <ul className="mt-3 space-y-2 text-sm text-[#475569]">
          {loading ? (
            <li>Loading recent activity...</li>
          ) : recentActivity.length ? (
            recentActivity.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
          ) : (
            <li>No recent activity yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default DashboardOverview
