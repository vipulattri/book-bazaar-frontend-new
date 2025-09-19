"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/auth-provider"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    const search = typeof window !== 'undefined' ? window.location.search : ''
    const token = new URLSearchParams(search).get('token')
    if (!token) {
      router.replace('/login?error=missing_token')
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('https://book-bazaar-backend-new-1.onrender.com/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok || !data.user) {
          router.replace('/login?error=profile_fetch_failed')
          return
        }
        login(token, data.user)
        router.replace('/')
      } catch {
        router.replace('/login?error=network')
      }
    }

    fetchUser()
  }, [router, login])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in...</p>
    </div>
  )
}


