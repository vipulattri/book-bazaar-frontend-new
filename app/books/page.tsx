"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Star, Filter, Grid, List, GraduationCap, Gift, Plus, AlertTriangle, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/app/context/auth-provider"
import BuyerSellerChat from "@/app/messages/page"
import SellerChat from "@/app/components/SellerChat"
import io, { Socket } from "socket.io-client"

interface Book {
  _id?: string;
  title?: string;
  author?: string;
  genre?: string;
  condition?: string;
  price?: number;
  Subject?: string;
  image?: string;
  userId?: any;
  createdAt?: string;
  originalPrice?: number;
  course?: string;
  rating?: number;
  seller?: string;
  year?: string;
  university?: string;
  Address?: string;
  phone?: string;
  email?: string;
  description?: string;
  name?: string;
  Name?: string;
}

function BooksPageContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || "")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [showDonationsOnly, setShowDonationsOnly] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [chatPartners, setChatPartners] = useState<Record<string, string>>({})
  const [loadingPartners, setLoadingPartners] = useState<Record<string, boolean>>({})
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [bookNotifications, setBookNotifications] = useState<{[bookId: string]: number}>({})
  const socketRef = useRef<Socket | null>(null)
  
  // New book form state with user info from auth
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "Mathematics",
    condition: "Good",
    price: 0,
    Subject: "",
    image: "",
    Address: user?.college || "",
    phone: "",
    description: "",
    isDonation: false,
    name: user?.username || "",
    email: user?.email || ""
  })

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        let url = `https://book-bazaar-backend-new-1.onrender.com/api/books?`
        
        // Add filters to the URL
        const params = new URLSearchParams()
        
        if (searchQuery) params.append('search', searchQuery)
        if (selectedGenre !== "all") params.append('genre', selectedGenre)
        if (selectedCondition !== "all") params.append('condition', selectedCondition)
        if (priceRange[0] > 0 || priceRange[1] < 200) {
          params.append('minPrice', priceRange[0].toString())
          params.append('maxPrice', priceRange[1].toString())
        }
        if (showDonationsOnly) params.append('price', '0')
        if (sortOption) params.append('sort', sortOption)

        const response = await fetch(`${url}${params.toString()}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        const transformedBooks = data.map((book: Book) => ({
          ...book,
          id: book._id,
          subject: book.Subject || book.genre,
          originalPrice: book.originalPrice || (book.price ? Math.round(book.price * 1.2) : undefined),
          rating: book.rating || 4.0,
          seller: (book as any)?.userId?.username || (book as any)?.name || (book as any)?.Name || "Anonymous",
          year: book.year,
          university: book.university,
          isDonation: book.price === 0,
          course: book.course || `${book.Subject?.substring(0, 3).toUpperCase() || "GEN"} 101`,
          email: (book as any)?.userId?.email || (book as any)?.email,
          description: book.description || `This ${String(book.condition || '').toLowerCase()} condition book is ${book.price === 0 ? 'being donated' : 'available for sale'}. ${book.title} by ${book.author} is a great resource for ${book.course}.`,
          name: (book as any)?.userId?.username || (book as any)?.name || (book as any)?.Name || "Anonymous"
        }))
        
        setBooks(transformedBooks)
        setError("")
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchBooks()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, selectedGenre, selectedCondition, priceRange, showDonationsOnly, sortOption])

  // Socket connection for book-specific notifications
  useEffect(() => {
    if (!user?.id) return
    
    const socket = io("https://book-bazaar-backend-new-1.onrender.com", {
      transports: ["websocket"],
      query: { userId: user.id }
    })
    socketRef.current = socket
    
    socket.on('notify:new-message', (notification) => {
      const conversationId = notification.conversationId
      const bookId = conversationId.includes('|') ? conversationId.split('|')[0] : ''
      const base = conversationId.includes('|') ? conversationId.split('|')[1] : conversationId
      const [userId1, userId2] = base.split(':')
      
      if (userId1 === user.id || userId2 === user.id) {
        const otherUserId = userId1 === user.id ? userId2 : userId1
        try {
          const key = 'lastChatPartnerByBook'
          const map = JSON.parse(localStorage.getItem(key) || '{}')
          if (bookId && otherUserId) {
            map[bookId] = otherUserId
            localStorage.setItem(key, JSON.stringify(map))
          }
        } catch {}
        
        const book = books.find(b => b._id === bookId)
        if (book) {
          setBookNotifications(prev => ({
            ...prev,
            [book._id!]: (prev[book._id!] || 0) + 1
          }))
        }
      }
    })
    
    return () => {
      socket.disconnect()
    }
  }, [user?.id, books])

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
    setIsBookDialogOpen(true)
  }

  const fetchChatPartner = async (bookId: string, sellerId: string) => {
    if (!user?.id || loadingPartners[bookId]) return
    
    setLoadingPartners(prev => ({ ...prev, [bookId]: true }))
    
    try {
      // First check localStorage
      const key = 'lastChatPartnerByBook'
      const map = JSON.parse(localStorage.getItem(key) || '{}')
      if (map[bookId] && map[bookId] !== user.id) {
        setChatPartners(prev => ({ ...prev, [bookId]: map[bookId] }))
        return
      }
      
      // If not in localStorage, check server
      const token = localStorage.getItem('token')
      const res = await fetch(`https://book-bazaar-backend-new-1.onrender.com/api/messages/partner?bookId=${bookId}&sellerId=${sellerId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data?.buyerId) {
          // Update both state and localStorage
          setChatPartners(prev => ({ ...prev, [bookId]: data.buyerId }))
          map[bookId] = data.buyerId
          localStorage.setItem(key, JSON.stringify(map))
        }
      }
    } catch (error) {
      console.error('Error fetching chat partner:', error)
    } finally {
      setLoadingPartners(prev => ({ ...prev, [bookId]: false }))
    }
  }

  const handleChatClick = (book: Book, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedBook(book)
    setIsChatOpen(true)
    // Clear notification for this book
    setBookNotifications(prev => ({
      ...prev,
      [book._id!]: 0
    }))
  }

  const handleSortChange = (value: string) => {
    setSortOption(value)
  }

  const handleNewBookChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewBook(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }))
    if (submitError) setSubmitError("")
  }

  // Update form when user changes
  useEffect(() => {
    setNewBook(prev => ({
      ...prev,
      Address: user?.college || prev.Address,
      name: user?.username || prev.name,
      email: user?.email || prev.email
    }))
  }, [user])

  const handleSelectChange = (name: string, value: string) => {
    setNewBook(prev => ({
      ...prev,
      [name]: value
    }))
    if (submitError) setSubmitError("")
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setNewBook(prev => ({
      ...prev,
      [name]: checked,
      price: checked ? 0 : prev.price
    }))
    if (submitError) setSubmitError("")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!newBook.title.trim() && !newBook.author.trim()) {
      setSubmitError('Please provide either a book title or author name')
      return false
    }
    if (!newBook.Address.trim()) {
      setSubmitError('Please provide your address')
      return false
    }
    if (!newBook.phone.trim()) {
      setSubmitError('Please provide your phone number')
      return false
    }
    return true
  }

  const handleSubmitNewBook = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const formData = new FormData();
      if (newBook.title.trim()) formData.append('title', newBook.title.trim());
      if (newBook.author.trim()) formData.append('author', newBook.author.trim());
      formData.append('genre', newBook.genre);
      formData.append('condition', newBook.condition);
      formData.append('price', newBook.isDonation ? '0' : newBook.price.toString());
      if (newBook.Subject.trim()) formData.append('Subject', newBook.Subject.trim());
      formData.append('Address', newBook.Address.trim());
      formData.append('phone', newBook.phone.trim());
      if (newBook.description?.trim()) formData.append('description', newBook.description.trim());
      formData.append('isDonation', newBook.isDonation.toString());
      if (newBook.name.trim()) formData.append('name', newBook.name.trim());
      if (newBook.email.trim()) formData.append('email', newBook.email.trim());
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('jwt') || sessionStorage.getItem('authToken') || sessionStorage.getItem('token')) : null

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://book-bazaar-backend-new-1.onrender.com/api/books', {
        method: 'POST',
        headers,
        body: formData,
      })

      let responseData
      try {
        responseData = await response.json()
      } catch (jsonError) {
        responseData = { message: 'Invalid server response' }
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to post a book.')
        }
        throw new Error(responseData.message || responseData.error || `Server error: ${response.status}`)
      }

      // Success - refresh the book list
      setSearchQuery("")
      setSelectedGenre("all")
      setSelectedCondition("all")
      setPriceRange([0, 200])
      setShowDonationsOnly(false)
      setSortOption("newest")
      setIsDialogOpen(false)
      
      // Reset form
      setNewBook({
        title: "",
        author: "",
        genre: "Mathematics",
        condition: "Good",
        price: 0,
        Subject: "",
        image: "",
        Address: user?.college || "",
        phone: "",
        description: "",
        isDonation: false,
        name: user?.username || "",
        email: user?.email || ""
      })
      setImageFile(null)
      setImagePreview(null)

      console.log('Book added successfully!')
      
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitError(err instanceof Error ? err.message : 'Failed to add book. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 flex justify-center">
          <div className="text-center">Loading books...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 flex justify-center">
          <div className="text-center text-red-500">{error}</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Find Your Books
              </h3>

              {/* Search */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Course code, title, author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Genre Filter */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Genre</label>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="All genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All genres</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                    <SelectItem value="Literature">Literature</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Condition Filter */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Condition</label>
                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="All conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All conditions</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Very Good">Very Good</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <Slider 
                  value={priceRange} 
                  onValueChange={setPriceRange} 
                  max={200} 
                  step={5} 
                  className="w-full" 
                />
              </div>

              {/* Donations Only */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="donations"
                  checked={showDonationsOnly}
                  onChange={(e) => setShowDonationsOnly(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="donations" className="text-sm font-medium flex items-center">
                  <Gift className="h-4 w-4 mr-1 text-green-600" />
                  Free books only
                </label>
              </div>

              {/* Post New Book Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4" variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Book
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>List a New Book</DialogTitle>
                    <DialogDescription>
                      Fill in the details of the book you want to sell or donate.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-red-700 text-sm">{submitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitNewBook}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          value={newBook.title || ""}
                          onChange={handleNewBookChange}
                          className="col-span-3"
                          placeholder="Enter book title"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="author" className="text-right">
                          Author
                        </Label>
                        <Input
                          id="author"
                          name="author"
                          value={newBook.author || ""}
                          onChange={handleNewBookChange}
                          className="col-span-3"
                          placeholder="Enter author name"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground col-span-4 -mt-2">
                        * Either title or author must be provided
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="genre" className="text-right">
                          Genre*
                        </Label>
                        <Select 
                          value={newBook.genre}
                          onValueChange={(value) => handleSelectChange('genre', value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select genre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Biology">Biology</SelectItem>
                            <SelectItem value="Physics">Physics</SelectItem>
                            <SelectItem value="Economics">Economics</SelectItem>
                            <SelectItem value="Literature">Literature</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="condition" className="text-right">
                          Condition*
                        </Label>
                        <Select 
                          value={newBook.condition}
                          onValueChange={(value) => handleSelectChange('condition', value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Like New">Like New</SelectItem>
                            <SelectItem value="Very Good">Very Good</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Subject" className="text-right">
                          Subject
                        </Label>
                        <Input
                          id="Subject"
                          name="Subject"
                          value={newBook.Subject || ""}
                          onChange={handleNewBookChange}
                          className="col-span-3"
                          placeholder="e.g., Calculus, Programming"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={newBook.description || ""}
                          onChange={handleNewBookChange}
                          className="col-span-3"
                          placeholder="Enter book description"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">
                          Book Image
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="col-span-3"
                          />
                          {imagePreview && (
                            <div className="mt-2">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="h-32 object-cover rounded-md"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Your Name*
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={newBook.name || ""}
                          onChange={handleNewBookChange}
                          className="col-span-3"
                          required
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Your Email*
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={newBook.email || ""}
                          onChange={handleNewBookChange}
                          className="col-span-3"
                          required
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Address" className="text-right">
                          Your Address*
                        </Label>
                        <Textarea
                          id="Address"
                          name="Address"
                          value={newBook.Address || ""}
                          onChange={handleNewBookChange}
                          className="col-span-3"
                          required
                          placeholder="Enter your address"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone Number*
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={newBook.phone || ""}
                          onChange={handleNewBookChange}
                          className="col-span-3"
                          required
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="isDonation" className="text-right">
                          Donate for Free
                        </Label>
                        <div className="col-span-3 flex items-center">
                          <input
                            type="checkbox"
                            id="isDonation"
                            name="isDonation"
                            checked={newBook.isDonation}
                            onChange={handleCheckboxChange}
                            className="rounded mr-2"
                          />
                          <label htmlFor="isDonation" className="text-sm">
                            Check this if you're donating the book (price will be set to ₹0)
                          </label>
                        </div>
                      </div>
                      {!newBook.isDonation && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">
                            Price (₹)*
                          </Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            value={newBook.price || ""}
                            onChange={handleNewBookChange}
                            className="col-span-3"
                            min="0"
                            step="0.01"
                            required={!newBook.isDonation}
                            disabled={newBook.isDonation}
                            placeholder="0.00"
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Posting..." : "Post Book"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Student Textbooks</h1>
                <p className="text-muted-foreground">
                  {books.length} {books.length === 1 ? 'book' : 'books'} available
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Books Grid */}
            {books.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No books found matching your criteria</p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedGenre("all")
                    setSelectedCondition("all")
                    setPriceRange([0, 200])
                    setShowDonationsOnly(false)
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {books.map((book) => (
                  <Card 
                    key={book._id} 
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleBookClick(book)}
                  >
                    <div className={`${viewMode === "list" ? "flex" : ""}`}>
                      <div className={`relative overflow-hidden ${viewMode === "list" ? "w-32 flex-shrink-0" : ""}`}>
                        <img
                          src={book.image || "/placeholder.svg?height=300&width=200&text=Book"}
                          alt={book.title}
                          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                            viewMode === "list" ? "w-full h-40" : "w-full h-64"
                          }`}
                        />
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={async (e) => {
                              e.stopPropagation()
                              try {
                                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
                                if (!token) { alert('Please login to use wishlist'); return }
                                const res = await fetch('https://book-bazaar-backend-new-1.onrender.com/api/wishlist/add', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                  body: JSON.stringify({ bookId: (book as any)?._id })
                                })
                                if (res.ok) {
                                  setBookNotifications(prev => ({ ...prev }))
                                }
                              } catch {}
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          {/* Chat Now button with notification badge */}
                          <div className="relative">
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="h-8 w-8 rounded-full"
                              onClick={(e) => handleChatClick(book, e)}
                              title="Chat Now"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            {bookNotifications[book._id!] > 0 && (
                              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500 text-white">
                                {bookNotifications[book._id!]}
                              </Badge>
                            )}
                          </div>
                          {book.price === 0 && (
                            <Badge className="bg-green-500 text-white">
                              <Gift className="h-3 w-3 mr-1" />
                              FREE
                            </Badge>
                          )}
                        </div>
                        <Badge className="absolute top-2 left-2" variant="secondary">
                          {book.condition}
                        </Badge>
                      </div>

                      <div className="flex-1">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(Number(book.rating)) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">({book.rating})</span>
                          </div>

                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>

                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {book.course}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {book.Subject || book.genre}
                            </Badge>
                          </div>

                          <div className="mb-3">
                            {book.price === 0 ? (
                              <div className="flex items-center">
                                <span className="text-2xl font-bold text-green-600">FREE</span>
                                {book.originalPrice && (
                                  <span className="text-sm text-muted-foreground ml-2 line-through">
                                    ₹{book.originalPrice}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <span className="text-2xl font-bold text-primary">₹{(book.price ?? 0)}</span>
                                {book.originalPrice && (
                                  <>
                                    <span className="text-sm text-muted-foreground ml-2 line-through">
                                      ₹{book.originalPrice ?? 0}
                                    </span>
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                      Save ₹{(((book.originalPrice ?? 0) - (book.price ?? 0)).toFixed(2))}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              <span>{book.name || book.seller}</span>
                            </div>
                            {book.Address && (
                              <div className="flex items-start">
                                <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2">{book.Address}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Details Dialog */}
      <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedBook.title}</DialogTitle>
                <DialogDescription>
                  by {selectedBook.author} • {selectedBook.genre}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={selectedBook.image || "/placeholder.svg?height=600&width=400&text=Book"}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {selectedBook.price === 0 && (
                        <Badge className="bg-green-500 text-white">
                          <Gift className="h-3 w-3 mr-1" />
                          FREE
                        </Badge>
                      )}
                      <Badge variant="secondary">
                        {selectedBook.condition}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedBook.phone || '');
                        alert(`Phone number ${selectedBook.phone || 'N/A'} copied to clipboard!`);
                      }}
                    >
                      {selectedBook.price === 0 ? "Request Book" : "Contact Seller"}
                    </Button>
                    <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                      <DialogTrigger asChild>
                        {(() => {
                          const sellerId = (selectedBook as any)?.userId?._id || (selectedBook as any)?.userId
                          const isSeller = sellerId && (user as any)?.id && sellerId === (user as any)?.id
                          return (
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                if (isSeller && selectedBook?._id) {
                                  fetchChatPartner(selectedBook._id, sellerId)
                                }
                              }}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" /> {isSeller ? 'Contact Buyer' : 'Chat with Seller'}
                            </Button>
                          )
                        })()}
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Chat with Seller</DialogTitle>
                          <DialogDescription>Start a conversation about this book.</DialogDescription>
                        </DialogHeader>
                        {selectedBook && (
                          <div className="space-y-4">
                            {/* Book image and info at top */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                              <img
                                src={selectedBook.image || "/placeholder.svg?height=100&width=75&text=Book"}
                                alt={selectedBook.title}
                                className="w-16 h-20 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{selectedBook.title}</h3>
                                <p className="text-sm text-gray-600">by {selectedBook.author}</p>
                                <p className="text-sm font-medium text-green-600">
                                  {selectedBook.price === 0 ? "FREE" : `₹${selectedBook.price}`}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Book ID: {(selectedBook as any)?._id}</p>
                              </div>
                            </div>
                            {/* Chat component */}
                            {(() => {
                              const sellerId = (selectedBook as any)?.userId?._id || (selectedBook as any)?.userId || ""
                              const currentUserIdLocal = (user as any)?.id || ""
                              const isSeller = sellerId && currentUserIdLocal && sellerId === currentUserIdLocal
                              
                              console.log('🔍 Books page: Chat component rendering check')
                              console.log('  - Seller ID:', sellerId)
                              console.log('  - Current User ID:', currentUserIdLocal)
                              console.log('  - Is Seller:', isSeller)
                              console.log('  - Selected Book ID:', (selectedBook as any)?._id)
                              
                              if (!sellerId) {
                                console.log('❌ Books page: No seller ID found')
                                return (
                                  <div className="text-sm text-gray-600 p-3 border rounded">
                                    Unable to load seller information.
                                  </div>
                                )
                              }
                              
                              if (!isSeller) {
                                console.log('👤 Books page: Rendering buyer chat component')
                                // For buyers, create conversation with seller
                                const conversationId = `${selectedBook._id}|${[sellerId, currentUserIdLocal].sort().join(":")}`
                                return <BuyerSellerChat conversationId={conversationId} />
                              }
                              
                              // For sellers, use specialized seller chat component
                              if (isSeller) {
                                console.log('🏪 Books page: Rendering seller chat component')
                                console.log('  - Props: bookId =', selectedBook._id, ', sellerId =', currentUserIdLocal)
                                return (
                                  <div className="space-y-3">
                                    <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-3">
                                      <div className="flex items-center mb-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        <strong>Seller Dashboard</strong>
                                      </div>
                                      <p className="text-xs">This shows all conversations with buyers interested in this book.</p>
                                    </div>
                                    
                                    <SellerChat 
                                      bookId={selectedBook._id!}
                                      sellerId={currentUserIdLocal}
                                    />
                                  </div>
                                )
                              }
                            })()}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">
                          {selectedBook.price === 0 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            <>
                              ₹{selectedBook.price}
                              {selectedBook.originalPrice && (
                                <span className="text-muted-foreground ml-2 line-through">
                                  ₹{selectedBook.originalPrice}
                                </span>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Course</p>
                        <p className="font-medium">{selectedBook.course}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Subject</p>
                        <p className="font-medium">{selectedBook.Subject || selectedBook.genre}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">University</p>
                        <p className="font-medium">{selectedBook.university}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Year</p>
                        <p className="font-medium">{selectedBook.year}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Posted</p>
                        <p className="font-medium">
                          {selectedBook && selectedBook.createdAt ? new Date(String(selectedBook.createdAt)).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedBook.description || "No description provided."}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-2">Seller Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedBook.name || selectedBook.seller}</span>
                      </div>
                      {selectedBook.Address && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedBook.Address}</span>
                        </div>
                      )}
                      {selectedBook.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedBook.phone}</span>
                        </div>
                      )}
                      {selectedBook.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedBook.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}

export default function BooksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <div className="container py-8 flex justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    }>
      <BooksPageContent />
    </Suspense>
  )
}