import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Provider/AuthProvider.jsx'
import DashboardSection from './DashboardSection.jsx'

function AccountApproval() {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

  useEffect(() => {
    const token = localStorage.getItem('access-token')
    if (!token || !user?.email) {
      setLoading(false)
      return
    }

    const fetchPendingUsers = async () => {
      try {
        setError('')
        setLoading(true)
        const response = await fetch(`${apiBaseUrl}/admin/approvals?status=Pending`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load pending users.')
        }

        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err?.message || 'Failed to load pending users.')
      } finally {
        setLoading(false)
      }
    }

    fetchPendingUsers()
  }, [user?.email])

  const handleViewDetails = async (userId) => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setDetailError('Unauthorized access.')
      return
    }

    try {
      setDetailError('')
      setDetailLoading(true)
      const response = await fetch(`${apiBaseUrl}/admin/approvals/${userId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load user details.')
      }

      const data = await response.json()
      setSelectedUser(data)
    } catch (err) {
      setDetailError(err?.message || 'Failed to load user details.')
      setSelectedUser(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDecision = async (action) => {
    if (!selectedUser?._id) return
    const token = localStorage.getItem('access-token')
    if (!token) {
      setDetailError('Unauthorized access.')
      return
    }

    try {
      setActionLoading(true)
      const response = await fetch(`${apiBaseUrl}/admin/approvals/${selectedUser._id}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status.')
      }

      setUsers((prev) => prev.filter((item) => item._id !== selectedUser._id))
      setSelectedUser(null)
    } catch (err) {
      setDetailError(err?.message || 'Failed to update status.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Account Approval"
        description="Review new account requests and approve eligible users."
      />

      <section className="overflow-hidden border-0 bg-transparent shadow-none sm:rounded-2xl sm:border sm:border-[#E5E7EB] sm:bg-white sm:shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
        {loading ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">Loading pending users...</div>
        ) : error ? (
          <div className="px-4 py-6 text-sm text-[#DC2626]">{error}</div>
        ) : null}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[560px] text-left text-sm text-[#475569]">
            <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#475569]">
              <tr>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Name</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Batch</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Details</th>
              </tr>
            </thead>
            <tbody>
              {users.map((pendingUser) => (
                <tr key={pendingUser._id} className="border-t border-[#E5E7EB]">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">{pendingUser.name}</td>
                  <td className="px-4 py-3">{pendingUser.batch}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                      onClick={() => handleViewDetails(pendingUser._id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden">
          <div className="bg-[#F8FAFC] px-2 py-3 text-xs font-semibold text-[#475569]">Pending users</div>
          <div className="overflow-x-hidden">
            <table className="w-full table-fixed text-left text-[11px] text-[#475569]">
              <thead className="bg-[#F8FAFC] uppercase tracking-wide text-[#475569]">
                <tr>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">Name</th>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">Batch</th>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">View</th>
                </tr>
              </thead>
              <tbody>
                {users.map((pendingUser) => (
                  <tr key={pendingUser._id} className="border-t border-[#E5E7EB]">
                    <td className="px-2 py-2 font-semibold text-[#0F172A]">
                      <span className="block break-words">{pendingUser.name}</span>
                    </td>
                    <td className="px-2 py-2">{pendingUser.batch}</td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        className="rounded-md border border-[#E5E7EB] px-2 py-1 text-[10px] font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                        onClick={() => handleViewDetails(pendingUser._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {detailLoading || detailError || selectedUser ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#0F172A]/40 px-4">
          <div className="w-full max-w-[380px] rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0F172A]">Approval details</h2>
              <button
                type="button"
                className="text-sm font-semibold text-[#64748B]"
                onClick={() => {
                  setSelectedUser(null)
                  setDetailError('')
                  setDetailLoading(false)
                }}
              >
                Close
              </button>
            </div>
            {detailLoading ? (
              <p className="mt-4 text-sm text-[#64748B]">Loading details...</p>
            ) : detailError ? (
              <p className="mt-4 text-sm text-[#DC2626]">{detailError}</p>
            ) : selectedUser ? (
              <div className="mt-3 space-y-2 text-sm text-[#475569]">
                <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-[#E2E8F0] bg-[#F8FAFC]">
                    {selectedUser.imageUrl ? (
                      <img src={selectedUser.imageUrl} alt={selectedUser.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8]">Name</p>
                    <p className="font-semibold text-[#0F172A]">{selectedUser.name}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <span className="text-[#64748B]">Email</span>
                  <span className="font-semibold text-[#0F172A]">{selectedUser.email}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <span className="text-[#64748B]">Gender</span>
                  <span className="font-semibold text-[#0F172A]">{selectedUser.gender || '--'}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <span className="text-[#64748B]">Student ID</span>
                  <span className="font-semibold text-[#0F172A]">{selectedUser.studentId}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                    <span className="text-[#64748B]">Batch</span>
                    <span className="font-semibold text-[#0F172A]">{selectedUser.batch}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                    <span className="text-[#64748B]">Section</span>
                    <span className="font-semibold text-[#0F172A]">{selectedUser.section}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <span className="text-[#64748B]">Status</span>
                  <span className="font-semibold text-[#0F172A]">{selectedUser.status || '--'}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <span className="text-[#64748B]">Created</span>
                  <span className="font-semibold text-[#0F172A]">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '--'}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#0F172A] transition hover:bg-[#1E3A8A] hover:text-white disabled:opacity-60"
                    onClick={() => handleDecision('reject')}
                    disabled={actionLoading}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-[#1E3A8A] px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95 disabled:opacity-60"
                    onClick={() => handleDecision('approve')}
                    disabled={actionLoading}
                  >
                    Approve
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AccountApproval
