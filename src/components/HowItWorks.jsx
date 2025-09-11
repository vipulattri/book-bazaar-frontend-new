"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Search, MessageCircle, HandHeart, BookOpen } from "lucide-react"

const HowItWorks = () => {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)

  const steps = [
    {
      icon: Search,
      title: "Search for Books",
      description: "Find textbooks by subject, course code, or ISBN. Filter by your university and semester.",
      color: "bg-blue-500",
    },
    {
      icon: MessageCircle,
      title: "Connect with Seniors",
      description: "Message senior students directly. Negotiate prices or ask about book condition.",
      color: "bg-green-500",
    },
    {
      icon: HandHeart,
      title: "Meet & Exchange",
      description: "Meet safely on campus to exchange books and payment. Build lasting connections.",
      color: "bg-purple-500",
    },
    {
      icon: BookOpen,
      title: "Pay It Forward",
      description: "When you're done, list your books to help the next generation of students.",
      color: "bg-orange-500",
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

      // Cards stagger animation
      gsap.fromTo(
        cardsRef.current.children,
        { y: 100, opacity: 0, rotationY: 45 },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Icon animations
      cardsRef.current.children.forEach((card, index) => {
        const icon = card.querySelector(".step-icon")
        const number = card.querySelector(".step-number")

        // Icon floating animation
        gsap.to(icon, {
          y: -5,
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.5,
        })

        // Number pulse animation
        gsap.to(number, {
          scale: 1.1,
          duration: 1.5,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.3,
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
            rotation: 360,
            duration: 0.5,
            ease: "back.out(1.7)",
          })
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
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900">How BookBazaar Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to connect students and make textbooks affordable for everyone.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
            >
              <div className="p-6 text-center">
                <div className="relative mb-4">
                  <div
                    className={`step-icon w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300`}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="step-number absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>

              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
