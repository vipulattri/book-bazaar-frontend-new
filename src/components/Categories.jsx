"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Calculator, Atom, Dna, Code, TrendingUp, Globe, Palette, Gavel } from "lucide-react"

const Categories = () => {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)

  const categories = [
    {
      name: "Mathematics",
      icon: Calculator,
      count: 2500,
      color: "bg-blue-500",
      subjects: ["Calculus", "Statistics", "Linear Algebra"],
    },
    {
      name: "Physics",
      icon: Atom,
      count: 1800,
      color: "bg-purple-500",
      subjects: ["Mechanics", "Thermodynamics", "Quantum"],
    },
    {
      name: "Biology",
      icon: Dna,
      count: 1200,
      color: "bg-green-500",
      subjects: ["Anatomy", "Genetics", "Ecology"],
    },
    {
      name: "Computer Science",
      icon: Code,
      count: 2200,
      color: "bg-indigo-500",
      subjects: ["Programming", "Algorithms", "AI"],
    },
    {
      name: "Economics",
      icon: TrendingUp,
      count: 950,
      color: "bg-yellow-500",
      subjects: ["Micro", "Macro", "Finance"],
    },
    {
      name: "Social Sciences",
      icon: Globe,
      count: 800,
      color: "bg-cyan-500",
      subjects: ["Psychology", "Sociology", "Politics"],
    },
    {
      name: "Arts & Literature",
      icon: Palette,
      count: 600,
      color: "bg-pink-500",
      subjects: ["History", "Philosophy", "Literature"],
    },
    {
      name: "Law",
      icon: Gavel,
      count: 450,
      color: "bg-gray-600",
      subjects: ["Constitutional", "Criminal", "Corporate"],
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

      // Cards grid animation with wave effect
      gsap.fromTo(
        cardsRef.current.children,
        {
          y: 60,
          opacity: 0,
          scale: 0.8,
          rotation: -10,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: {
            amount: 0.8,
            grid: [2, 4],
            from: "start",
          },
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Individual card animations
      cardsRef.current.children.forEach((card, index) => {
        const icon = card.querySelector(".category-icon")
        const subjects = card.querySelectorAll(".subject-tag")

        // Icon floating animation
        gsap.to(icon, {
          y: -3,
          duration: 2 + index * 0.1,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        })

        // Hover animations
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.05,
            y: -10,
            duration: 0.3,
            ease: "power2.out",
          })

          gsap.to(icon, {
            scale: 1.2,
            rotation: 15,
            duration: 0.3,
            ease: "back.out(1.7)",
          })

          gsap.fromTo(
            subjects,
            { scale: 0.8, opacity: 0.7 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.2,
              stagger: 0.05,
              ease: "power2.out",
            },
          )
        })

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          })

          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          })
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">Browse by Subject</h2>
          <p className="mt-4 text-lg text-gray-600">Find textbooks for your courses across all academic disciplines</p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div
                    className={`category-icon w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mr-4 transition-all duration-300`}
                  >
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {category.count.toLocaleString()} books
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  {category.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="subject-tag inline-block px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 mr-1 mb-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
