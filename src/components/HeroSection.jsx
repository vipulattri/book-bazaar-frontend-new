"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import Link from "next/link"
import { Search, BookOpen, Users } from "lucide-react"
import * as THREE from "three"

const HeroSection = () => {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const searchRef = useRef(null)
  const buttonsRef = useRef(null)
  const badgeRef = useRef(null)
  const tagsRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Three.js setup
    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 100
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.6,
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    camera.position.z = 3

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      particlesMesh.rotation.x += 0.001
      particlesMesh.rotation.y += 0.002

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    // GSAP animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Badge animation
      tl.fromTo(
        badgeRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" },
      )

      // Title animation with text reveal effect
      tl.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.3",
      )

      // Subtitle animation
      tl.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      )

      // Search bar animation
      tl.fromTo(
        searchRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3",
      )

      // Buttons stagger animation
      tl.fromTo(
        buttonsRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4",
      )

      // Tags animation
      tl.fromTo(
        tagsRef.current.children,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.7)" },
        "-=0.2",
      )

      // Floating animation for the entire hero
      gsap.to(heroRef.current, {
        y: -10,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      })
    }, heroRef)

    return () => {
      ctx.revert()
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
    }
  }, [])

  const handleSearchFocus = () => {
    gsap.to(searchRef.current, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out",
    })
  }

  const handleSearchBlur = () => {
    gsap.to(searchRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    })
  }

  return (
    <section className="relative overflow-hidden bg-white py-20">
      {/* Three.js Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />

      <div className="container mx-auto px-4 relative" style={{ zIndex: 2 }}>
        <div ref={heroRef} className="mx-auto max-w-4xl text-center">
          {/* Mission Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center px-4 py-2 mb-6 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium"
          >
            <BookOpen className="h-3 w-3 mr-2" />
            Learning Redefined Through Community
          </div>

          <h1 ref={titleRef} className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            Learning{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Redefined
            </span>
          </h1>

          <p ref={subtitleRef} className="text-lg leading-8 text-gray-600 max-w-3xl mx-auto mb-10">
            Dive into a world where education meets opportunity. Connect with senior students to access affordable
            textbooks, share knowledge, and build a learning community that empowers everyone.
          </p>

          {/* Search Bar */}
          <div ref={searchRef} className="flex max-w-md mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search internships, projects, mentors..."
                className="w-full pl-10 pr-4 h-12 text-lg border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
            </div>
            <button className="h-12 px-8 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Search
            </button>
          </div>

          {/* Quick Actions */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/internships"
              className="h-12 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 transform flex items-center justify-center font-medium shadow-lg"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Find Opportunities
            </Link>
            <Link
              href="/projects"
              className="h-12 px-8 bg-transparent border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105 transform flex items-center justify-center font-medium"
            >
              Share Knowledge
            </Link>
            <Link
              href="/mentors"
              className="h-12 px-8 bg-green-50 border-2 border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 hover:scale-105 transform flex items-center justify-center font-medium"
            >
              <Users className="h-4 w-4 mr-2" />
              Connect & Learn
            </Link>
          </div>

          {/* Popular Searches */}
          <div>
            <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
            <div ref={tagsRef} className="flex flex-wrap justify-center gap-2">
              {[
                "Software Engineering",
                "Data Science",
                "Product Management",
                "UI/UX Design",
                "Machine Learning",
                "Web Development",
              ].map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 hover:scale-105 transform shadow-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Additional floating elements */}
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-yellow-200 rounded-full opacity-15 animate-bounce"></div>
      <div
        className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-indigo-200 rounded-full opacity-15 animate-pulse"
        style={{ animationDelay: "3s" }}
      ></div>
    </section>
  )
}

export default HeroSection