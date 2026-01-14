import { useContext, useEffect, useState } from 'react'
import DashboardSection from './DashboardSection.jsx'
import { AuthContext } from '../../Provider/AuthProvider.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function Notifications() {
  const { user } = useContext(AuthContext)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError('')
        const token = await getToken()
        if (!token) return
        const response = await fetch(`${apiBaseUrl}/notifications?page=${page}&limit=5`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to load notifications.')
        }
        const data = await response.json().catch(() => null)
        if (!isMounted) return
        const fetchedItems = Array.isArray(data?.items) ? data.items : []
        setItems(fetchedItems)
        setTotalPages(Number(data?.totalPages || 1))

        if (Number(data?.unreadCount || 0) > 0) {
          await fetch(`${apiBaseUrl}/notifications/read`, {
            method: 'PATCH',
            headers: {
              authorization: `Bearer ${token}`,
            },
          })
          window.dispatchEvent(new Event('notifications-read'))
          if (isMounted) {
            setItems((prev) => prev.map((item) => ({ ...item, isRead: true })))
          }
        }
      } catch (err) {
        if (!isMounted) return
        setError(err?.message || 'Failed to load notifications.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchNotifications()
    return () => {
      isMounted = false
    }
  }, [user?.email, page])

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Notifications"
        description="New updates across questions, notices, approvals, and reports."
      />

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.08)] sm:p-6">
        {loading ? (
          <p className="text-sm text-[#64748B]">Loading notifications...</p>
        ) : error ? (
          <p className="text-sm text-[#DC2626]">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-[#64748B]">No notifications yet.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] px-3 py-3 text-sm text-[#475569]"
                >
                  <span
                    className={`mt-1 h-2 w-2 rounded-full ${
                      item.isRead ? 'bg-[#E2E8F0]' : 'bg-[#DC2626]'
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-[#0F172A]">{item.title || 'Notification'}</p>
                    <p className="mt-1">{item.message || ''}</p>
                    {item.createdAt ? (
                      <p className="mt-1 text-xs text-[#94A3B8]">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between text-sm text-[#64748B]">
              <button
                type="button"
                className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default Notifications
