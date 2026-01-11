import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineCog6Tooth } from 'react-icons/hi2'
import { AuthContext } from '../Provider/AuthProvider.jsx'

function Profile() {
  const { user, logOut, updateUserProfile } = useContext(AuthContext)
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarError, setAvatarError] = useState('')
  const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')
  const avatarStorageKey = useMemo(() => {
    if (!user) return 'profile-avatar'
    const identifier = user?.uid || user?.email || 'anonymous'
    return `profile-avatar:${identifier}`
  }, [user?.uid, user?.email])

  useEffect(() => {
    const token = localStorage.getItem('access-token')
    if (!token || !user?.email) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
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
        const message =
          err?.message === 'Failed to fetch'
            ? `Cannot reach server at ${apiBaseUrl}. Check backend is running.`
            : err?.message || 'Failed to load profile.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [apiBaseUrl, user?.email])

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const ensureJwt = async (email) => {
    if (!email) return null
    const jwtResponse = await fetch(`${apiBaseUrl}/jwt`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
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

  const displayProfile = useMemo(() => {
    const fallbackName = user?.displayName || 'Student'
    const fallbackEmail = user?.email || ''
    const rawStudentId = profile?.studentId || ''
    const digitsOnly = rawStudentId.replace(/\D/g, '')
    const formattedStudentId =
      digitsOnly.length === 9
        ? `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
        : rawStudentId || '--'
    return {
      name: profile?.name || fallbackName,
      email: profile?.email || fallbackEmail,
      batch: profile?.batch || '--',
      section: profile?.section || '--',
      studentId: formattedStudentId,
      contributionScore: profile?.contributionScore ?? 0,
      role: profile?.role || 'Student',
      imageUrl: profile?.imageUrl || user?.photoURL || '/profile-avatar.jpg',
    }
  }, [profile, user])

  const handleAvatarUpload = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const file = form?.elements?.avatar?.files?.[0]
    if (!file) {
      setAvatarError('Please select an image file.')
      return
    }
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setAvatarError('Image is too large. Max size is 5MB.')
      return
    }

    setAvatarError('')
    let token = await getToken()
    if (!token) {
      setAvatarError('Login required to update profile picture.')
      return
    }

    setUploading(true)
    try {
      const uploadAvatar = async (authToken) => {
        const formData = new FormData()
        formData.append('image', file)
        const response = await fetch(`${apiBaseUrl}/upload/avatar`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${authToken}`,
          },
          body: formData,
        })
        const data = await response.json().catch(() => null)
        return { response, data }
      }

      let { response: uploadResponse, data: uploadData } = await uploadAvatar(token)
      if (uploadResponse.status === 401 && user?.email) {
        const refreshedToken = await ensureJwt(user.email)
        if (refreshedToken) {
          token = refreshedToken
          const retryResult = await uploadAvatar(refreshedToken)
          uploadResponse = retryResult.response
          uploadData = retryResult.data
        }
      }

      if (!uploadResponse.ok) {
        throw new Error(uploadData?.message || 'Failed to upload profile image.')
      }

      const imageUrl = uploadData?.url || ''
      if (!imageUrl) {
        throw new Error('Image upload failed.')
      }

      const updateAvatar = async (authToken) => {
        const response = await fetch(`${apiBaseUrl}/users/profile/image`, {
          method: 'PATCH',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ imageUrl }),
        })
        const data = await response.json().catch(() => null)
        return { response, data }
      }

      let { response: updateResponse, data: updateData } = await updateAvatar(token)
      if (updateResponse.status === 401 && user?.email) {
        const refreshedToken = await ensureJwt(user.email)
        if (refreshedToken) {
          token = refreshedToken
          const retryResult = await updateAvatar(refreshedToken)
          updateResponse = retryResult.response
          updateData = retryResult.data
        }
      }

      if (!updateResponse.ok) {
        throw new Error(updateData?.message || 'Failed to update profile.')
      }

      const cacheBustedUrl = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}v=${Date.now()}`
      await updateUserProfile(displayProfile.name, imageUrl)
      localStorage.removeItem('profile-avatar')
      localStorage.setItem(avatarStorageKey, cacheBustedUrl)
      window.dispatchEvent(new Event('profile-avatar-updated'))
      setProfile((prev) => (prev ? { ...prev, imageUrl: cacheBustedUrl } : prev))
      setModalOpen(false)
      setAvatarPreview('')
    } catch (err) {
      setAvatarError(err?.message || 'Failed to update profile image.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F1FF] via-[#F7F6FF] to-[#F2F7FF] px-4 pb-16 pt-8 sm:-mt-6 md:-mt-12">
      <div className="mx-auto w-full max-w-[440px]">
        <section className="rounded-[28px] bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur">
          <header className="flex items-center justify-between text-[#1E3A8A]">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#1E3A8A] shadow-[0_6px_14px_rgba(15,23,42,0.12)]"
              aria-label="Go back"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M15.75 19L8.75 12L15.75 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">Profile</h1>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#1E3A8A] shadow-[0_6px_14px_rgba(15,23,42,0.12)]"
              aria-label="Settings"
              onClick={() => setModalOpen(true)}
            >
              <HiOutlineCog6Tooth className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E2E8FF] p-1">
              <div className="h-full w-full overflow-hidden rounded-full border-[3px] border-white">
                <img
                  src={displayProfile.imageUrl}
                  alt={displayProfile.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <span className="mt-3 rounded-full bg-[#2B4CB3] px-4 py-1 text-xs font-semibold text-white shadow-[0_6px_12px_rgba(43,76,179,0.3)]">
              {displayProfile.role}
            </span>
            <h2 className="mt-4 text-xl font-semibold text-[#1E293B]">{displayProfile.name}</h2>
            <p className="mt-1 text-sm text-[#64748B]">{displayProfile.email}</p>
            {loading ? (
              <p className="mt-2 text-xs font-semibold text-[#64748B]">Loading profile...</p>
            ) : null}
            {error ? (
              <p className="mt-2 text-xs font-semibold text-[#DC2626]">{error}</p>
            ) : null}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white/70">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 text-sm">
              <span className="text-[#64748B]">Batch:</span>
              <span className="font-semibold text-[#1E293B]">
                {displayProfile.batch === '--' ? '--' : `CSE ${displayProfile.batch}`}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 text-sm">
              <span className="text-[#64748B]">Section:</span>
              <span className="font-semibold text-[#1E293B]">{displayProfile.section}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 text-sm">
              <span className="text-[#64748B]">ID:</span>
              <span className="font-semibold text-[#1E293B]">{displayProfile.studentId}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-[#64748B]">Contribution Score:</span>
              <span className="rounded-full bg-[#EF4444] px-4 py-1 text-xs font-semibold text-white">
                {displayProfile.contributionScore}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#1E3A8A] shadow-[0_8px_16px_rgba(15,23,42,0.08)] transition hover:bg-[#1E3A8A] hover:text-white"
            onClick={async () => {
              try {
                await logOut()
                navigate('/')
              } catch (err) {
                setError(err?.message || 'Failed to log out.')
              }
            }}
          >
            Log Out
          </button>
        </section>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#0F172A]/40 px-4">
          <div className="w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0F172A]">Update your profile picture</h2>
              <button
                type="button"
                className="text-sm font-semibold text-[#64748B]"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
            <form className="mt-4 space-y-3" onSubmit={handleAvatarUpload}>
              <label
                htmlFor="profile-avatar"
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-dashed border-[#CBD5F5] bg-[#F8FAFF] px-4 py-3 text-sm text-[#475569]"
              >
                <span className="flex items-center gap-2">
                  <span className="h-8 w-8 overflow-hidden rounded-full border border-[#E2E8F0] bg-white">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : null}
                  </span>
                  Choose image
                </span>
                <span className="rounded-full bg-[#E0E7FF] px-3 py-1 text-xs font-semibold text-[#1E3A8A]">
                  Browse
                </span>
              </label>
              <input
                id="profile-avatar"
                name="avatar"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    if (avatarPreview) {
                      URL.revokeObjectURL(avatarPreview)
                    }
                    const nextPreview = URL.createObjectURL(file)
                    setAvatarPreview(nextPreview)
                  } else {
                    setAvatarPreview('')
                  }
                }}
              />
              {avatarError ? (
                <p className="text-xs font-semibold text-[#DC2626]">{avatarError}</p>
              ) : null}
              <button
                type="submit"
                className="w-full rounded-xl bg-[#1E3A8A] py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Update photo'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default Profile
