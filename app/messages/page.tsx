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

const API_URL = "https://book-bazaar-backend-nem0.onrender.com"

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
  const listRef = useRef<HTMLDivElement>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const userJson = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
  const userName = userJson?.username || 'You'
  const userId = userJson?.id || 'me'

  const canonicalConversationId = normalizeConversationId(conversationId, userId)
  const currentBookId = canonicalConversationId.includes('|') ? canonicalConversationId.split('|')[0] : ''

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
    return () => {
      socket.disconnect()
    }
  }, [canonicalConversationId, token, userId])

  const send = async () => {
    const parts = canonicalConversationId.includes(':') ? canonicalConversationId.split('|').pop()!.split(':') : []
    const otherId = parts.find(id => id !== userId) || ''

    const body = {
      conversationId: canonicalConversationId,
      senderId: userId,
      senderName: userName,
      recipientId: otherId,
      recipientName: undefined,
      message: text.trim(),
    }
    if (!body.message) return
    
    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      })
      
      if (!response.ok) {
        console.error('Failed to send message:', response.statusText)
        return
      }
      
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
    }
  }

  return (
    <div className="flex flex-col h-[420px] border rounded-lg">
      <div ref={listRef} className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-2">
        {loading ? (
          <div className="text-center text-gray-500">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`max-w-[75%] ${m.senderId === userId ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-white border'} rounded px-3 py-2 shadow`}> 
              <div className="text-xs opacity-80">{m.senderName || (m.senderId === userId ? 'You' : 'User')}</div>
              <div>{m.message}</div>
            </div>
          ))
        )}
      </div>
      <div className="p-2 border-t flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send() }} className="flex-1 border rounded px-3 py-2" placeholder="Type a message" />
        <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      </div>
    </div>
  )
}