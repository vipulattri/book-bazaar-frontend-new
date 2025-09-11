"use client"
import { useRouter } from 'next/router'
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
export async function getServerSideProps() {
  return {
    props: {},
  };
}

const BooksPage = () => {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(pageRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Student Textbooks</h1>
        <p className="text-gray-600 mb-8">Find affordable books from your fellow students</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-2">Mathematics</h3>
            <p className="text-gray-600">Find calculus, algebra, and statistics textbooks</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-2">Computer Science</h3>
            <p className="text-gray-600">Programming, algorithms, and software engineering books</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-2">Biology</h3>
            <p className="text-gray-600">Biology, chemistry, and life sciences textbooks</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BooksPage
