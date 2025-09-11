"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { BookOpen, Shield, Users, AlertCircle, CheckCircle, Scale, FileText, Clock } from "lucide-react"

const TermsPage = () => {
  const pageRef = useRef(null)
  const headerRef = useRef(null)
  const sectionsRef = useRef(null)
  const sidebarRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Header animation
      tl.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })

      // Sidebar animation
      tl.fromTo(
        sidebarRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      )

      // Sections animation
      tl.fromTo(
        sectionsRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.6",
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <section ref={headerRef} className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-sm font-medium">
            <FileText className="h-3 w-3 mr-2" />
            Legal Information
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Terms &{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Conditions
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Please read these terms and conditions carefully before using BookBazaar platform.
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            Last updated: January 2025
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Sidebar Navigation */}
            <div ref={sidebarRef} className="lg:col-span-1">
              <div className="sticky top-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Navigation</h3>
                <nav className="space-y-2">
                  {[
                    { id: "acceptance", title: "Acceptance of Terms", icon: CheckCircle },
                    { id: "platform", title: "Platform Overview", icon: BookOpen },
                    { id: "user-responsibilities", title: "User Responsibilities", icon: Users },
                    { id: "book-sharing", title: "Book Sharing Guidelines", icon: BookOpen },
                    { id: "payments", title: "Payments & Pricing", icon: Scale },
                    { id: "privacy", title: "Privacy & Data", icon: Shield },
                    { id: "prohibited", title: "Prohibited Activities", icon: AlertCircle },
                    { id: "disputes", title: "Dispute Resolution", icon: Scale },
                    { id: "liability", title: "Liability & Disclaimers", icon: Shield },
                    { id: "contact", title: "Contact Information", icon: FileText },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Terms Content */}
            <div ref={sectionsRef} className="lg:col-span-3 space-y-8">
              {/* Acceptance of Terms */}
              <section id="acceptance" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p>
                    By accessing and using BookBazaar, you accept and agree to be bound by the terms and provision of
                    this agreement. BookBazaar is a student-led initiative developed by <strong>Vipul Attri</strong>, a
                    BTech student at <strong>K.C Group of Institutions</strong>.
                  </p>
                  <p>
                    If you do not agree to abide by the above, please do not use this service. This platform is designed
                    to facilitate the sharing of textbooks between senior and junior students at affordable prices or
                    for free.
                  </p>
                </div>
              </section>

              {/* Platform Overview */}
              <section id="platform" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold">2. Platform Overview</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p>
                    BookBazaar is an educational initiative that connects students within university communities to
                    share textbooks and academic resources. Our platform enables:
                  </p>
                  <ul>
                    <li>Senior students to list their used textbooks for sale or donation</li>
                    <li>Junior students to find affordable textbooks from their seniors</li>
                    <li>Free exchange of academic resources within the student community</li>
                    <li>Building connections between students across different academic years</li>
                  </ul>
                </div>
              </section>

              {/* User Responsibilities */}
              <section id="user-responsibilities" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold">3. User Responsibilities</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>For All Users:</h3>
                  <ul>
                    <li>Provide accurate and truthful information about yourself and listed books</li>
                    <li>Maintain respectful communication with other users</li>
                    <li>Report any suspicious or inappropriate behavior</li>
                    <li>Keep your account information secure and confidential</li>
                  </ul>
                  <h3>For Book Sellers/Donors:</h3>
                  <ul>
                    <li>Accurately describe the condition of books being listed</li>
                    <li>Provide clear photos of the books when possible</li>
                    <li>Honor agreed-upon prices and meeting arrangements</li>
                    <li>Ensure books are legitimate and not pirated copies</li>
                  </ul>
                  <h3>For Book Buyers:</h3>
                  <ul>
                    <li>Communicate clearly about your requirements</li>
                    <li>Honor payment commitments and meeting arrangements</li>
                    <li>Treat borrowed or purchased books with care</li>
                  </ul>
                </div>
              </section>

              {/* Book Sharing Guidelines */}
              <section id="book-sharing" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold">4. Book Sharing Guidelines</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>Acceptable Books:</h3>
                  <ul>
                    <li>Legitimate textbooks and academic materials</li>
                    <li>Reference books and study guides</li>
                    <li>Course-specific materials and handbooks</li>
                    <li>Educational software and digital resources (with proper licensing)</li>
                  </ul>
                  <h3>Prohibited Items:</h3>
                  <ul>
                    <li>Pirated or illegally copied materials</li>
                    <li>Damaged books that are unusable</li>
                    <li>Non-academic materials unrelated to education</li>
                    <li>Materials that violate copyright laws</li>
                  </ul>
                </div>
              </section>

              {/* Payments & Pricing */}
              <section id="payments" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Scale className="w-6 h-6 text-orange-600 mr-3" />
                  <h2 className="text-2xl font-bold">5. Payments & Pricing</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p>
                    BookBazaar facilitates connections between students but does not process payments directly. All
                    financial transactions occur between users.
                  </p>
                  <h3>Pricing Guidelines:</h3>
                  <ul>
                    <li>Sellers are encouraged to offer fair, student-friendly prices</li>
                    <li>Free donations are highly encouraged and appreciated</li>
                    <li>Prices should reflect the book's condition and market value</li>
                    <li>No platform fees are charged by BookBazaar</li>
                  </ul>
                  <h3>Payment Methods:</h3>
                  <ul>
                    <li>Cash transactions during in-person meetings</li>
                    <li>Digital payments (UPI, bank transfers) as agreed between users</li>
                    <li>Users are responsible for their own payment security</li>
                  </ul>
                </div>
              </section>

              {/* Privacy & Data */}
              <section id="privacy" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold">6. Privacy & Data Protection</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>Information We Collect:</h3>
                  <ul>
                    <li>Basic profile information (name, email, institution)</li>
                    <li>Book listings and transaction history</li>
                    <li>Communication between users (for safety purposes)</li>
                  </ul>
                  <h3>How We Use Your Information:</h3>
                  <ul>
                    <li>To facilitate book sharing connections</li>
                    <li>To improve platform functionality</li>
                    <li>To ensure user safety and prevent misuse</li>
                    <li>To communicate important platform updates</li>
                  </ul>
                  <h3>Data Security:</h3>
                  <ul>
                    <li>We implement reasonable security measures to protect your data</li>
                    <li>Personal information is not shared with third parties without consent</li>
                    <li>Users can request data deletion by contacting us</li>
                  </ul>
                </div>
              </section>

              {/* Prohibited Activities */}
              <section id="prohibited" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold">7. Prohibited Activities</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p>The following activities are strictly prohibited on BookBazaar:</p>
                  <ul>
                    <li>Sharing or selling pirated, copied, or illegally obtained materials</li>
                    <li>Harassment, bullying, or inappropriate behavior toward other users</li>
                    <li>Creating fake accounts or providing false information</li>
                    <li>Using the platform for commercial purposes unrelated to education</li>
                    <li>Attempting to hack, disrupt, or damage the platform</li>
                    <li>Spamming or sending unsolicited messages</li>
                    <li>Violating any applicable laws or regulations</li>
                  </ul>
                  <p>
                    Violation of these terms may result in account suspension or termination, and may be reported to
                    appropriate authorities if necessary.
                  </p>
                </div>
              </section>

              {/* Dispute Resolution */}
              <section id="disputes" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Scale className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold">8. Dispute Resolution</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>Between Users:</h3>
                  <ul>
                    <li>Users are encouraged to resolve disputes amicably through direct communication</li>
                    <li>BookBazaar can provide mediation assistance when requested</li>
                    <li>Serious disputes may be escalated to institution authorities</li>
                  </ul>
                  <h3>Platform-Related Issues:</h3>
                  <ul>
                    <li>Technical issues should be reported through our contact form</li>
                    <li>Policy violations can be reported for investigation</li>
                    <li>Appeals for account actions can be submitted within 30 days</li>
                  </ul>
                </div>
              </section>

              {/* Liability & Disclaimers */}
              <section id="liability" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold">9. Liability & Disclaimers</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>Platform Limitations:</h3>
                  <ul>
                    <li>BookBazaar is provided "as is" without warranties of any kind</li>
                    <li>We do not guarantee the accuracy of book listings or user information</li>
                    <li>The platform may experience downtime or technical issues</li>
                  </ul>
                  <h3>User Responsibility:</h3>
                  <ul>
                    <li>Users are responsible for their own transactions and interactions</li>
                    <li>BookBazaar is not liable for disputes between users</li>
                    <li>Users should exercise caution when meeting in person or making payments</li>
                  </ul>
                  <h3>Developer Disclaimer:</h3>
                  <p>
                    This platform is developed and maintained by <strong>Vipul Attri</strong> as a student project.
                    While every effort is made to ensure platform security and functionality, users acknowledge that
                    this is an educational initiative with inherent limitations.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold">10. Contact Information</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p>
                    For questions about these terms and conditions, or to report issues with the platform, please
                    contact us:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>Developer:</strong> Vipul Attri
                    </p>
                    <p>
                      <strong>Institution:</strong> K.C Group of Institutions
                    </p>
                    <p>
                      <strong>Email:</strong> bookbazaar.initiative@gmail.com
                    </p>
                    <p>
                      <strong>Platform:</strong> BookBazaar Initiative
                    </p>
                  </div>
                  <p>
                    <strong>Changes to Terms:</strong> These terms may be updated periodically. Users will be notified
                    of significant changes through the platform or email. Continued use of BookBazaar after changes
                    constitutes acceptance of the updated terms.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Background Elements */}
      <div className="fixed top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-10 animate-pulse pointer-events-none"></div>
      <div
        className="fixed bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-10 animate-pulse pointer-events-none"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="fixed top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-10 animate-pulse pointer-events-none"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  )
}

export default TermsPage
