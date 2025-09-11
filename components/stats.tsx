import { GraduationCap, BookOpen, Users, Heart, DollarSign, Recycle } from "lucide-react"

export function Stats() {
  const stats = [
    {
      icon: BookOpen,
      value: "15,000+",
      label: "Textbooks Available",
      color: "text-blue-600",
    },
    {
      icon: Users,
      value: "8,500+",
      label: "Student Members",
      color: "text-green-600",
    },
    {
      icon: Heart,
      value: "3,200+",
      label: "Books Donated",
      color: "text-red-500",
    },
    {
      icon: DollarSign,
      value: "$450K+",
      label: "Money Saved",
      color: "text-yellow-600",
    },
    {
      icon: Recycle,
      value: "12,000+",
      label: "Books Recycled",
      color: "text-purple-600",
    },
    {
      icon: GraduationCap,
      value: "150+",
      label: "Universities",
      color: "text-indigo-600",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Making Education Affordable</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Together, we're building a community where every student can access the books they need to succeed.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
