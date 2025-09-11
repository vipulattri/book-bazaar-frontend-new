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

  useEffect(() => {
    const fetchMyBooks = async () => {
      if (!user?.id) return
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:5000/api/books?userId=${encodeURIComponent(user.id)}`)
        const data = await res.json()
        setBooks(data)
      } finally {
        setLoading(false)
      }
    }
    fetchMyBooks()
  }, [user?.id])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this book?')) return
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`http://localhost:5000/api/books/${id}`, {
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
                    <Button variant="outline" className="flex-1" onClick={() => { setSelectedBook(book); setIsChatOpen(true) }}>
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
                      let otherId = ""
                      if (isSeller) {
                        try {
                          const key = 'lastChatPartnerByBook'
                          const map = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem(key) || '{}' : '{}') as Record<string, string>
                          const fromMap = map?.[book._id]
                          if (fromMap && fromMap !== currentUserId) otherId = fromMap
                        } catch {}
                      }
                      // If no local record, try server lookup for latest buyer for this book
                      if (!otherId && isSeller) {
                        (async () => {
                          try {
                            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
                            const res = await fetch(`http://localhost:5000/api/messages/partner?bookId=${book._id}&sellerId=${currentUserId}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined as any })
                            const data = await res.json()
                            if (data?.buyerId) {
                              const key = 'lastChatPartnerByBook'
                              const map = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, string>
                              map[book._id] = data.buyerId
                              localStorage.setItem(key, JSON.stringify(map))
                            }
                          } catch {}
                        })()
                      }
                      if (!sellerId) {
                        return null
                      }
                      if (!otherId && isSeller) {
                        return (
                          <div className="text-sm text-gray-600 p-3 border rounded">
                            No buyer selected yet. You will see the chat here after a buyer messages you.
                          </div>
                        )
                      }
                      if (!isSeller) {
                        // Should not happen on My Books page, fallback
                        otherId = currentUserId
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
