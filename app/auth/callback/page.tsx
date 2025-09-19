"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const error = urlParams.get('error')

    if (token) {
      // Store the token
      localStorage.setItem('token', token)
      // Redirect to dashboard or home
      router.push('/')
    } else if (error) {
      // Handle error
      console.error('Auth error:', error)
      router.push('/login?error=' + encodeURIComponent(error))
    } else {
      // No token or error, redirect to login
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  )
}