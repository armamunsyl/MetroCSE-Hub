import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Provider/AuthProvider.jsx'

function Login() {
  const { loginUser, googleLogin } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

  const ensureJwt = async (email) => {
    if (!email) {
      throw new Error('Missing email for token request.')
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
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const form = event.currentTarget
    const email = form.email?.value?.trim()
    const password = form.password?.value

    if (!email || !password) {
      setError('Email and password are required.')
      setSubmitting(false)
      return
    }

    try {
      const credential = await loginUser(email, password)
      const accountEmail = credential?.user?.email || email
      await ensureJwt(accountEmail)
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setSubmitting(true)
    try {
      const credential = await googleLogin()
      const accountEmail = credential?.user?.email
      await ensureJwt(accountEmail)
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Google sign-in failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F6FF] via-[#F6F7FF] to-[#EEF2FF] px-4 py-6 sm:-mt-6 md:-mt-10 lg:-mt-12">
      <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2B4CB3] px-4 pb-3 pt-4 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em]">MetroCSE Hub</p>
          <h1 className="mt-1 text-xl font-semibold">Login</h1>
        </div>

        <div className="px-4 pb-5 pt-3">

          <form className="mt-3 space-y-2.5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-[#334155]" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-4 py-2 text-sm text-[#334155] outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#334155]" htmlFor="login-password">
                  Password
                </label>
                <button type="button" className="text-sm font-semibold text-[#1E3A8A]">
                  Forgot?
                </button>
              </div>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-4 py-2 text-sm text-[#334155] outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
              />
            </div>

            {error ? (
              <p className="text-xs font-semibold text-[#DC2626]">{error}</p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[#1E3A8A] py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(30,58,138,0.28)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? 'Please wait...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-[#94A3B8]">
            <span className="h-px flex-1 bg-[#E2E8F0]" />
            OR
            <span className="h-px flex-1 bg-[#E2E8F0]" />
          </div>

          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border border-[#E2E8F0] bg-white py-2 text-sm font-semibold text-[#334155] shadow-[0_8px_18px_rgba(15,23,42,0.08)] disabled:cursor-not-allowed disabled:opacity-70"
            onClick={handleGoogleLogin}
            disabled={submitting}
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
              <path
                d="M44.5 20H24v8.5h11.9C34.2 33.9 29.7 37 24 37c-7.1 0-13-5.9-13-13s5.9-13 13-13c3.5 0 6.7 1.4 9.1 3.6l6.1-6.1C35.4 5 29.9 2.5 24 2.5 12.4 2.5 3 11.9 3 23.5S12.4 44.5 24 44.5c10.9 0 20-7.9 20-21 0-1.4-.2-2.6-.5-3.5z"
                fill="#EA4335"
              />
              <path
                d="M6.3 14.3l7 5.1C15 16.1 19.2 13 24 13c3.5 0 6.7 1.4 9.1 3.6l6.1-6.1C35.4 5 29.9 2.5 24 2.5c-7.9 0-14.8 4.3-18.4 10.6z"
                fill="#FBBC05"
              />
              <path
                d="M24 44.5c5.5 0 10.7-2.1 14.5-5.7l-6.7-5.5C29.7 37 27 38 24 38c-5.6 0-10.4-3.8-12.1-9l-7 5.4C8.4 40.7 15.7 44.5 24 44.5z"
                fill="#34A853"
              />
              <path
                d="M44.5 20H24v8.5h11.9c-1 2.8-3 5.1-5.6 6.7l6.7 5.5c3.9-3.6 6.5-8.9 6.5-17.2 0-1.4-.2-2.6-.5-3.5z"
                fill="#4285F4"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-3 text-center text-sm text-[#64748B]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-[#1E3A8A]">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Login
