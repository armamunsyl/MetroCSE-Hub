import { useState } from 'react'
import toast from 'react-hot-toast'
import DashboardSection from './DashboardSection.jsx'
import { batchOptions, sectionOptions } from '../../constants/academicOptions.js'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function UserFeedback() {
  const [formData, setFormData] = useState({
    email: '',
    batch: '',
    section: '',
    targetRole: '',
    title: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('access-token')
    if (!token) {
      toast.error('Unauthorized access.')
      return
    }
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Title and message are required.')
      return
    }
    if (!formData.email.trim() && !formData.batch && !formData.targetRole) {
      toast.error('Provide an email, select a role, or choose a batch.')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        targetEmail: formData.email.trim(),
        batch: formData.batch,
        section: formData.section,
        targetRole: formData.targetRole,
      }
      const response = await fetch(`${apiBaseUrl}/admin/feedback`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to send feedback.')
      }

      const data = await response.json()
      toast.success(`Feedback sent to ${data.insertedCount || 0} user(s).`)
      setFormData({ email: '', batch: '', section: '', targetRole: '', title: '', message: '' })
    } catch (err) {
      toast.error(err?.message || 'Failed to send feedback.')
    } finally {
      setSubmitting(false)
    }
  }

  const isEmailMode = Boolean(formData.email.trim())
  const isRoleMode = Boolean(formData.targetRole)

  return (
    <div className="space-y-6">
      <DashboardSection
        title="User Feedback"
        description="Send feedback to a specific user or a batch/section."
      />

      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
        <form className="space-y-4 text-sm text-[#475569]" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-xs font-semibold text-[#475569] sm:text-sm">
              Target email (optional)
              <input
                type="email"
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-normal text-[#475569]"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="student@email.com"
              />
            </label>
            <label className="space-y-2 text-xs font-semibold text-[#475569] sm:text-sm">
              Target role
              <select
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-normal text-[#475569]"
                value={formData.targetRole}
                onChange={handleChange('targetRole')}
                disabled={isEmailMode || formData.batch}
              >
                <option value="">Select</option>
                <option value="cr">CR</option>
                <option value="moderator">Moderator</option>
              </select>
            </label>
            <label className="space-y-2 text-xs font-semibold text-[#475569] sm:text-sm">
              Batch
              <select
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-normal text-[#475569]"
                value={formData.batch}
                onChange={handleChange('batch')}
                disabled={isEmailMode || isRoleMode}
              >
                <option value="">Select</option>
                {batchOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-xs font-semibold text-[#475569] sm:text-sm">
              Section
              <select
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-normal text-[#475569]"
                value={formData.section}
                onChange={handleChange('section')}
                disabled={isEmailMode || isRoleMode || !formData.batch}
              >
                <option value="">All sections</option>
                {sectionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2 text-xs font-semibold text-[#475569] sm:text-sm">
            Title
            <input
              type="text"
              className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-normal text-[#475569]"
              value={formData.title}
              onChange={handleChange('title')}
            />
          </label>
          <label className="space-y-2 text-xs font-semibold text-[#475569] sm:text-sm">
            Message
            <textarea
              rows="4"
              className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-normal text-[#475569]"
              value={formData.message}
              onChange={handleChange('message')}
            />
          </label>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95 disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Feedback'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default UserFeedback
