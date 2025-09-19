"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, User, Clock, Book } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import BuyerSellerChat from "@/app/messages/page"

interface Conversation {
  _id: string
  conversationId: string
  bookId: {
    _id: string
    title: string
    author?: string
    image?: string
    price?: number
  }
  sellerId: string
  buyerId: string
  sellerName: string
  buyerName: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: {
    seller: number
    buyer: number
  }
  isActive: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://book-bazaar-backend-new-1.onrender.com"

export default function InboxPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/api/messages/conversations/user/${user.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        
        if (response.ok) {
          const data = await response.json()
          setConversations(data)
        } else {
          console.error('Failed to fetch conversations:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [user?.id])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const getUnreadCount = (conversation: Conversation) => {
    const isSeller = conversation.sellerId === user?.id
    return isSeller ? conversation.unreadCount.seller : conversation.unreadCount.buyer
  }

  const getOtherParticipant = (conversation: Conversation) => {
    const isSeller = conversation.sellerId === user?.id
    return {
      id: isSeller ? conversation.buyerId : conversation.sellerId,
      name: isSeller ? conversation.buyerName : conversation.sellerName,
      role: isSeller ? 'Buyer' : 'Seller'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading conversations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Manage your conversations about books</p>
      </div>

      {conversations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageCircle className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-500 text-center max-w-md">
              When you buy or sell books, your conversations will appear here. 
              Start by browsing books or posting your own!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => {
            const unreadCount = getUnreadCount(conversation)
            const otherParticipant = getOtherParticipant(conversation)
            const isSeller = conversation.sellerId === user?.id

            return (
              <Card key={conversation._id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Book Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={conversation.bookId?.image || "/placeholder.svg?height=80&width=60&text=Book"}
                        alt={conversation.bookId?.title || "Book"}
                        className="w-16 h-20 object-cover rounded-lg border"
                      />
                    </div>

                    {/* Conversation Details */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.bookId?.title || "Unknown Book"}
                          </h3>
                          {conversation.bookId?.price !== undefined && (
                            <Badge variant={conversation.bookId.price === 0 ? "secondary" : "outline"}>
                              {conversation.bookId.price === 0 ? "FREE" : `₹${conversation.bookId.price}`}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimestamp(conversation.lastMessageAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {otherParticipant.role}: {otherParticipant.name}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                        {conversation.lastMessage || "No messages yet"}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Book className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {conversation.bookId?.author && `by ${conversation.bookId.author}`}
                          </span>
                        </div>

                        <Dialog open={isChatOpen && selectedConversation?._id === conversation._id} onOpenChange={(open) => {
                          setIsChatOpen(open)
                          if (!open) setSelectedConversation(null)
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              onClick={() => setSelectedConversation(conversation)}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              {isSeller ? "Chat with Buyer" : "Chat with Seller"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] sm:max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>
                                Chat about: {conversation.bookId?.title}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedConversation && (
                              <div className="space-y-4">
                                {/* Book Info Header */}
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                  <img
                                    src={conversation.bookId?.image || "/placeholder.svg?height=60&width=45&text=Book"}
                                    alt={conversation.bookId?.title}
                                    className="w-12 h-16 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium">{conversation.bookId?.title}</h4>
                                    {conversation.bookId?.author && (
                                      <p className="text-sm text-gray-600">by {conversation.bookId.author}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                      Chatting with: {otherParticipant.name} ({otherParticipant.role})
                                    </p>
                                  </div>
                                </div>

                                {/* Chat Component */}
                                <BuyerSellerChat conversationId={selectedConversation.conversationId} />
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}