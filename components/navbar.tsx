"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  GraduationCap,
  Search,
  Heart,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Plus,
  Gift,
} from "lucide-react"
import { useAuth } from "@/app/context/auth-provider"
import { io, Socket } from "socket.io-client"

export function Navbar() {
  const { logout, user } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [unread, setUnread] = useState(0)
  const socketRef = useRef<Socket | null>(null)
  const navRef = useRef(null)

  useEffect(() => {
    const navElements = gsap.utils.toArray(".nav-item")
    gsap.from(navElements, {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power3.out",
    })
  }, [])

  useEffect(() => {
    // reflect token presence into local state for UI display
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      setIsLoggedIn(!!token)
    } catch {}
  }, [])

  // Live notifications
  useEffect(() => {
    if (!user?.id) return
    const socket = io("https://book-bazaar-backend-nem0.onrender.com", { transports: ["websocket"], query: { userId: user.id } })
    socketRef.current = socket
    socket.on('notify:new-message', () => {
      setUnread(prev => prev + 1)
    })
    return () => { socket.disconnect() }
  }, [user?.id])

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
  }

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between nav-item">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 nav-item">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              BookBazaar
            </span>
            <span className="text-xs text-muted-foreground -mt-1">
              Student Book Exchange
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8 nav-item">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search textbooks, subjects, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-4 nav-item">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild className="nav-item">
                <Link href="/books/add" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">List Books</span>
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild className="nav-item">
                <Link
                  href="/donate"
                  className="flex items-center space-x-2 text-green-600"
                >
                  <Gift className="h-4 w-4" />
                  <span className="hidden sm:inline">Donate</span>
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild className="nav-item">
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild className="relative nav-item">
                <Link href="/messages">
                  <MessageCircle className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] bg-red-600 text-white rounded-full px-1.5 py-0.5">{unread}</span>
                  )}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full nav-item"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt={user?.username || "User"} />
                      <AvatarFallback>{(user?.username || 'U').slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.username || 'User'}
                      </p>
                      {user?.college && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.college}{user?.class ? ` • ${user.class}` : ''}
                        </p>
                      )}
                      {user?.email && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-books" className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      My Books
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2 nav-item">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Join Community</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
