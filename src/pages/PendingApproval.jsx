import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { HiOutlineClock, HiOutlineShieldCheck, HiOutlineUserGroup } from 'react-icons/hi2'
import { AuthContext } from '../Provider/AuthProvider.jsx'
import useUserProfile from '../hooks/useUserProfile.js'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

function PendingApproval() {
  const { user, loading: authLoading, logOut } = useContext(AuthContext)
  const { profile, loading: profileLoading } = useUserProfile()
  const [crName, setCrName] = useState('')
  const [crLoading, setCrLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access-token')
    if (!token || !user?.email) {
      return
    }

    const fetchCr = async () => {
      try {
        setCrLoading(true)
        const response = await fetch(`${apiBaseUrl}/users/section-cr`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to load CR info.')
        }
        const data = await response.json()
        setCrName(data?.name || '')
      } catch {
        setCrName('')
      } finally {
        setCrLoading(false)
      }
    }

    fetchCr()
  }, [user?.email])

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F7FAFC]">
        <span className="loading loading-spinner text-[#3BB273] w-12 h-12"></span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  const status = String(profile?.status || '').toLowerCase()
  if (status && status !== 'pending') {
    return <Navigate to="/" replace />
  }

  const displayName = profile?.name || user?.displayName || 'Student'
  const crLabel = crLoading ? 'Loading CR info...' : crName || 'your section CR'

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-16 left-[-160px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle_at_center,#C7D2FE,transparent_60%)] opacity-70 animate-pulse-soft" />
      <div className="pointer-events-none absolute -bottom-24 right-[-140px] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_center,#FDE68A,transparent_60%)] opacity-70 animate-pulse-soft" />
      <div className="pointer-events-none absolute right-16 top-24 hidden h-16 w-16 rounded-full border border-[#E2E8F0] bg-white/70 shadow-[0_12px_30px_rgba(15,23,42,0.12)] lg:block animate-float" />

      <section className="relative mx-auto w-full max-w-[980px] px-4 pb-16 pt-6 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B] shadow-[0_10px_24px_rgba(15,23,42,0.08)] animate-fade-up"
              style={{ animationDelay: '0.05s' }}
            >
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              Approval Pending
            </div>
            <h1
              className="text-3xl font-semibold leading-tight text-[#0F172A] sm:text-4xl animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              Hello {displayName}, your account is waiting for approval.
            </h1>
            <p
              className="max-w-xl text-base text-[#64748B] sm:text-lg animate-fade-up"
              style={{ animationDelay: '0.16s' }}
            >
              Thanks for creating your account. Please wait until we verify your
              batch and section. You will get full access as soon as approval is complete.
            </p>
            <div
              className="rounded-2xl border border-[#E2E8F0] bg-white/95 p-5 text-sm text-[#64748B] shadow-[0_14px_30px_rgba(15,23,42,0.08)] animate-fade-up"
              style={{ animationDelay: '0.22s' }}
            >
              <p className="text-sm font-semibold text-[#0F172A]">Need faster approval?</p>
              <p className="mt-2 text-xs text-[#64748B]">
                Contact your section CR ({crLabel}) for a quicker approval process.
              </p>
            </div>
            <button
              type="button"
              onClick={() => logOut()}
              className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(30,58,138,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(30,58,138,0.3)]"
            >
              Log out
            </button>
          </div>

          <div className="relative">
            <div className="relative space-y-4 rounded-3xl border border-[#E2E8F0] bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.15)] animate-fade-up animate-float" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#1E3A8A]">
                  <HiOutlineClock className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
                    Status
                  </p>
                  <p className="text-lg font-semibold text-[#0F172A]">Pending approval</p>
                </div>
              </div>
              <div className="grid gap-3">
                {[
                  {
                    title: 'Verification in progress',
                    description: 'Your profile is being checked by the department team.',
                    icon: HiOutlineShieldCheck,
                  },
                  {
                    title: 'Section review',
                    description: 'Your section CR confirms your batch and section.',
                    icon: HiOutlineUserGroup,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_12px_26px_rgba(15,23,42,0.08)]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#1E3A8A]">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{item.title}</p>
                      <p className="mt-1 text-xs text-[#64748B]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs text-[#64748B]">
                We will notify you once your status is approved.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PendingApproval
