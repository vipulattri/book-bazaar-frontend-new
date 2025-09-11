"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { GraduationCap, BookOpen, Users, Heart, DollarSign, Recycle } from "lucide-react"

const Stats = () => {
  const statsRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)

  const stats = [
    {
      icon: BookOpen,
      value: "15,000+",
      label: "Textbooks Available",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      value: "8,500+",
      label: "Student Members",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Heart,
      value: "3,200+",
      label: "Books Donated",
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      icon: DollarSign,
      value: "$450K+",
      label: "Money Saved",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Recycle,
      value: "12,000+",
      label: "Books Recycled",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: GraduationCap,
      value: "150+",
      label: "Universities",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
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
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Stats cards animation
      gsap.fromTo(
        cardsRef.current.children,
        { y: 80, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Number counting animation
      stats.forEach((stat, index) => {
        const numberElement = cardsRef.current.children[index].querySelector(".stat-number")
        const finalValue = stat.value.replace(/[^\d]/g, "")

        if (finalValue) {
          gsap.fromTo(
            numberElement,
            { textContent: 0 },
            {
              textContent: finalValue,
              duration: 2,
              ease: "power2.out",
              snap: { textContent: 1 },
              scrollTrigger: {
                trigger: cardsRef.current.children[index],
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
              },
              onUpdate: function () {
                const currentValue = Math.round(this.targets()[0].textContent)
                numberElement.textContent = currentValue.toLocaleString() + stat.value.replace(/[\d,]/g, "")
              },
            },
          )
        }
      })

      // Hover animations for cards
      cardsRef.current.children.forEach((card, index) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.05,
            y: -5,
            duration: 0.3,
            ease: "power2.out",
          })
        })

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          })
        })
      })
    }, statsRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={statsRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900">
            Making Education Affordable
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Together, we're building a community where every student can access the books they need to succeed.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center cursor-pointer">
              <div className="flex justify-center mb-3">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center transition-all duration-300`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="stat-number text-2xl font-bold mb-1 text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
