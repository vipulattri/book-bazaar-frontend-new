"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Star, GraduationCap, Gift, MapPin, User } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  condition: string;
  price: number;
  Subject?: string;
  Address: string;
  Name: string;
  image?: string;
  userId: string;
  createdAt: string;
  // Optional UI-only fields
  course?: string;
  originalPrice?: number;
  rating?: number;
  year?: string;
  university?: string;
  isDonation?: boolean;
}

export function FeaturedBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://book-bazaar-backend-new.onrender.com/api/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <p>Loading books...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Recently Listed Books</h2>
          <p className="mt-4 text-lg text-muted-foreground">Fresh textbooks from your fellow students</p>
        </div>

        {books.length === 0 ? (
          <div className="text-center">
            <p>No books available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.slice(0, 6).map((book) => (
              <Card
                key={book._id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={async (e) => {
                      e.stopPropagation()
                      try {
                        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
                        if (!token) { alert('Please login to use wishlist'); return }
                        const res = await fetch('https://book-bazaar-backend-nem0.onrender.com/api/wishlist/add', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ bookId: (book as any)?._id })
                        })
                        if (!res.ok) console.error('Failed to add to wishlist')
                      } catch {}
                    }}>
                      <Heart className="h-4 w-4" />
                    </Button>
                    {book.isDonation && (
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

                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(book.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">({book.rating || 0})</span>
                  </div>

                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {book.Subject || book.genre}
                    </Badge>
                    {book.course && (
                      <Badge variant="outline" className="text-xs">
                        {book.course}
                      </Badge>
                    )}
                  </div>

                  <div className="mb-3">
                    {book.isDonation ? (
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-green-600">FREE</span>
                        {book.originalPrice && (
                          <span className="text-sm text-muted-foreground ml-2 line-through">${book.originalPrice}</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-primary">₹{book.price}</span>
                        {book.originalPrice && (
                          <>
                            <span className="text-sm text-muted-foreground ml-2 line-through">₹{book.originalPrice}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% off
                            </Badge>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>{book.Name}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{book.Address}</span>
                    </div>
                    {book.university && (
                      <div className="flex items-center">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        <span>
                          {book.university} {book.year && `• ${book.year}`}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button className="flex-1" size="sm">
                    {book.isDonation ? "Request Book" : "View Details"}
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link href="/books">Browse All Textbooks</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}