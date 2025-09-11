"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AuthenticatedUser {
  id: string
  username: string
  email: string
  role?: string
  class?: string
  college?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: AuthenticatedUser | null
  login: (token: string, user?: AuthenticatedUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AuthenticatedUser | null>(null)

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      setIsAuthenticated(!!token)
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {}
      }
    } catch {}
  }, [])

  const login = (token: string, userData?: AuthenticatedUser) => {
    localStorage.setItem('token', token)
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    }
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}