"use client"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, Gift, Users, Bot } from "lucide-react"
import Link from "next/link"
import gsap from "gsap"

export function HeroSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-in", {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20"
    >
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-300 opacity-30 blur-3xl filter animate-pulse"></div>
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-purple-300 opacity-30 blur-2xl filter animate-ping"></div>

      <div className="container relative px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="secondary"
            className="mb-6 bg-green-100 text-green-800 border-green-200 fade-in"
          >
            <Heart className="h-3 w-3 mr-1" />
            Helping Students Access Education
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl fade-in">
            Get Textbooks from{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Your Seniors
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto fade-in">
            Connect with senior students to buy affordable second-hand textbooks or receive donated books. Make
            education accessible for everyone in your university community.
          </p>

          {/* Search Bar */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 fade-in">
            <div className="relative flex-1 min-w-[250px] max-w-[400px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search by subject, course code..."
                className="pl-10 pr-4 h-12 text-lg rounded-xl shadow-lg backdrop-blur-sm bg-white/60 border border-gray-200"
              />
            </div>
            <Button size="lg" className="h-12 px-8 rounded-xl shadow-md backdrop-blur-md">
              Search
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 justify-center fade-in">
            <Button size="lg" asChild className="h-12 px-8 rounded-full backdrop-blur-md">
              <Link href="/books">Find Textbooks</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 px-8 bg-white/40 border border-gray-300 rounded-full backdrop-blur-md"
            >
              <Link href="/books/add">List Your Books</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 px-8 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 rounded-full backdrop-blur-md"
            >
              <Link href="/donate">
                <Gift className="h-4 w-4 mr-2" />
                Donate Books
              </Link>
            </Button>

            {/* New Learn Together Button */}
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 px-8 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 rounded-full backdrop-blur-md"
            >
              <Link href="/learntogether">
                <Users className="h-4 w-4 mr-2" />
                Learn Together
              </Link>
            </Button>

            {/* New AI Chat Assistant Button */}
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 px-8 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 rounded-full backdrop-blur-md"
            >
              <Link href="/chatAssistant">
                <Bot className="h-4 w-4 mr-2" />
                AI Chat
              </Link>
            </Button>
          </div>

          {/* Popular Searches */}
          <div className="mt-10 fade-in">
            <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Calculus", "Physics", "Chemistry", "Computer Science", "Biology", "Economics"].map((subject) => (
                <Badge
                  key={subject}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 rounded-full px-4 py-1 shadow-sm backdrop-blur-sm"
                >
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}