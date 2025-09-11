"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, BookOpen, Star, Users, X, Check, Sparkles, ArrowLeft } from "lucide-react"

interface Book {
  id: number
  title: string
  author: string
  rating: number
  genre: string
  description: string
  cover: string
  pages: number
  year: number
  isbn?: string
}

interface Match {
  book: Book
  matchedAt: Date
}

export default function LoveTogetherPage() {
  const [currentBookIndex, setCurrentBookIndex] = useState<number>(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [showMatch, setShowMatch] = useState<boolean>(false)
  const [dragOffset, setDragOffset] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const loveBooks: Book[] = [
    {
      id: 1,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      rating: 4.8,
      genre: "Romance, Historical Fiction",
      description: "A reclusive Hollywood icon finally tells her story to a young journalist, revealing a lifetime of love, ambition, and secrets.",
      cover: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
      pages: 400,
      year: 2017,
      isbn: "9781501139239"
    },
    {
      id: 2,
      title: "Beach Read",
      author: "Emily Henry",
      rating: 4.6,
      genre: "Contemporary Romance",
      description: "Two rival writers challenge each other to write outside their comfort zones, leading to unexpected romance.",
      cover: "linear-gradient(135deg, #4ecdc4, #44a08d)",
      pages: 350,
      year: 2020,
      isbn: "9781984806734"
    },
    {
      id: 3,
      title: "The Hating Game",
      author: "Sally Thorne",
      rating: 4.5,
      genre: "Enemies to Lovers",
      description: "Office enemies Lucy and Joshua engage in a daily battle of wits until the tension becomes something else entirely.",
      cover: "linear-gradient(135deg, #a8e6cf, #7fcdcd)",
      pages: 384,
      year: 2016,
      isbn: "9780062439598"
    },
    {
      id: 4,
      title: "Red, White & Royal Blue",
      author: "Casey McQuiston",
      rating: 4.7,
      genre: "LGBTQ+ Romance",
      description: "The First Son falls for the Prince of Wales in this witty and romantic political love story.",
      cover: "linear-gradient(135deg, #667eea, #764ba2)",
      pages: 432,
      year: 2019,
      isbn: "9781250316776"
    },
    {
      id: 5,
      title: "The Kiss Quotient",
      author: "Helen Hoang",
      rating: 4.4,
      genre: "Contemporary Romance",
      description: "A data-driven approach to love leads to unexpected passion in this diverse and steamy romance.",
      cover: "linear-gradient(135deg, #f093fb, #f5576c)",
      pages: 323,
      year: 2018,
      isbn: "9780451490803"
    },
    {
      id: 6,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      rating: 4.9,
      genre: "Classic Romance",
      description: "The timeless tale of Elizabeth Bennet and Mr. Darcy's complicated path to love.",
      cover: "linear-gradient(135deg, #ffecd2, #fcb69f)",
      pages: 432,
      year: 1813,
      isbn: "9780141439518"
    }
  ]

  const currentBook = loveBooks[currentBookIndex]

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSwipe = async (direction: 'left' | 'right') => {
    setIsLoading(true)
    setSwipeDirection(direction)
    
    try {
      if (direction === 'right') {
        const newMatch: Match = { 
          book: currentBook, 
          matchedAt: new Date() 
        }
        setMatches(prev => [...prev, newMatch])
        setShowMatch(true)
        
        // Simulate API call to save match
        await new Promise(resolve => setTimeout(resolve, 500))
        showNotification(`Added "${currentBook.title}" to your reading list!`, 'success')
        
        setTimeout(() => {
          setShowMatch(false)
          nextBook()
        }, 2000)
      } else {
        // Simulate API call for pass action
        await new Promise(resolve => setTimeout(resolve, 300))
        setTimeout(() => {
          nextBook()
        }, 300)
      }
    } catch (error) {
      showNotification("Something went wrong. Please try again.", 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const nextBook = () => {
    setSwipeDirection(null)
    setCurrentBookIndex(prev => (prev + 1) % loveBooks.length)
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isLoading) return
    setIsDragging(true)
    setDragOffset(0)
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isLoading) return
    
    const clientX = e.type === 'mousemove' 
      ? (e as React.MouseEvent).clientX 
      : (e as React.TouchEvent).touches[0].clientX
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const offset = clientX - centerX
    
    setDragOffset(Math.max(-200, Math.min(200, offset)))
  }

  const handleDragEnd = () => {
    if (!isDragging || isLoading) return
    
    setIsDragging(false)
    
    if (Math.abs(dragOffset) > 100) {
      handleSwipe(dragOffset > 0 ? 'right' : 'left')
    } else {
      setDragOffset(0)
    }
  }

  const handleBackToHome = () => {
    console.log("Navigate to home")
    // Navigation would be handled by parent component or routing system
  }

  const handleViewMatches = () => {
    console.log("Navigate to matches", matches)
    // Navigation would be handled by parent component or routing system
  }

  useEffect(() => {
    const handleMouseUp = () => handleDragEnd()
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e as any)
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleMouseMove as any)
      document.addEventListener('touchend', handleMouseUp)
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleMouseMove as any)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  if (!currentBook) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-purple-50">
          <div className="text-center space-y-4">
            <Heart className="w-16 h-16 text-pink-500 mx-auto animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-800">Loading Love Stories...</h2>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-purple-50 p-4">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
            <div className={`px-4 py-2 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {notification.message}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToHome}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                LoveTogether
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewMatches}
              className="hover:bg-white/50 relative"
            >
              <Users className="h-5 w-5" />
              {matches.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-pink-500">
                  {matches.length}
                </Badge>
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{loveBooks.length} Books</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
              <span>{matches.length} Matches</span>
            </div>
          </div>
        </div>

        {/* Book Card */}
        <div className="max-w-md mx-auto relative">
          <Card 
            className={`relative overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 shadow-2xl ${
              swipeDirection === 'left' ? 'transform -translate-x-full rotate-12 opacity-0' :
              swipeDirection === 'right' ? 'transform translate-x-full rotate-12 opacity-0' : ''
            } ${isDragging ? 'shadow-xl' : ''}`}
            style={{
              transform: isDragging ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)` : undefined,
              opacity: isDragging ? Math.max(0.7, 1 - Math.abs(dragOffset) * 0.002) : undefined
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <CardHeader className="p-0">
              <div 
                className="h-96 relative rounded-t-lg"
                style={{ background: currentBook.cover }}
              >
                <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                    {currentBook.rating}
                  </Badge>
                </div>
                
                {/* Book spine effect */}
                <div className="absolute left-4 top-6 bottom-6 w-2 bg-white/30 rounded-full shadow-lg" />
                
                {/* Title overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <CardTitle className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                    {currentBook.title}
                  </CardTitle>
                  <CardDescription className="text-white/90 font-medium drop-shadow">
                    by {currentBook.author}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                  {currentBook.genre}
                </Badge>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span>{currentBook.pages} pages</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>{currentBook.year}</span>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed text-sm">
                {currentBook.description}
              </p>

              {/* Swipe indicators */}
              <div className="flex items-center justify-center space-x-4 pt-2">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all text-sm ${
                  dragOffset < -50 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-muted text-muted-foreground'
                }`}>
                  <X className="w-3 h-3" />
                  <span className="font-medium">Pass</span>
                </div>
                
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all text-sm ${
                  dragOffset > 50 ? 'bg-pink-50 text-pink-600 border border-pink-200' : 'bg-muted text-muted-foreground'
                }`}>
                  <Heart className="w-3 h-3" />
                  <span className="font-medium">Love</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-6 mt-6">
            <Button 
              variant="outline"
              size="icon"
              onClick={() => handleSwipe('left')}
              disabled={isLoading}
              className="h-12 w-12 rounded-full border-2 border-red-100 hover:border-red-200 hover:bg-red-50"
            >
              <X className="w-5 h-5 text-red-500" />
            </Button>
            
            <Button 
              size="icon"
              onClick={() => handleSwipe('right')}
              disabled={isLoading}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 shadow-lg"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Heart className="w-6 h-6 text-white fill-current" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 border-purple-100 hover:border-purple-200 hover:bg-purple-50"
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
            </Button>
          </div>
        </div>

        {/* Match Notification */}
        {showMatch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-sm mx-auto text-center animate-in fade-in-0 zoom-in-95">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white fill-current animate-bounce" />
                </div>
                <CardTitle className="text-xl">It's a Match!</CardTitle>
                <CardDescription>
                  You and <span className="font-semibold text-foreground">{currentBook.title}</span> are perfect together!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-3 border border-pink-100">
                  <p className="text-sm text-muted-foreground">Added to your reading list ❤️</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}