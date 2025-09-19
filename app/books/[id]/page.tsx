"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Heart,
  MessageCircle,
  ArrowLeft,
  User,
  Book as BookIcon,
  Calendar,
  Tag,
  Gift
} from "lucide-react"
import { useAuth } from "@/app/context/auth-provider"

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  condition: string;
  price: number;
  subject?: string;
  image?: string;
  userId?: any;
  createdAt: string;
  address?: string;
  phone?: string;
  email?: string;
  name?: string;
  description?: string;
}

export default function BookDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://book-bazaar-backend-new-1.onrender.com/api/books`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const books = await response.json()
        const foundBook = books.find((b: Book) => b._id === params.id)
        
        if (!foundBook) {
          throw new Error('Book not found')
        }
        
        setBook(foundBook)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBook()
    }
  }, [params.id])

  const handleChatClick = () => {
    // Navigate to chat with this book
    router.push(`/messages?bookId=${book?._id}`)
  }

  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to use wishlist')
        return
      }
      
      const response = await fetch('https://book-bazaar-backend-new-1.onrender.com/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookId: book?._id })
      })
      
      if (response.ok) {
        alert('Added to wishlist!')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 flex justify-center">
          <div className="text-center">Loading book details...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The book you are looking for does not exist.'}</p>
            <Button onClick={() => router.push('/books')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Books
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Book Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-[3/4] relative">
                <img
                  src={book.image || "/placeholder.svg?height=600&width=450&text=Book"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {book.price === 0 && (
                  <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                    <Gift className="h-3 w-3 mr-1" />
                    FREE
                  </Badge>
                )}
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {book.condition}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">(4.0)</span>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">
                  <BookIcon className="h-3 w-3 mr-1" />
                  {book.subject || book.genre}
                </Badge>
                <Badge variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {book.genre}
                </Badge>
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(book.createdAt).toLocaleDateString()}
                </Badge>
              </div>

              {/* Price */}
              <div className="mb-6">
                {book.price === 0 ? (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-green-600">FREE</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      (Donated by the seller)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-primary">₹{book.price}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {book.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleChatClick}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Seller
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleAddToWishlist}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Seller Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Seller Information
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{book.name || book.userId?.username || "Anonymous"}</span>
                  </div>
                  
                  {book.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{book.email}</span>
                    </div>
                  )}
                  
                  {book.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{book.phone}</span>
                    </div>
                  )}
                  
                  {book.address && (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span>{book.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Book Condition Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Book Condition</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Condition:</span>
                    <Badge variant="outline">{book.condition}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {book.condition === 'New' && 'Brand new, never used'}
                    {book.condition === 'Like New' && 'Excellent condition, minimal wear'}
                    {book.condition === 'Very Good' && 'Light wear, all pages intact'}
                    {book.condition === 'Good' && 'Some wear, but fully readable'}
                    {book.condition === 'Fair' && 'Heavy wear, but still functional'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}