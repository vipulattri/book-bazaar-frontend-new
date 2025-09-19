"use client"

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/auth-provider"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Trash2 } from "lucide-react"
import BuyerSellerChat from "@/app/messages/page"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Book {
  _id: string
  title?: string
  author?: string
  genre?: string
  price?: number
  image?: string
  condition?: string
  createdAt?: string
  userId?: any
}

export default function MyBooksPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatPartners, setChatPartners] = useState<Record<string, string>>({})
  const [loadingPartners, setLoadingPartners] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchMyBooks = async () => {
      if (!user?.id) return
      try {
        setLoading(true)
        const res = await fetch(`https://book-bazaar-backend-new-1.onrender.com/api/books?userId=${encodeURIComponent(user.id)}`)
        const data = await res.json()
        setBooks(data)
      } finally {
        setLoading(false)
      }
    }
    fetchMyBooks()
  }, [user?.id])

  const fetchChatPartner = async (bookId: string) => {
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
      
      // Check for any conversations for this book
      const token = localStorage.getItem('token')
      const conversationsRes = await fetch(`https://book-bazaar-backend-new-1.onrender.com/api/messages/conversations/user/${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      if (conversationsRes.ok) {
        const conversations = await conversationsRes.json()
        const bookConversations = conversations.filter((conv: any) => conv.bookId === bookId || conv.bookId?._id === bookId)
        
        if (bookConversations.length > 0) {
          // Get the most recent conversation
          const latestConv = bookConversations.sort((a: any, b: any) => 
            new Date(b.lastMessageAt || b.updatedAt).getTime() - new Date(a.lastMessageAt || a.updatedAt).getTime()
          )[0]
          
          const partnerId = latestConv.sellerId === user.id ? latestConv.buyerId : latestConv.sellerId
          setChatPartners(prev => ({ ...prev, [bookId]: partnerId }))
          map[bookId] = partnerId
          localStorage.setItem(key, JSON.stringify(map))
          return
        }
      }
      
      // If no conversations found, try the partner endpoint as fallback
      const res = await fetch(`https://book-bazaar-backend-new-1.onrender.com/api/messages/partner?bookId=${bookId}&sellerId=${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data?.buyerId) {
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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this book?')) return
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`https://book-bazaar-backend-new-1.onrender.com/api/books/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined as any,
      })
      if (res.ok) {
        setBooks(prev => prev.filter(b => b._id !== id))
      }
    } catch {}
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Books</h1>
      {loading ? (
        <div>Loading…</div>
      ) : books.length === 0 ? (
        <div>You haven't uploaded any books yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map(book => (
            <Card key={book._id}>
              <CardContent className="p-4">
                <img
                  src={book.image || "/placeholder.svg?height=150&width=100&text=Book"}
                  alt={book.title}
                  className="w-full h-40 object-cover rounded"
                />
                <div className="mt-3">
                  <div className="font-semibold">{book.title}</div>
                  <div className="text-sm text-gray-600">{book.author}</div>
                  <div className="text-sm">{book.price === 0 ? 'FREE' : `₹${book.price}`}</div>
                  <div className="text-xs text-gray-500">{book.genre} • {book.condition}</div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Dialog open={isChatOpen && selectedBook?._id === book._id} onOpenChange={(open) => { setIsChatOpen(open); if (!open) setSelectedBook(null) }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1" onClick={() => { 
                      setSelectedBook(book)
                      setIsChatOpen(true)
                      fetchChatPartner(book._id)
                    }}>
                      <MessageCircle className="h-4 w-4 mr-2" /> Contact Buyer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Chat</DialogTitle>
                      <DialogDescription>Keep in touch with interested buyers.</DialogDescription>
                    </DialogHeader>
                    {(() => {
                      const sellerId = (book as any)?.userId?._id || (book as any)?.userId || ""
                      const currentUserId = user?.id || ""
                      const isSeller = sellerId && currentUserId && sellerId === currentUserId
                      
                      if (!sellerId) {
                        return null
                      }
                      
                      // Check if we're still loading partner info
                      if (loadingPartners[book._id]) {
                        return (
                          <div className="text-sm text-gray-600 p-3 border rounded flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            Loading chat...
                          </div>
                        )
                      }
                      
                      // Get the chat partner for this book
                      const otherId = chatPartners[book._id] || ""
                      
                      if (!otherId && isSeller) {
                        // Direct sellers to the inbox for better conversation management
                        return (
                          <div className="space-y-3">
                            <div className="text-sm text-gray-600 p-3 border rounded">
                              <p className="mb-2">💬 <strong>Manage all your conversations in one place!</strong></p>
                              <p className="text-xs text-gray-500">For a better messaging experience, visit your inbox to see all conversations with buyers.</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => window.location.href = '/inbox'}
                                className="flex-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors"
                              >
                                📥 Go to Inbox
                              </button>
                              <button 
                                onClick={async () => {
                                  try {
                                    const token = localStorage.getItem('token')
                                    const res = await fetch(`https://book-bazaar-backend-new-1.onrender.com/api/messages/conversations/user/${user?.id}`, {
                                      headers: token ? { Authorization: `Bearer ${token}` } : {}
                                    })
                                    if (res.ok) {
                                      const conversations = await res.json()
                                      const bookConversations = conversations.filter((conv: any) => 
                                        (conv.bookId === book._id || conv.bookId?._id === book._id)
                                      )
                                      if (bookConversations.length > 0) {
                                        const latestConv = bookConversations[0]
                                        const partnerId = latestConv.buyerId
                                        setChatPartners(prev => ({ ...prev, [book._id]: partnerId }))
                                        const key = 'lastChatPartnerByBook'
                                        const map = JSON.parse(localStorage.getItem(key) || '{}')
                                        map[book._id] = partnerId
                                        localStorage.setItem(key, JSON.stringify(map))
                                      } else {
                                        alert('No conversations found for this book yet.')
                                      }
                                    }
                                  } catch (error) {
                                    console.error('Error checking conversations:', error)
                                    alert('Error checking for conversations.')
                                  }
                                }}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition-colors border"
                              >
                                🔄 Refresh
                              </button>
                            </div>
                          </div>
                        )
                      }
                      
                      if (!isSeller) {
                        // Should not happen on My Books page, fallback
                        return (
                          <div className="text-sm text-gray-600 p-3 border rounded">
                            This is your book listing.
                          </div>
                        )
                      }
                      
                      const conversationId = `${book._id}|${[sellerId, otherId].sort().join(":")}`
                      return <BuyerSellerChat conversationId={conversationId} />
                    })()}
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" className="flex-1" onClick={() => handleDelete(book._id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
