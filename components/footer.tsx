import Link from "next/link"
import { GraduationCap, Facebook, Twitter, Instagram, Mail, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">BookBazaar</span>
                <span className="text-xs text-muted-foreground">Student Book Exchange</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting students to make education affordable. Help your juniors succeed by sharing your textbooks.
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              Made with love for students
            </div>
            <div className="flex space-x-2">
              <Button size="icon" variant="ghost">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* For Students */}
          <div>
            <h3 className="font-semibold mb-4">For Students</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/books" className="text-muted-foreground hover:text-foreground">
                  Find Textbooks
                </Link>
              </li>
              <li>
                <Link href="/books/add" className="text-muted-foreground hover:text-foreground">
                  Sell Your Books
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-muted-foreground hover:text-foreground">
                  Donate Books
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-foreground">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-muted-foreground hover:text-foreground">
                  Safety Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="font-semibold mb-4">Popular Subjects</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/books?subject=mathematics" className="text-muted-foreground hover:text-foreground">
                  Mathematics
                </Link>
              </li>
              <li>
                <Link href="/books?subject=computer-science" className="text-muted-foreground hover:text-foreground">
                  Computer Science
                </Link>
              </li>
              <li>
                <Link href="/books?subject=biology" className="text-muted-foreground hover:text-foreground">
                  Biology
                </Link>
              </li>
              <li>
                <Link href="/books?subject=physics" className="text-muted-foreground hover:text-foreground">
                  Physics
                </Link>
              </li>
              <li>
                <Link href="/books?subject=economics" className="text-muted-foreground hover:text-foreground">
                  Economics
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support Our Mission</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Help us reach more students and make education accessible to everyone.
            </p>
            <div className="space-y-2">
              <Button className="w-full" size="sm">
                Spread the Word
              </Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm">
                Partner with Us
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 BookBazaar. Built by students, for students. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            {" • "}
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            {" • "}
            <Link href="/contact" className="hover:text-foreground">
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
