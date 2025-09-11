"use client"

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip if pathname is null (shouldn't happen in normal usage)
    if (!pathname) return

    const token = localStorage.getItem('token')
    const publicRoutes = ['/login', '/signup', '/forgot-password', '/auth/callback']
    
    if (!token && !publicRoutes.includes(pathname)) {
      router.replace('/login')
    }
    
    if (token && publicRoutes.includes(pathname)) {
      router.replace('/')
    }
  }, [pathname, router])

  return null
}