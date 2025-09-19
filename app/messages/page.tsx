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

const API_URL = "https://book-bazaar-backend-new-1.onrender.com"

function normalizeConversationId(inputId: string, selfId: string) {
  if (!inputId) return inputId
  // Support book-prefixed keys like "<bookId>|id1:id2"
  const [maybeBook, rest] = inputId.includes('|') ? inputId.split('|') : [null, inputId]
  const base = rest || inputId
  if (base.includes(':')) {
    const parts = base.split(':').filter(Boolean)
    if (parts.length >= 2) {
      const sorted = [parts[0], parts[1]].sort()
      const remainder = parts.slice(2) // ignore extras if any
      const canonical = `${sorted[0]}:${sorted[1]}${remainder.length ? `:${remainder.join(':')}` : ''}`
      return maybeBook ? `${maybeBook}|${canonical}` : canonical
    }
  }
  return inputId
}

export default function BuyerSellerChat({
  conversationId = "demo-convo",
}: { conversationId?: string }) {
  const socketRef = useRef<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const userJson = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
  const userName = userJson?.username || 'You'
  const userId = userJson?.id
  
  const canonicalConversationId = normalizeConversationId(conversationId, userId)
  const currentBookId = canonicalConversationId.includes('|') ? canonicalConversationId.split('|')[0] : ''
  
  // Validate that we have a proper conversationId format for messaging
  const isValidConversationFormat = canonicalConversationId.includes('|') && canonicalConversationId.includes(':')
  
  if (!isValidConversationFormat) {
    console.warn('Invalid conversation format:', canonicalConversationId)
  }

  // Don't render chat if user is not properly authenticated
  if (!userId || !token) {
    return (
      <div className="flex flex-col h-[420px] border rounded-lg">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <p>Please log in to send messages</p>
          </div>
        </div>
      </div>
    )
  }
  
  // Don't allow messaging if conversation format is invalid
  if (!isValidConversationFormat) {
    return (
      <div className="flex flex-col h-[420px] border rounded-lg">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <p>Invalid conversation format</p>
            <p className="text-xs mt-2">Please start a conversation from a book listing</p>
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/api/messages/${canonicalConversationId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined as any,
        })
        const data = await res.json()
        setMessages(data)
        // If we have history, persist partner id for seller context per book
        if (Array.isArray(data) && data.length > 0 && canonicalConversationId.includes(':')) {
          const parts = canonicalConversationId.split('|').pop()!.split(':')
          const otherId = parts.find(id => id !== userId) || ''
          try {
            const key = 'lastChatPartnerByBook'
            const map = JSON.parse(localStorage.getItem(key) || '{}')
            if (currentBookId && otherId) {
              map[currentBookId] = otherId
              localStorage.setItem(key, JSON.stringify(map))
              
              // Notify parent component about the partner
              if (typeof window !== 'undefined' && window.parent) {
                window.parent.postMessage({
                  type: 'CHAT_PARTNER_FOUND',
                  bookId: currentBookId,
                  partnerId: otherId
                }, '*')
              }
            }
          } catch {}
        }
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()

    const socket = io(API_URL, { transports: ["websocket"], autoConnect: true, query: { userId } })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('chat:join', { conversationId: canonicalConversationId })
      console.log('Joined conversation', canonicalConversationId)
    })
    socket.on('connect_error', (err: any) => {
      console.error('Socket connect_error', err?.message || err)
    })
    socket.on('error', (err: any) => {
      console.error('Socket error', err)
    })

    socket.on('chat:message', (msg: Message) => {
      if (msg.conversationId === canonicalConversationId) {
        setMessages(prev => [...prev, msg])
        // Persist the other participant id per book
        if (canonicalConversationId.includes(':')) {
          const parts = canonicalConversationId.split('|').pop()!.split(':')
          const otherId = parts.find(id => id !== userId) || ''
          try {
            const key = 'lastChatPartnerByBook'
            const map = JSON.parse(localStorage.getItem(key) || '{}')
            if (currentBookId && otherId) {
              map[currentBookId] = otherId
              localStorage.setItem(key, JSON.stringify(map))
            }
          } catch {}
        }
        listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
      }
    })

    socket.on('chat:typing', ({ userId: typingUserId, isTyping: typing }) => {
      if (typingUserId !== userId) {
        setOtherUserTyping(typing)
      }
    })

    socket.on('user:status', ({ userId: statusUserId, status }) => {
      // Handle user online/offline status if needed
      console.log(`User ${statusUserId} is ${status}`)
    })
    return () => {
      socket.disconnect()
    }
  }, [canonicalConversationId, token, userId])

  const send = async () => {
    // Validate authentication before sending
    if (!userId || !token) {
      alert('Please log in to send messages')
      return
    }
    
    // Validate conversation format
    if (!isValidConversationFormat) {
      console.error('Invalid conversation format for messaging:', canonicalConversationId)
      alert('Invalid conversation format. Please refresh and try again.')
      return
    }
    
    // Validate that we have a book ID
    if (!currentBookId) {
      console.error('No book ID found in conversation:', canonicalConversationId)
      alert('Cannot send message: Missing book information.')
      return
    }

    const parts = canonicalConversationId.includes(':') ? canonicalConversationId.split('|').pop()!.split(':') : []
    const otherId = parts.find(id => id !== userId) || ''
    
    if (!otherId) {
      console.error('Cannot determine recipient from conversation ID:', canonicalConversationId)
      alert('Cannot send message: Unable to determine recipient.')
      return
    }

    const body = {
      conversationId: canonicalConversationId,
      senderId: userId,
      senderName: userName,
      recipientId: otherId,
      recipientName: undefined,
      message: text.trim(),
      bookId: currentBookId
    }
    
    if (!body.message) return
    if (!body.conversationId) {
      console.error('No conversation ID available')
      return
    }
    
    console.log('Sending message:', body)
    
    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        console.error('Failed to send message:', response.statusText, responseData)
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.')
        } else {
          alert(`Failed to send message: ${responseData.error || responseData.details || response.statusText}`)
        }
        return
      }
      
      console.log('Message sent successfully:', responseData)
      
      // Persist last chat partner for seller context per book
      try {
        if (typeof window !== 'undefined') {
          const key = 'lastChatPartnerByBook'
          const map = JSON.parse(localStorage.getItem(key) || '{}')
          if (currentBookId && otherId) {
            map[currentBookId] = otherId
            localStorage.setItem(key, JSON.stringify(map))
          }
        }
      } catch {}

      setText("")
    } catch (error) {
      console.error('Error sending message:', error)
      alert(`Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    
    if (!isTyping) {
      setIsTyping(true)
      socketRef.current?.emit('chat:typing', { 
        conversationId: canonicalConversationId, 
        userId, 
        isTyping: true 
      })
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socketRef.current?.emit('chat:typing', { 
        conversationId: canonicalConversationId, 
        userId, 
        isTyping: false 
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col h-[420px] border rounded-lg">
      <div ref={listRef} className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-2">
        {loading ? (
          <div className="text-center text-gray-500">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((m, index) => {
            // Create a unique key using multiple fields
            const messageKey = m.id || (m as any)._id || `${m.senderId}-${m.timestamp}-${index}`
            
            // Handle date formatting with fallback
            const formatTimestamp = (timestamp: string | number | Date | undefined): string => {
              if (!timestamp) return 'Now'
              
              try {
                const date = new Date(timestamp)
                if (isNaN(date.getTime())) {
                  // If timestamp is invalid, try parsing as string or number
                  const parsedDate = new Date(parseInt(timestamp as string) || timestamp)
                  if (isNaN(parsedDate.getTime())) {
                    return 'Now'
                  }
                  return parsedDate.toLocaleTimeString()
                }
                return date.toLocaleTimeString()
              } catch (error) {
                console.warn('Error formatting timestamp:', timestamp, error)
                return 'Now'
              }
            }
            
            return (
              <div key={messageKey} className={`max-w-[75%] ${m.senderId === userId ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-white border'} rounded px-3 py-2 shadow`}> 
                <div className="text-xs opacity-80">{m.senderName || (m.senderId === userId ? 'You' : 'User')}</div>
                <div>{m.message}</div>
                <div className="text-xs opacity-60 mt-1">
                  {formatTimestamp(m.timestamp)}
                </div>
              </div>
            )
          })
        )}
        {otherUserTyping && (
          <div className="mr-auto bg-gray-200 rounded px-3 py-2 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>typing...</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-2 border-t flex gap-2">
        <input 
          value={text} 
          onChange={handleTyping} 
          onKeyDown={e => { 
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send() 
            }
          }} 
          className="flex-1 border rounded px-3 py-2" 
          placeholder="Type a message..." 
        />
        <button 
          onClick={send} 
          disabled={!text.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  )
}