"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/auth-provider"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Book { _id: string; title?: string; author?: string; image?: string; price?: number }

export default function WishlistPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:5000/api/wishlist', { headers: token ? { Authorization: `Bearer ${token}` } : undefined as any })
        const data = await res.json()
        setBooks((data?.books || []) as Book[])
      } finally { setLoading(false) }
    }
    fetchWishlist()
  }, [user?.id])

  const remove = async (bookId: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/wishlist/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ bookId }),
      })
      if (res.ok) setBooks(prev => prev.filter(b => b._id !== bookId))
    } catch {}
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      {loading ? (
        <div>Loading…</div>
      ) : books.length === 0 ? (
        <div>No items in wishlist.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map(book => (
            <Card key={book._id}>
              <CardContent className="p-4">
                <img src={book.image || "/placeholder.svg?height=150&width=100&text=Book"} alt={book.title} className="w-full h-40 object-cover rounded" />
                <div className="mt-3">
                  <div className="font-semibold">{book.title}</div>
                  <div className="text-sm text-gray-600">{book.author}</div>
                  <div className="text-sm">{book.price === 0 ? 'FREE' : `₹${book.price}`}</div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" className="flex-1"><Link href="/books">View</Link></Button>
                <Button variant="destructive" className="flex-1" onClick={() => remove(book._id)}>Remove</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
