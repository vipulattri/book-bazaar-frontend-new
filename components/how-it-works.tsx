import { Card, CardContent } from "@/components/ui/card"
import { Search, MessageCircle, HandHeart, BookOpen } from "lucide-react"

export function HowItWorks() {
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

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How BookBazaar Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple steps to connect students and make textbooks affordable for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <div
                    className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
