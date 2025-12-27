import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Provider/AuthProvider.jsx'
import DashboardSection from './DashboardSection.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function ManageUser() {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 8
  const roleOptions = ['Admin', 'Moderator', 'CR']

  useEffect(() => {
    const token = localStorage.getItem('access-token')
    if (!token || !user?.email) {
      setLoading(false)
      return
    }

    const fetchUsers = async () => {
      try {
        setError('')
        setLoading(true)
        const response = await fetch(`${apiBaseUrl}/admin/users`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load users.')
        }

        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err?.message || 'Failed to load users.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user?.email])

  const handleRoleChange = (userId, nextRole) => {
    setUsers((prev) =>
      prev.map((user) => (user._id === userId ? { ...user, role: nextRole } : user))
    )
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredUsers = users.filter((user) => {
    const roleMatches = roleFilter === 'all' ? true : user.role?.toLowerCase() === roleFilter
    if (!roleMatches) return false
    if (!normalizedSearch) return true
    const fields = [
      user.studentId,
      user.name,
      user.batch,
      user.email,
      user.section,
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())
    return fields.some((value) => value.includes(normalizedSearch))
  })

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / perPage))
  const safePage = Math.min(page, totalPages)
  const pageRows = filteredUsers.slice((safePage - 1) * perPage, safePage * perPage)

  useEffect(() => {
    setPage(1)
  }, [searchTerm, roleFilter])

  const handleViewDetails = async (userId) => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setDetailError('Unauthorized access.')
      return
    }

    try {
      setDetailError('')
      setDetailLoading(true)
      const response = await fetch(`${apiBaseUrl}/admin/users/${userId}`, {
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

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Manage User"
        description="Manage user roles, statuses, and access levels."
      />

      <section className="overflow-hidden border-0 bg-transparent shadow-none sm:rounded-2xl sm:border sm:border-[#E5E7EB] sm:bg-white sm:shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
        {loading ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">Loading users...</div>
        ) : error ? (
          <div className="px-4 py-6 text-sm text-[#DC2626]">{error}</div>
        ) : null}
        <div className="grid gap-3 px-2 py-3 sm:px-4 sm:py-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            Search
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-normal text-[#475569]"
              placeholder="Search by id, name, batch, email, section"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-[minmax(160px,220px)_auto] sm:items-end">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              Role filter
              <select
                className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-normal text-[#475569]"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="all">All</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="student">Student</option>
                <option value="cr">CR</option>
              </select>
            </label>
            <p className="text-xs font-semibold text-[#1E3A8A]">Results: {filteredUsers.length}</p>
          </div>
        </div>
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[720px] text-left text-sm text-[#475569]">
            <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#475569]">
              <tr>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Name</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Email</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Batch</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Section</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Role</th>
                <th className="px-4 py-3 font-semibold text-[#0F172A]">Details</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((user) => (
                <tr key={user._id} className="border-t border-[#E5E7EB]">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.batch}</td>
                  <td className="px-4 py-3">{user.section}</td>
                  <td className="px-4 py-3">
                    <select
                      className="w-full rounded-lg border border-[#E5E7EB] bg-white px-2 py-1 text-sm text-[#475569]"
                      value={user.role}
                      onChange={(event) => handleRoleChange(user._id, event.target.value)}
                    >
                      {!roleOptions.includes(user.role) ? (
                        <option value={user.role}>{user.role}</option>
                      ) : null}
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                      onClick={() => handleViewDetails(user._id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="hidden items-center justify-between px-4 py-3 text-xs text-[#475569] sm:flex">
          <button
            type="button"
            className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-[#1E3A8A] disabled:opacity-50"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage === 1}
          >
            Prev
          </button>
          <span>
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-[#1E3A8A] disabled:opacity-50"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={safePage === totalPages}
          >
            Next
          </button>
        </div>

        <div className="sm:hidden">
          <div className="bg-[#F8FAFC] px-2 py-3 text-xs font-semibold text-[#475569]">User list</div>
          <div className="overflow-x-hidden">
            <table className="w-full table-fixed text-left text-[11px] text-[#475569]">
              <thead className="bg-[#F8FAFC] uppercase tracking-wide text-[#475569]">
                <tr>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">Name</th>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">Batch</th>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">Role</th>
                  <th className="px-2 py-2 text-[10px] font-semibold text-[#0F172A]">View</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((user) => (
                  <tr key={user._id} className="border-t border-[#E5E7EB]">
                    <td className="px-2 py-2 font-semibold text-[#0F172A]">
                      <span className="block break-words">{user.name}</span>
                    </td>
                    <td className="px-2 py-2">{user.batch}</td>
                    <td className="px-2 py-2">
                      <select
                        className="w-full rounded-md border border-[#E5E7EB] bg-white px-1.5 py-1 text-[11px] text-[#475569]"
                        value={user.role}
                        onChange={(event) => handleRoleChange(user._id, event.target.value)}
                      >
                        {!roleOptions.includes(user.role) ? (
                          <option value={user.role}>{user.role}</option>
                        ) : null}
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        className="rounded-md border border-[#E5E7EB] px-2 py-1 text-[10px] font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                        onClick={() => handleViewDetails(user._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-2 py-3 text-[11px] text-[#475569]">
            <button
              type="button"
              className="rounded-md border border-[#E5E7EB] px-2 py-1 text-[10px] font-semibold text-[#1E3A8A] disabled:opacity-50"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={safePage === 1}
            >
              Prev
            </button>
            <span>
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              className="rounded-md border border-[#E5E7EB] px-2 py-1 text-[10px] font-semibold text-[#1E3A8A] disabled:opacity-50"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={safePage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {detailLoading || detailError || selectedUser ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#0F172A]/40 px-4">
          <div className="w-full max-w-[380px] rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0F172A]">User details</h2>
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
                  <span className="text-[#64748B]">Role</span>
                  <span className="rounded-full bg-[#E0E7FF] px-3 py-1 text-xs font-semibold text-[#1E3A8A]">
                    {selectedUser.role}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <span className="text-[#64748B]">Status</span>
                  <span className="font-semibold text-[#0F172A]">{selectedUser.status || '--'}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <span className="text-[#64748B]">Approved By</span>
                  <span className="font-semibold text-[#0F172A]">{selectedUser.approvedBy || 'none'}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <span className="text-[#64748B]">Contribution Score</span>
                  <span className="font-semibold text-[#0F172A]">{selectedUser.contributionScore ?? 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] px-3 py-2">
                  <span className="text-[#64748B]">Created</span>
                  <span className="font-semibold text-[#0F172A]">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '--'}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ManageUser
