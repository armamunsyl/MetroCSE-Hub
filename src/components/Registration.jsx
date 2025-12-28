import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Provider/AuthProvider.jsx'
import { deleteUser } from 'firebase/auth'

const idSlots = Array.from({ length: 9 }, (_, index) => index)

function Registration() {
  const { createUser, updateUserProfile } = useContext(AuthContext)
  const navigate = useNavigate()
  const idInputRefs = useRef([])
  const [error, setError] = useState('')
  const [idError, setIdError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState('')
  const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

  const handleIdChange = (event, index) => {
    const value = event.target.value.replace(/\D/g, '')
    event.target.value = value
    if (!value) {
      return
    }
    const nextInput = idInputRefs.current[index + 1]
    if (nextInput) {
      nextInput.focus()
    }
  }

  const handleIdKeyDown = (event, index) => {
    if (event.key !== 'Backspace' || event.currentTarget.value) {
      return
    }
    const prevInput = idInputRefs.current[index - 1]
    if (prevInput) {
      prevInput.focus()
    }
  }

  const handleBatchChange = (event) => {
    const value = event.target.value.replace(/\D/g, '')
    event.target.value = value
  }

  const handleSectionChange = (event) => {
    const value = event.target.value.replace(/[^a-zA-Z]/g, '')
    event.target.value = value.toUpperCase()
  }

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIdError('')
    setSubmitting(true)
    let createdUser = null

    const form = event.currentTarget
    const name = form.name?.value?.trim()
    const email = form.email?.value?.trim()
    const password = form.password?.value
    const batch = form.batch?.value?.trim()
    const section = form.section?.value?.trim()
    const gender = form.gender?.value
    const studentId = idInputRefs.current.map((input) => input?.value || '').join('')
    const avatarFile = form.avatar?.files?.[0]

    if (!name || !email || !password || !batch || !section || !gender || studentId.length !== 9) {
      setError('Please fill in all fields correctly.')
      setSubmitting(false)
      return
    }

    try {
      const checkResponse = await fetch(
        `${apiBaseUrl}/users/check?studentId=${encodeURIComponent(studentId)}`,
      )
      if (!checkResponse.ok) {
        throw new Error('Failed to verify student ID.')
      }
      const checkData = await checkResponse.json()
      if (checkData?.exists) {
        setIdError('This ID user already exists.')
        setSubmitting(false)
        return
      }

      const jwtResponse = await fetch(`${apiBaseUrl}/jwt`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!jwtResponse.ok) {
        throw new Error('Failed to get access token.')
      }

      const jwtData = await jwtResponse.json()
      if (jwtData?.token) {
        localStorage.setItem('access-token', jwtData.token)
        window.dispatchEvent(new Event('auth-token-updated'))
      }

      let imageUrl = ''
      if (avatarFile) {
        const imageData = new FormData()
        imageData.append('image', avatarFile)
        const uploadResponse = await fetch(`${apiBaseUrl}/upload/avatar`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${jwtData?.token || ''}`,
          },
          body: imageData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload profile image.')
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData?.url || ''
      }

      const credential = await createUser(email, password)
      createdUser = credential?.user || null

      await updateUserProfile(name, imageUrl)

      const userPayload = {
        name,
        email,
        imageUrl,
        gender,
        studentId,
        batch,
        section,
      }

      const userResponse = await fetch(`${apiBaseUrl}/users`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${jwtData?.token || ''}`,
        },
        body: JSON.stringify(userPayload),
      })

      if (!userResponse.ok) {
        throw new Error('Failed to save user profile.')
      }

      navigate('/')
    } catch (err) {
      localStorage.removeItem('access-token')
      window.dispatchEvent(new Event('auth-token-updated'))
      if (createdUser) {
        try {
          await deleteUser(createdUser)
        } catch {
          // Ignore cleanup errors; we'll surface the original error.
        }
      }
      const message =
        err?.message === 'Failed to fetch'
          ? `Cannot reach server at ${apiBaseUrl}. Check backend is running.`
          : err?.message || 'Registration failed. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F6FF] via-[#F6F7FF] to-[#EEF2FF] px-4 py-3 sm:-mt-8 md:-mt-12 lg:-mt-14">
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.12)] sm:max-w-[400px]">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2B4CB3] px-4 pb-2 pt-2.5 text-center text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">MetroCSE Hub</p>
          <h1 className="mt-0.5 text-sm font-semibold sm:text-base">Register</h1>
        </div>

        <div className="px-4 pb-4 pt-3">
          <form className="space-y-2 sm:space-y-2.5" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold text-[#334155] sm:text-sm" htmlFor="reg-name">
                Name
              </label>
              <input
                id="reg-name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                className="mt-1 w-full rounded-2xl border border-[#E2E8F0] px-3 py-1 text-xs text-[#334155] outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 sm:px-3.5 sm:py-1.5 sm:text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] sm:text-sm">ID</label>
              <div className="mt-1 grid grid-cols-9 gap-1">
                {idSlots.map((slot) => (
                  <input
                    key={`id-slot-${slot}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="h-7 w-full rounded-lg border border-[#E2E8F0] text-center text-xs text-[#334155] outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 sm:h-8 sm:text-sm"
                    aria-label={`ID digit ${slot + 1}`}
                    ref={(el) => {
                      idInputRefs.current[slot] = el
                    }}
                    onChange={(event) => handleIdChange(event, slot)}
                    onKeyDown={(event) => handleIdKeyDown(event, slot)}
                  />
                ))}
              </div>
              {idError ? (
                <p className="mt-1 text-xs font-semibold text-[#DC2626]">{idError}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-xs font-semibold text-[#334155] sm:text-sm" htmlFor="reg-batch">
                  Batch
                </label>
                <input
                  id="reg-batch"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="batch"
                  placeholder="e.g. 61"
                  className="mt-1 w-full rounded-2xl border border-[#E2E8F0] px-3 py-1 text-xs text-[#334155] outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 sm:px-3.5 sm:py-1.5 sm:text-sm"
                  onChange={handleBatchChange}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#334155] sm:text-sm" htmlFor="reg-section">
                  Section
                </label>
                <input
                  id="reg-section"
                  type="text"
                  name="section"
                  placeholder="A"
                  className="mt-1 w-full rounded-2xl border border-[#E2E8F0] px-3 py-1 text-xs text-[#334155] outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 sm:px-3.5 sm:py-1.5 sm:text-sm"
                  onChange={handleSectionChange}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] sm:text-sm" htmlFor="reg-avatar">
                Upload profile image
              </label>
              <label
                htmlFor="reg-avatar"
                className="mt-1 flex w-full cursor-pointer items-center justify-between rounded-2xl border border-dashed border-[#CBD5F5] bg-[#F8FAFF] px-3 py-1 text-xs text-[#475569] transition hover:border-[#1E3A8A] sm:px-3.5 sm:py-1.5 sm:text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="h-6 w-6 overflow-hidden rounded-full border border-[#E2E8F0] bg-white">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : null}
                  </span>
                  Choose file
                </span>
                <span className="rounded-full bg-[#E0E7FF] px-2 py-0.5 text-[10px] font-semibold text-[#1E3A8A] sm:px-3 sm:py-1 sm:text-xs">
                  Browse
                </span>
              </label>
              <input
                id="reg-avatar"
                name="avatar"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    const nextPreview = URL.createObjectURL(file)
                    setAvatarPreview(nextPreview)
                  } else {
                    setAvatarPreview('')
                  }
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] sm:text-sm" htmlFor="reg-email">
                Email
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full rounded-2xl border border-[#E2E8F0] px-3 py-1 text-xs text-[#334155] outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 sm:px-3.5 sm:py-1.5 sm:text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] sm:text-sm" htmlFor="reg-password">
                Password
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                placeholder="Create a password"
                className="mt-1 w-full rounded-2xl border border-[#E2E8F0] px-3 py-1 text-xs text-[#334155] outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 sm:px-3.5 sm:py-1.5 sm:text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] sm:text-sm" htmlFor="reg-gender">
                Gender
              </label>
              <select
                id="reg-gender"
                name="gender"
                className="mt-1 w-full rounded-2xl border border-[#E2E8F0] bg-white px-3 py-1 text-xs text-[#334155] outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 sm:px-3.5 sm:py-1.5 sm:text-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {error ? (
              <p className="text-xs font-semibold text-[#DC2626]">{error}</p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[#1E3A8A] py-1.5 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
              disabled={submitting}
            >
              {submitting ? 'Please wait...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-2 text-center text-xs text-[#64748B] sm:text-sm">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-[#1E3A8A]">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Registration
