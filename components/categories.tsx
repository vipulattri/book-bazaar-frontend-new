import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Atom, Dna, Code, TrendingUp, Globe, Palette, Gavel } from "lucide-react"

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
  { name: "Biology", icon: Dna, count: 1200, color: "bg-green-500", subjects: ["Anatomy", "Genetics", "Ecology"] },
  {
    name: "Computer Science",
    icon: Code,
    count: 2200,
    color: "bg-indigo-500",
    subjects: ["Programming", "Algorithms", "AI"],
  },
  { name: "Economics", icon: TrendingUp, count: 950, color: "bg-yellow-500", subjects: ["Micro", "Macro", "Finance"] },
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
  { name: "Law", icon: Gavel, count: 450, color: "bg-gray-600", subjects: ["Constitutional", "Criminal", "Corporate"] },
]

export function Categories() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse by Subject</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find textbooks for your courses across all academic disciplines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {category.count.toLocaleString()} books
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  {category.subjects.map((subject) => (
                    <Badge key={subject} variant="outline" className="text-xs mr-1 mb-1">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
