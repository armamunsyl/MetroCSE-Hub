import { useEffect, useState } from 'react'
import DashboardSection from './DashboardSection.jsx'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/ConfirmModal.jsx'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

const createFormState = () => ({
  title: '',
  imageUrl: '',
  linkUrl: '',
  order: 0,
  isActive: true,
})

function AddBanner() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formState, setFormState] = useState(createFormState())
  const [editingId, setEditingId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState('')

  const fetchBanners = async () => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      toast.error('Unauthorized access.')
      setLoading(false)
      return
    }
    try {
      setError('')
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/admin/banners`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load banners.')
      }

      const data = await response.json()
      setBanners(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load banners.')
      toast.error(err?.message || 'Failed to load banners.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleInputChange = (field) => (event) => {
    const value = field === 'isActive' ? event.target.checked : event.target.value
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      toast.error('Unauthorized access.')
      return
    }

    try {
      setError('')
      setImageUploading(true)
      const formPayload = new FormData()
      formPayload.append('image', file)
      const response = await fetch(`${apiBaseUrl}/upload/banner-image`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formPayload,
      })

      if (!response.ok) {
        throw new Error('Failed to upload banner image.')
      }

      const data = await response.json()
      setFormState((prev) => ({ ...prev, imageUrl: data?.url || '' }))
      toast.success('Banner image uploaded.')
    } catch (err) {
      setError(err?.message || 'Failed to upload banner image.')
      toast.error(err?.message || 'Failed to upload banner image.')
    } finally {
      setImageUploading(false)
    }
  }

  const resetForm = () => {
    setFormState(createFormState())
    setEditingId('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      toast.error('Unauthorized access.')
      return
    }

    if (!formState.imageUrl) {
      setError('Banner image is required.')
      toast.error('Banner image is required.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      const payload = {
        title: formState.title,
        imageUrl: formState.imageUrl,
        linkUrl: formState.linkUrl,
        order: Number(formState.order) || 0,
        isActive: Boolean(formState.isActive),
      }
      const endpoint = editingId ? `${apiBaseUrl}/admin/banners/${editingId}` : `${apiBaseUrl}/admin/banners`
      const method = editingId ? 'PATCH' : 'POST'
      const response = await fetch(endpoint, {
        method,
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to save banner.')
      }

      toast.success(editingId ? 'Banner updated.' : 'Banner created.')
      resetForm()
      await fetchBanners()
    } catch (err) {
      setError(err?.message || 'Failed to save banner.')
      toast.error(err?.message || 'Failed to save banner.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (banner) => {
    setEditingId(banner._id)
    setFormState({
      title: banner.title || '',
      imageUrl: banner.imageUrl || '',
      linkUrl: banner.linkUrl || '',
      order: banner.order ?? 0,
      isActive: Boolean(banner.isActive),
    })
  }

  const handleDelete = async (bannerId) => {
    const token = localStorage.getItem('access-token')
    if (!token) {
      setError('Unauthorized access.')
      toast.error('Unauthorized access.')
      return
    }

    try {
      setError('')
      const response = await fetch(`${apiBaseUrl}/admin/banners/${bannerId}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete banner.')
      }

      toast.success('Banner deleted.')
      if (editingId === bannerId) {
        resetForm()
      }
      await fetchBanners()
    } catch (err) {
      setError(err?.message || 'Failed to delete banner.')
      toast.error(err?.message || 'Failed to delete banner.')
    }
  }

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Add Banner"
        description="Create, update, and manage banners for the home page."
      />

      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
        <h2 className="text-sm font-semibold text-[#0F172A] sm:text-base">
          {editingId ? 'Update banner' : 'Create banner'}
        </h2>
        <form className="mt-4 space-y-4 text-sm text-[#475569]" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-xs font-semibold text-[#475569] sm:text-sm">
              Title (optional)
              <input
                type="text"
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-normal text-[#475569]"
                value={formState.title}
                onChange={handleInputChange('title')}
              />
            </label>
            <label className="space-y-2 text-xs font-semibold text-[#475569] sm:text-sm">
              Link URL (optional)
              <input
                type="url"
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-normal text-[#475569]"
                value={formState.linkUrl}
                onChange={handleInputChange('linkUrl')}
              />
            </label>
            <label className="space-y-2 text-xs font-semibold text-[#475569] sm:text-sm">
              Order
              <input
                type="number"
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-normal text-[#475569]"
                value={formState.order}
                onChange={handleInputChange('order')}
              />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#475569] sm:text-sm">
              <input
                type="checkbox"
                checked={formState.isActive}
                onChange={handleInputChange('isActive')}
                className="h-4 w-4"
              />
              Active
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#475569] sm:text-sm">Banner image</label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#CBD5F5] bg-[#F8FAFF] px-4 py-2 text-xs text-[#475569]">
                <span>{imageUploading ? 'Uploading...' : 'Upload image'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              {formState.imageUrl ? (
                <a
                  href={formState.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#1E3A8A]"
                >
                  View current image
                </a>
              ) : null}
            </div>
          </div>

          {error ? <p className="text-xs font-semibold text-[#DC2626]">{error}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95 disabled:opacity-60"
              disabled={submitting || imageUploading}
            >
              {submitting ? 'Saving...' : editingId ? 'Update banner' : 'Create banner'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#475569]"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <div className="border-b border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#0F172A]">
          Existing banners
        </div>
        {loading ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="px-4 py-6 text-sm text-[#64748B]">No banners found.</div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {banners.map((banner) => (
              <div key={banner._id} className="flex flex-wrap items-center gap-4 px-4 py-4">
                <img
                  src={banner.imageUrl}
                  alt={banner.title || 'Banner'}
                  className="h-16 w-28 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {banner.title || 'Untitled banner'}
                  </p>
                  <p className="text-xs text-[#64748B]">Order: {banner.order ?? 0}</p>
                  <p className="text-xs text-[#64748B]">
                    Status: {banner.isActive ? 'Active' : 'Hidden'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-[#1E3A8A] hover:text-white"
                    onClick={() => handleEdit(banner)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-[#FCA5A5] px-3 py-1 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FEE2E2]"
                    onClick={() => setPendingDeleteId(banner._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <ConfirmModal
        isOpen={Boolean(pendingDeleteId)}
        title="Delete banner?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setPendingDeleteId('')}
        onConfirm={() => {
          const id = pendingDeleteId
          setPendingDeleteId('')
          handleDelete(id)
        }}
      />
    </div>
  )
}

export default AddBanner
