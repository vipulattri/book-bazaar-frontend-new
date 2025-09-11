"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Heart, MessageCircle, Star, GraduationCap, Gift } from "lucide-react"

const FeaturedBooks = () => {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)

  const featuredBooks = [
    {
      id: 1,
      title: "Calculus: Early Transcendentals",
      author: "James Stewart",
      subject: "Mathematics",
      course: "MATH 101",
      condition: "Good",
      price: 45.0,
      originalPrice: 280.0,
      image: "/placeholder.svg?height=300&width=200&text=Calculus+Book",
      rating: 4.5,
      seller: "Sarah Chen",
      year: "4th Year",
      university: "MIT",
      isDonation: false,
    },
    {
      id: 2,
      title: "Introduction to Algorithms",
      author: "Cormen, Leiserson, Rivest",
      subject: "Computer Science",
      course: "CS 201",
      condition: "Very Good",
      price: 0,
      originalPrice: 320.0,
      image: "/placeholder.svg?height=300&width=200&text=Algorithms+Book",
      rating: 4.8,
      seller: "Mike Rodriguez",
      year: "Graduate",
      university: "Stanford",
      isDonation: true,
    },
    {
      id: 3,
      title: "Campbell Biology",
      author: "Jane Reece",
      subject: "Biology",
      course: "BIO 101",
      condition: "Like New",
      price: 85.0,
      originalPrice: 450.0,
      image: "/placeholder.svg?height=300&width=200&text=Biology+Book",
      rating: 4.7,
      seller: "Emma Wilson",
      year: "3rd Year",
      university: "Harvard",
      isDonation: false,
    },
    {
      id: 4,
      title: "Principles of Economics",
      author: "N. Gregory Mankiw",
      subject: "Economics",
      course: "ECON 101",
      condition: "Good",
      price: 35.0,
      originalPrice: 250.0,
      image: "/placeholder.svg?height=300&width=200&text=Economics+Book",
      rating: 4.4,
      seller: "David Kim",
      year: "2nd Year",
      university: "UCLA",
      isDonation: false,
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Books cards animation
      gsap.fromTo(
        cardsRef.current.children,
        {
          y: 80,
          opacity: 0,
          scale: 0.9,
          rotationX: 45,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Individual book animations
      cardsRef.current.children.forEach((card, index) => {
        const image = card.querySelector(".book-image")
        const heartBtn = card.querySelector(".heart-btn")
        const priceElement = card.querySelector(".book-price")

        // Image hover effect
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.03,
            y: -15,
            duration: 0.4,
            ease: "power2.out",
          })

          gsap.to(image, {
            scale: 1.1,
            duration: 0.4,
            ease: "power2.out",
          })

          gsap.to(heartBtn, {
            scale: 1.2,
            rotation: 15,
            duration: 0.3,
            ease: "back.out(1.7)",
          })

          gsap.to(priceElement, {
            scale: 1.1,
            color: "#2563eb",
            duration: 0.3,
            ease: "power2.out",
          })
        })

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          })

          gsap.to(image, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          })

          gsap.to(heartBtn, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          })

          gsap.to(priceElement, {
            scale: 1,
            color: "#1f2937",
            duration: 0.3,
            ease: "power2.out",
          })
        })

        // Floating animation for donation badges
        const donationBadge = card.querySelector(".donation-badge")
        if (donationBadge) {
          gsap.to(donationBadge, {
            y: -2,
            duration: 1.5,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">Recently Listed Books</h2>
          <p className="mt-4 text-lg text-gray-600">Fresh textbooks from your fellow students</p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img
                  src={book.image || "/placeholder.svg"}
                  alt={book.title}
                  className="book-image w-full h-64 object-cover transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <button className="heart-btn w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  {book.isDonation && (
                    <span className="donation-badge inline-flex items-center px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                      <Gift className="h-3 w-3 mr-1" />
                      FREE
                    </span>
                  )}
                </div>
                <span className="absolute top-2 left-2 px-2 py-1 bg-white bg-opacity-90 text-gray-700 rounded-full text-xs font-medium">
                  {book.condition}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(book.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">({book.rating})</span>
                </div>

                <h3 className="font-semibold text-lg mb-1 text-gray-900 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                    {book.subject}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                    {book.course}
                  </span>
                </div>

                <div className="mb-3">
                  {book.isDonation ? (
                    <div className="flex items-center">
                      <span className="book-price text-2xl font-bold text-green-600">FREE</span>
                      <span className="text-sm text-gray-500 ml-2 line-through">₹{book.originalPrice}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="book-price text-2xl font-bold text-gray-900">₹{book.price}</span>
                      <span className="text-sm text-gray-500 ml-2 line-through">₹{book.originalPrice}</span>
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                        {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% off
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  <span>
                    {book.seller} • {book.year} • {book.university}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                    {book.isDonation ? "Request Book" : "View Details"}
                  </button>
                  <button className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium hover:scale-105 transform">
            Browse All Textbooks
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedBooks
