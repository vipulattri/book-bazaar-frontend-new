"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import  Link from "next/link"
import { GraduationCap, Facebook, Twitter, Instagram, Mail, Heart } from "lucide-react"

const Footer = () => {
  const footerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">BookBazaar</span>
                <span className="text-xs text-gray-500">Student Book Exchange</span>
              </div>
            </Link>
            <p className="text-sm text-gray-600">
              Connecting students to make education affordable. Help your juniors succeed by sharing your textbooks.
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              Made with love for students
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                <Instagram className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* For Students */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">For Students</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/books" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Find Textbooks
                </Link>
              </li>
              <li>
                <Link to="/books/add" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Sell Your Books
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Donate Books
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Safety Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Popular Subjects</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/books?subject=mathematics"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Mathematics
                </Link>
              </li>
              <li>
                <Link
                  to="/books?subject=computer-science"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Computer Science
                </Link>
              </li>
              <li>
                <Link
                  to="/books?subject=biology"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Biology
                </Link>
              </li>
              <li>
                <Link
                  to="/books?subject=physics"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Physics
                </Link>
              </li>
              <li>
                <Link
                  to="/books?subject=economics"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Economics
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Support Our Mission</h3>
            <p className="text-sm text-gray-600 mb-4">
              Help us reach more students and make education accessible to everyone.
            </p>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                Spread the Word
              </button>
              <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium">
                Partner with Us
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 BookBazaar. Built by students, for students. All rights reserved.</p>
          <p className="mt-2">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors duration-200">
              Privacy Policy
            </Link>
            {" • "}
            <Link to="/terms" className="hover:text-blue-600 transition-colors duration-200">
              Terms of Service
            </Link>
            {" • "}
            <Link to="/contact" className="hover:text-blue-600 transition-colors duration-200">
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
