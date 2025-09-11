import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AuthRedirect from "@/components/AuthRedirect"
import { AuthProvider } from "../app/context/auth-provider" // Make sure this exists

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BookExchange - Your Literary Marketplace",
  description: "Buy, sell, and exchange books with fellow book lovers",
  generator: 'Vipul'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AuthRedirect />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}