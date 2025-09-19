"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/app/context/auth-provider"

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [studentClass, setStudentClass] = useState("")
  const [college, setCollege] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("https://book-bazaar-backend-new-1.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
          class: studentClass,
          college,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Signup failed")
      }

      login(data.token, data.user)
      toast.success("Account created! Redirecting...")
      setTimeout(() => router.push("/"), 800)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                BookExchange
              </span>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
          <CardDescription className="text-sm">
            Join the community and start exchanging textbooks
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Full Name</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                <select id="role" className="border rounded-md h-10 px-3 bg-background" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class" className="text-sm font-medium">Class / Year</Label>
                <Input id="class" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} placeholder="e.g., 3rd Year" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="college" className="text-sm font-medium">College</Label>
              <Input id="college" value={college} onChange={(e) => setCollege(e.target.value)} />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 transition-colors" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6">
            <Separator className="my-6" />
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

