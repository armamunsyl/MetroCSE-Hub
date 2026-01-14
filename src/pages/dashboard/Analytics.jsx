import { useContext, useEffect, useMemo, useState } from 'react'
import DashboardSection from './DashboardSection.jsx'
import { AuthContext } from '../../Provider/AuthProvider.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function Analytics() {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [chartType, setChartType] = useState('users-by-batch')
  const [analytics, setAnalytics] = useState({
    usersByBatch: [],
    usersBySection: [],
    usersByBatchSection: [],
    questionsByBatch: [],
    questionsBySection: [],
    questionsByBatchSection: [],
    userGraph: [],
  })

  const ensureJwt = async (email) => {
    if (!email) return null
    const jwtResponse = await fetch(`${apiBaseUrl}/jwt`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!jwtResponse.ok) return null
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
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError('')
        const token = await getToken()
        if (!token) return
        const response = await fetch(`${apiBaseUrl}/admin/analytics`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to load analytics.')
        }
        const data = await response.json().catch(() => null)
        if (!isMounted) return
        setAnalytics({
          usersByBatch: data?.usersByBatch || [],
          usersBySection: data?.usersBySection || [],
          usersByBatchSection: data?.usersByBatchSection || [],
          questionsByBatch: data?.questionsByBatch || [],
          questionsBySection: data?.questionsBySection || [],
          questionsByBatchSection: data?.questionsByBatchSection || [],
          userGraph: data?.userGraph || [],
        })
      } catch (err) {
        if (!isMounted) return
        setError(err?.message || 'Failed to load analytics.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchAnalytics()
    return () => {
      isMounted = false
    }
  }, [user?.email])

  const chartItems = useMemo(() => {
    const pick = (items) => items.map((item) => ({ label: item.key, value: item.count }))
    if (chartType === 'users-by-section') return pick(analytics.usersBySection)
    if (chartType === 'questions-by-batch') return pick(analytics.questionsByBatch)
    if (chartType === 'questions-by-section') return pick(analytics.questionsBySection)
    return pick(analytics.usersByBatch)
  }, [analytics, chartType])

  const chartData = useMemo(() => {
    const total = chartItems.reduce((sum, item) => sum + (item.value || 0), 0)
    if (!total) return { slices: [], total: 0 }
    const maxSlices = 8
    const sorted = [...chartItems].sort((a, b) => b.value - a.value)
    const top = sorted.slice(0, maxSlices)
    const rest = sorted.slice(maxSlices)
    const restValue = rest.reduce((sum, item) => sum + (item.value || 0), 0)
    const merged = restValue ? [...top, { label: 'Other', value: restValue }] : top
    return { slices: merged, total }
  }, [chartItems])

  const colors = ['#1E3A8A', '#0EA5E9', '#F97316', '#10B981', '#A855F7', '#E11D48', '#FACC15', '#0F766E', '#64748B']

  const polarToCartesian = (cx, cy, radius, angle) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  const buildArc = (cx, cy, radius, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, radius, endAngle)
    const end = polarToCartesian(cx, cy, radius, startAngle)
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} Z`
  }

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Analytics"
        description="Quick overview of users and questions distribution."
      />

      {loading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-sm text-[#64748B]">
          Loading analytics...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-sm text-[#DC2626]">
          {error}
        </div>
      ) : (
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[#1E3A8A]">Distribution pie</h3>
            <select
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#475569]"
              value={chartType}
              onChange={(event) => setChartType(event.target.value)}
            >
              <option value="users-by-batch">Users by batch</option>
              <option value="users-by-section">Users by section</option>
              <option value="questions-by-batch">Questions by batch</option>
              <option value="questions-by-section">Questions by section</option>
            </select>
          </div>

          {chartData.total ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="flex items-center justify-center">
                <svg width="260" height="260" viewBox="0 0 260 260" aria-hidden="true">
                  {(() => {
                    let startAngle = 0
                    return chartData.slices.map((slice, index) => {
                      const angle = (slice.value / chartData.total) * 360
                      const endAngle = startAngle + angle
                      const path = buildArc(130, 130, 110, startAngle, endAngle)
                      const fill = colors[index % colors.length]
                      startAngle = endAngle
                      return <path key={`${slice.label}-${index}`} d={path} fill={fill} />
                    })
                  })()}
                </svg>
              </div>
              <div className="space-y-3">
                {chartData.slices.map((slice, index) => {
                  const percent = Math.round((slice.value / chartData.total) * 100)
                  return (
                    <div key={slice.label} className="flex items-center gap-3 text-sm text-[#475569]">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="font-semibold text-[#0F172A]">{slice.label}</span>
                      <span className="ml-auto text-[#64748B]">
                        {slice.value} · {percent}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#64748B]">No data available.</p>
          )}
          {chartType === 'questions-by-batch' && chartItems.length ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[360px] text-left text-sm text-[#475569]">
                <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#475569]">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-[#0F172A]">Batch</th>
                    <th className="px-3 py-2 font-semibold text-[#0F172A]">Total</th>
                    <th className="px-3 py-2 font-semibold text-[#0F172A]">Percent</th>
                  </tr>
                </thead>
                <tbody>
                  {[...chartItems]
                    .sort((a, b) => b.value - a.value)
                    .map((item) => {
                      const percent = chartData.total
                        ? ((item.value / chartData.total) * 100).toFixed(1)
                        : '0.0'
                      return (
                        <tr key={item.label} className="border-t border-[#E5E7EB]">
                          <td className="px-3 py-2 font-semibold text-[#0F172A]">CSE {item.label}</td>
                          <td className="px-3 py-2">{item.value}</td>
                          <td className="px-3 py-2">{percent}%</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      )}
    </div>
  )
}

export default Analytics
