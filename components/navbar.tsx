"use client"

"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
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
  Menu,
  X,
} from "lucide-react"
import { useAuth } from "@/app/context/auth-provider"
import { io, Socket } from "socket.io-client"

export function Navbar() {
  const { logout, user } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [unread, setUnread] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const socketRef = useRef<Socket | null>(null)



  useEffect(() => {
    // reflect token presence into local state for UI display
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      setIsLoggedIn(!!token)
    } catch {}
  }, [])

  // Search functionality
  useEffect(() => {
    const searchBooks = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        setShowSearchResults(false)
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`https://book-bazaar-backend-new-1.onrender.com/api/books/search?q=${encodeURIComponent(searchQuery)}&limit=5`)
        if (response.ok) {
          const results = await response.json()
          setSearchResults(results)
          setShowSearchResults(true)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchBooks, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleSearchResultClick = (bookId: string) => {
    setShowSearchResults(false)
    setSearchQuery("")
    window.location.href = `/books/${bookId}`
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSearchResults(false)
      window.location.href = `/books?search=${encodeURIComponent(searchQuery)}`
    }
  }
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              BookBazaar
            </span>
            <span className="text-xs text-muted-foreground -mt-1 hidden sm:block">
              Student Book Exchange
            </span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <div className="flex-1 max-w-md mx-8 hidden lg:block relative">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search textbooks, subjects, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="pl-10 pr-4"
              />
            </div>
          </form>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.map((book) => (
                <div
                  key={book._id}
                  className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0 flex items-center space-x-3"
                  onClick={() => handleSearchResultClick(book._id)}
                >
                  <img
                    src={book.image || "/placeholder.svg?height=40&width=30&text=Book"}
                    alt={book.title}
                    className="w-8 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{book.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">by {book.author}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-primary font-medium">
                        {book.price === 0 ? 'FREE' : `₹${book.price}`}
                      </span>
                      {book.subject && (
                        <span className="text-xs text-muted-foreground ml-2">• {book.subject}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isSearching && (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  Searching...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Navigation Items */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/books/add" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:inline">List Books</span>
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/donate"
                  className="flex items-center space-x-2 text-green-600"
                >
                  <Gift className="h-4 w-4" />
                  <span className="hidden lg:inline">Donate</span>
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild>
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/inbox">
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
                    className="relative h-8 w-8 rounded-full"
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
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Join Community</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search textbooks, subjects, courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    className="pl-10 pr-4"
                  />
                </div>
              </form>
              
              {/* Mobile Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchResults.map((book) => (
                    <div
                      key={book._id}
                      className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0 flex items-center space-x-3"
                      onClick={() => {
                        handleSearchResultClick(book._id)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <img
                        src={book.image || "/placeholder.svg?height=40&width=30&text=Book"}
                        alt={book.title}
                        className="w-8 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{book.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">by {book.author}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-primary font-medium">
                            {book.price === 0 ? 'FREE' : `₹${book.price}`}
                          </span>
                          {book.subject && (
                            <span className="text-xs text-muted-foreground ml-2">• {book.subject}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Navigation Items */}
            {isLoggedIn ? (
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" asChild className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/books/add" className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>List Books</span>
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="justify-start text-green-600" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/donate" className="flex items-center space-x-2">
                    <Gift className="h-4 w-4" />
                    <span>Donate</span>
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/wishlist" className="flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Wishlist</span>
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/inbox" className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Messages</span>
                    {unread > 0 && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                        {unread}
                      </Badge>
                    )}
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/profile" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/my-books" className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>My Books</span>
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/settings" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" asChild className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/signup">Join Community</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
