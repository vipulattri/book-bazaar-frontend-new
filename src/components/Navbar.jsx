"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "next/link"
import { gsap } from "gsap"
import { GraduationCap, Search, Heart, MessageCircle, Plus, Gift, Menu, X, User } from "lucide-react"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  // User data from login API
  const [userData, setUserData] = useState({
    id: null,
    username: "",
    email: "",
    role: "",
    avatar: null, // URL to user's profile picture if available
    unreadMessages: 0,
    major: "",
    year: ""
  })
  const [authToken, setAuthToken] = useState(null)

  const navRef = useRef(null)
  const logoRef = useRef(null)
  const searchRef = useRef(null)
  const menuRef = useRef(null)

  // Function to get user initials from username or email
  const getUserInitials = (username, email) => {
    if (username && username.length >= 2) {
      return username.substring(0, 2).toUpperCase()
    } else if (email) {
      return email.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  // Function to check if user is logged in and load user data from localStorage
  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('authToken')
      const user = localStorage.getItem('userData')
      
      if (token && user) {
        setAuthToken(token)
        const parsedUser = JSON.parse(user)
        setUserData({
          ...parsedUser,
          // Set default values if these fields don't exist
          major: parsedUser.major || "Computer Science",
          year: parsedUser.year || "3rd Year",
          avatar: parsedUser.avatar || null,
          unreadMessages: parsedUser.unreadMessages || 0
        })
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      setIsLoggedIn(false)
    }
  }

  // Function to handle login (you can call this after successful login)
  const handleLogin = (token, userData) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify({
      ...userData,
      // You can add additional fields here or get them from the API
      major: userData.major || "Computer Science",
      year: userData.year || "3rd Year"
    }))
    setAuthToken(token)
    setUserData({
      ...userData,
      major: userData.major || "Computer Science",
      year: userData.year || "3rd Year",
      avatar: userData.avatar || null,
      unreadMessages: userData.unreadMessages || 0
    })
    setIsLoggedIn(true)
  }

  // Function to handle logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      setAuthToken(null)
      setUserData({
        id: null,
        username: "",
        email: "",
        role: "",
        avatar: null,
        unreadMessages: 0,
        major: "",
        year: ""
      })
      setIsLoggedIn(false)
      setShowUserMenu(false)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  // Function to load additional user data (messages count, etc.)
  const loadAdditionalUserData = async () => {
    if (!authToken) return
    
    try {
      // Load unread messages count
      const messagesResponse = await fetch(' https://book-bazaar-backend-new-1.onrender.com/api/messages/unread', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json()
        setUserData(prev => ({
          ...prev,
          unreadMessages: messagesData.count || 0
        }))
      }
    } catch (error) {
      console.error("Error loading additional user data:", error)
    }
  }

  useEffect(() => {
    // Check authentication status on component mount
    checkAuthStatus()
    
    const ctx = gsap.context(() => {
      // Navbar entrance animation
      gsap.fromTo(navRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" })

      // Logo animation
      gsap.fromTo(
        logoRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)", delay: 0.3 },
      )

      // Search bar animation
      gsap.fromTo(
        searchRef.current,
        { width: 0, opacity: 0 },
        { width: "100%", opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 },
      )

      // Menu items stagger animation
      gsap.fromTo(
        menuRef.current.children,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.7 },
      )
    }, navRef)

    return () => ctx.revert()
  }, [])

  // Load additional user data when user is logged in
  useEffect(() => {
    if (isLoggedIn && authToken) {
      loadAdditionalUserData()
    }
  }, [isLoggedIn, authToken])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)

    if (!isMobileMenuOpen) {
      gsap.fromTo(
        ".mobile-menu",
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" },
      )
    } else {
      gsap.to(".mobile-menu", { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" })
    }
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div ref={logoRef}>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BookBazaar
              </span>
              <span className="text-xs text-gray-500 -mt-1">Student Book Exchange</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div ref={searchRef} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search textbooks, subjects, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div ref={menuRef} className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/books/add"
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"
                >
                  <Plus className="h-4 w-4" />
                  <span>List Books</span>
                </Link>

                <Link
                  to="/donate"
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-200 hover:scale-105 transform"
                >
                  <Gift className="h-4 w-4" />
                  <span>Donate</span>
                </Link>

                <Link
                  to="/wishlist"
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:scale-110 transform"
                >
                  <Heart className="h-5 w-5" />
                </Link>

                <Link
                  to="/inbox"
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:scale-110 transform"
                >
                  <MessageCircle className="h-5 w-5" />
                  {userData.unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                      {userData.unreadMessages}
                    </span>
                  )}
                </Link>

                {/* User Profile Menu */}
                <div className="relative">
                  <button 
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    {userData.avatar ? (
                      <img 
                        src={userData.avatar} 
                        alt={userData.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getUserInitials(userData.username, userData.email)}
                      </div>
                    )}
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          {userData.avatar ? (
                            <img 
                              src={userData.avatar} 
                              alt={userData.username}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {getUserInitials(userData.username, userData.email)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {userData.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              {userData.major} - {userData.year}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {userData.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          Your Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Settings
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 hover:scale-105 transform"
                >
                  Join Community
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search textbooks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {isLoggedIn && (
                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt={userData.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getUserInitials(userData.username, userData.email)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userData.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userData.major} - {userData.year}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userData.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Link
                  to="/books"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Find Books
                </Link>
                <Link
                  to="/books/add"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  List Books
                </Link>
                <Link
                  to="/donate"
                  className="block px-3 py-2 text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  Donate Books
                </Link>
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar