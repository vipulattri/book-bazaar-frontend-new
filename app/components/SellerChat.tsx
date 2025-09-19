"use client"

import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

interface Message {
  id: number
  conversationId: string
  senderId: string
  senderName?: string
  message: string
  timestamp: string
}

interface Conversation {
  _id: string
  conversationId: string
  buyerId: string
  buyerName: string
  lastMessage: string
  lastMessageAt: string
}

const API_URL = "https://book-bazaar-backend-new-1.onrender.com"

export default function SellerChat({
  bookId,
  sellerId,
}: { bookId: string; sellerId: string }) {
  const socketRef = useRef<Socket | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        console.log('🔍 SellerChat: Fetching conversations for seller:', sellerId, 'book:', bookId)
        
        if (!token) {
          console.log('❌ SellerChat: No token found')
          return
        }
        
        const url = `${API_URL}/api/messages/conversations/user/${sellerId}`
        console.log('🌐 SellerChat: API URL:', url)
        
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        console.log('📡 SellerChat: API Response status:', res.status)
        
        if (res.ok) {
          const allConversations = await res.json()
          console.log('📋 SellerChat: All conversations:', allConversations.length, allConversations)
          
          // Filter conversations for this specific book
          const bookConversations = allConversations.filter((conv: any) => {
            const matches = conv.bookId === bookId || conv.bookId?._id === bookId
            console.log('🔍 Checking conversation:', conv.conversationId, 'bookId:', conv.bookId, 'matches:', matches)
            return matches
          })
          
          console.log('📚 SellerChat: Book conversations:', bookConversations.length, bookConversations)
          setConversations(bookConversations)
          
          if (bookConversations.length > 0) {
            // Auto-select the most recent conversation
            const latest = bookConversations.sort((a: any, b: any) => 
              new Date(b.lastMessageAt || b.updatedAt).getTime() - 
              new Date(a.lastMessageAt || a.updatedAt).getTime()
            )[0]
            console.log('✅ SellerChat: Auto-selecting conversation:', latest.conversationId)
            setSelectedConversation(latest)
          } else {
            console.log('⚠️ SellerChat: No conversations found for this book')
          }
        } else {
          const errorText = await res.text()
          console.error('❌ SellerChat: API Error:', res.status, errorText)
        }
      } catch (error) {
        console.error('❌ SellerChat: Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [bookId, sellerId, token])

  useEffect(() => {
    if (!selectedConversation) return

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/messages/${selectedConversation.conversationId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        if (res.ok) {
          const data = await res.json()
          setMessages(data)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()

    // Set up socket connection
    const socket = io(API_URL, { 
      transports: ["websocket"], 
      autoConnect: true, 
      query: { userId: sellerId } 
    })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('chat:join', { conversationId: selectedConversation.conversationId })
    })

    socket.on('chat:message', (msg: Message) => {
      if (msg.conversationId === selectedConversation.conversationId) {
        setMessages(prev => [...prev, msg])
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [selectedConversation, token, sellerId])

  const sendMessage = async () => {
    if (!selectedConversation || !text.trim() || !token) return

    const parts = selectedConversation.conversationId.split('|').pop()!.split(':')
    const buyerId = parts.find(id => id !== sellerId) || ''

    const body = {
      conversationId: selectedConversation.conversationId,
      senderId: sellerId,
      senderName: 'Seller',
      recipientId: buyerId,
      message: text.trim(),
      bookId: bookId
    }

    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        setText("")
      } else {
        const error = await response.json()
        alert(`Failed to send message: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Loading conversations...</span>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600">
        <p className="mb-2">No buyers have messaged you about this book yet.</p>
        <p className="text-xs text-gray-500">When someone contacts you, their messages will appear here.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[400px] border rounded-lg">
      {conversations.length > 1 && (
        <div className="border-b p-2">
          <select 
            value={selectedConversation?._id || ''}
            onChange={(e) => {
              const conv = conversations.find(c => c._id === e.target.value)
              setSelectedConversation(conv || null)
            }}
            className="w-full text-sm border rounded px-2 py-1"
          >
            {conversations.map(conv => (
              <option key={conv._id} value={conv._id}>
                Chat with {conv.buyerName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-2">
        {selectedConversation && (
          <div className="text-xs text-center text-gray-500 mb-2">
            Conversation with {selectedConversation.buyerName}
          </div>
        )}
        
        {messages.map((m, index) => (
          <div 
            key={m.id || index} 
            className={`max-w-[75%] ${
              m.senderId === sellerId 
                ? 'ml-auto bg-blue-600 text-white' 
                : 'mr-auto bg-white border'
            } rounded px-3 py-2 shadow`}
          > 
            <div className="text-xs opacity-80">
              {m.senderId === sellerId ? 'You' : m.senderName || 'Buyer'}
            </div>
            <div>{m.message}</div>
            <div className="text-xs opacity-60 mt-1">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t flex gap-2">
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { 
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage() 
            }
          }} 
          className="flex-1 border rounded px-3 py-2" 
          placeholder="Type a reply..." 
          disabled={!selectedConversation}
        />
        <button 
          onClick={sendMessage} 
          disabled={!text.trim() || !selectedConversation}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  )
}