"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Shield, Eye, Lock, Database, Users, Mail, Cookie, Trash2, Settings, AlertTriangle } from "lucide-react"

const PrivacyPage = () => {
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
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-green-100 text-green-800 border border-green-200 rounded-full text-sm font-medium">
            <Shield className="h-3 w-3 mr-2" />
            Your Privacy Matters
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Privacy{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            We are committed to protecting your privacy and ensuring the security of your personal information on
            BookBazaar.
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Settings className="w-4 h-4 mr-2" />
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
                <h3 className="font-semibold text-gray-900 mb-4">Privacy Sections</h3>
                <nav className="space-y-2">
                  {[
                    { id: "overview", title: "Privacy Overview", icon: Shield },
                    { id: "information-collected", title: "Information We Collect", icon: Database },
                    { id: "how-we-use", title: "How We Use Information", icon: Eye },
                    { id: "information-sharing", title: "Information Sharing", icon: Users },
                    { id: "data-security", title: "Data Security", icon: Lock },
                    { id: "cookies", title: "Cookies & Tracking", icon: Cookie },
                    { id: "user-rights", title: "Your Rights", icon: Settings },
                    { id: "data-retention", title: "Data Retention", icon: Trash2 },
                    { id: "third-party", title: "Third-Party Services", icon: AlertTriangle },
                    { id: "contact-privacy", title: "Privacy Contact", icon: Mail },
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

            {/* Privacy Content */}
            <div ref={sectionsRef} className="lg:col-span-3 space-y-8">
              {/* Privacy Overview */}
              <section id="overview" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold">1. Privacy Overview</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p>
                    BookBazaar is a student-led initiative developed by <strong>Vipul Attri</strong>, a BTech student at{" "}
                    <strong>K.C Group of Institutions</strong>. We are committed to protecting your privacy and being
                    transparent about how we collect, use, and protect your personal information.
                  </p>
                  <p>
                    This Privacy Policy explains how we handle your information when you use our platform to share
                    textbooks and connect with fellow students. We believe in minimal data collection and maximum
                    transparency.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium">
                      <strong>Key Principle:</strong> We only collect information that is necessary to provide our
                      service and ensure a safe, educational environment for all users.
                    </p>
                  </div>
                </div>
              </section>

              {/* Information We Collect */}
              <section id="information-collected" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Database className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold">2. Information We Collect</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>Personal Information You Provide:</h3>
                  <ul>
                    <li>
                      <strong>Account Information:</strong> Name, email address, student ID (optional), institution name
                    </li>
                    <li>
                      <strong>Profile Information:</strong> Academic year, course/major, profile picture (optional)
                    </li>
                    <li>
                      <strong>Contact Information:</strong> Phone number (for book exchanges), preferred contact method
                    </li>
                    <li>
                      <strong>Book Listings:</strong> Book details, condition, pricing, photos, descriptions
                    </li>
                  </ul>

                  <h3>Information Collected Automatically:</h3>
                  <ul>
                    <li>
                      <strong>Usage Data:</strong> Pages visited, time spent on platform, search queries
                    </li>
                    <li>
                      <strong>Device Information:</strong> Browser type, operating system, IP address
                    </li>
                    <li>
                      <strong>Log Data:</strong> Access times, error logs, performance metrics
                    </li>
                  </ul>

                  <h3>Communication Data:</h3>
                  <ul>
                    <li>Messages between users (for safety and dispute resolution)</li>
                    <li>Support requests and feedback</li>
                    <li>Reports of inappropriate behavior</li>
                  </ul>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800">
                      <strong>Note:</strong> We do not collect sensitive personal information such as financial data,
                      government IDs, or detailed academic records unless specifically required for platform
                      functionality.
                    </p>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section id="how-we-use" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold">3. How We Use Your Information</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>Primary Uses:</h3>
                  <ul>
                    <li>
                      <strong>Platform Functionality:</strong> Enable book listings, search, and user connections
                    </li>
                    <li>
                      <strong>Communication:</strong> Facilitate messages between buyers and sellers
                    </li>
                    <li>
                      <strong>User Safety:</strong> Verify student status and prevent misuse
                    </li>
                    <li>
                      <strong>Platform Improvement:</strong> Analyze usage patterns to enhance user experience
                    </li>
                  </ul>

                  <h3>Secondary Uses:</h3>
                  <ul>
                    <li>Send important platform updates and notifications</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Prevent fraud, spam, and abuse</li>
                    <li>Comply with legal requirements when necessary</li>
                  </ul>

                  <h3>Analytics and Insights:</h3>
                  <ul>
                    <li>Understand which books are most in demand</li>
                    <li>Identify popular subjects and courses</li>
                    <li>Measure platform effectiveness and user satisfaction</li>
                    <li>Generate anonymized reports for educational purposes</li>
                  </ul>
                </div>
              </section>

              {/* Information Sharing */}
              <section id="information-sharing" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-orange-600 mr-3" />
                  <h2 className="text-2xl font-bold">4. Information Sharing</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>With Other Users:</h3>
                  <ul>
                    <li>Your public profile information (name, institution, academic year)</li>
                    <li>Book listings and descriptions you post</li>
                    <li>Contact information when you choose to share it for transactions</li>
                    <li>Ratings and reviews (if implemented)</li>
                  </ul>

                  <h3>We DO NOT Share:</h3>
                  <ul>
                    <li>Your email address without your explicit consent</li>
                    <li>Private messages between users</li>
                    <li>Personal contact information unless you choose to share it</li>
                    <li>Financial information or payment details</li>
                  </ul>

                  <h3>Limited Sharing Scenarios:</h3>
                  <ul>
                    <li>
                      <strong>Legal Requirements:</strong> When required by law or to protect user safety
                    </li>
                    <li>
                      <strong>Institution Cooperation:</strong> With your institution for academic integrity purposes
                    </li>
                    <li>
                      <strong>Safety Concerns:</strong> To prevent harm or investigate reported violations
                    </li>
                  </ul>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium">
                      <strong>Our Commitment:</strong> We will never sell your personal information to third parties or
                      use it for commercial advertising purposes.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section id="data-security" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Lock className="w-6 h-6 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold">5. Data Security</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>Security Measures:</h3>
                  <ul>
                    <li>
                      <strong>Encryption:</strong> All data transmission is encrypted using HTTPS/SSL protocols
                    </li>
                    <li>
                      <strong>Access Control:</strong> Limited access to personal data on a need-to-know basis
                    </li>
                    <li>
                      <strong>Regular Updates:</strong> Platform security is regularly reviewed and updated
                    </li>
                    <li>
                      <strong>Secure Storage:</strong> Data is stored on secure servers with appropriate protections
                    </li>
                  </ul>

                  <h3>User Security Tips:</h3>
                  <ul>
                    <li>Use a strong, unique password for your BookBazaar account</li>
                    <li>Don't share your login credentials with others</li>
                    <li>Be cautious when sharing personal contact information</li>
                    <li>Report suspicious activity immediately</li>
                  </ul>

                  <h3>Incident Response:</h3>
                  <ul>
                    <li>We monitor for security threats and unauthorized access</li>
                    <li>Users will be notified promptly of any security breaches</li>
                    <li>We work quickly to resolve security issues and prevent future incidents</li>
                  </ul>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-red-800">
                      <strong>Important:</strong> While we implement strong security measures, no system is 100% secure.
                      Please use caution when sharing personal information online.
                    </p>
                  </div>
                </div>
              </section>

              {/* Cookies & Tracking */}
              <section id="cookies" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Cookie className="w-6 h-6 text-yellow-600 mr-3" />
                  <h2 className="text-2xl font-bold">6. Cookies & Tracking</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>Types of Cookies We Use:</h3>
                  <ul>
                    <li>
                      <strong>Essential Cookies:</strong> Required for basic platform functionality and user
                      authentication
                    </li>
                    <li>
                      <strong>Preference Cookies:</strong> Remember your settings and preferences
                    </li>
                    <li>
                      <strong>Analytics Cookies:</strong> Help us understand how users interact with the platform
                    </li>
                  </ul>

                  <h3>Third-Party Services:</h3>
                  <ul>
                    <li>Google Analytics (for usage statistics) - can be opted out</li>
                    <li>Essential hosting and security services</li>
                    <li>No advertising or marketing tracking cookies</li>
                  </ul>

                  <h3>Managing Cookies:</h3>
                  <ul>
                    <li>You can control cookies through your browser settings</li>
                    <li>Disabling essential cookies may affect platform functionality</li>
                    <li>We provide cookie preferences in your account settings</li>
                  </ul>
                </div>
              </section>

              {/* Your Rights */}
              <section id="user-rights" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Settings className="w-6 h-6 text-indigo-600 mr-3" />
                  <h2 className="text-2xl font-bold">7. Your Privacy Rights</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>You Have the Right To:</h3>
                  <ul>
                    <li>
                      <strong>Access:</strong> Request a copy of all personal information we have about you
                    </li>
                    <li>
                      <strong>Correction:</strong> Update or correct inaccurate personal information
                    </li>
                    <li>
                      <strong>Deletion:</strong> Request deletion of your account and associated data
                    </li>
                    <li>
                      <strong>Portability:</strong> Receive your data in a portable format
                    </li>
                    <li>
                      <strong>Restriction:</strong> Limit how we process your personal information
                    </li>
                  </ul>

                  <h3>How to Exercise Your Rights:</h3>
                  <ul>
                    <li>Contact us through the platform's contact form</li>
                    <li>Email us at bookbazaar.initiative@gmail.com</li>
                    <li>Use the privacy settings in your account dashboard</li>
                    <li>We will respond to requests within 30 days</li>
                  </ul>

                  <h3>Account Controls:</h3>
                  <ul>
                    <li>Update your profile information anytime</li>
                    <li>Control who can see your contact information</li>
                    <li>Manage notification preferences</li>
                    <li>Delete your account and data permanently</li>
                  </ul>
                </div>
              </section>

              {/* Data Retention */}
              <section id="data-retention" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Trash2 className="w-6 h-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold">8. Data Retention</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>How Long We Keep Your Data:</h3>
                  <ul>
                    <li>
                      <strong>Active Accounts:</strong> Data is retained while your account is active
                    </li>
                    <li>
                      <strong>Inactive Accounts:</strong> Data may be deleted after 2 years of inactivity
                    </li>
                    <li>
                      <strong>Book Listings:</strong> Removed when you delete them or close your account
                    </li>
                    <li>
                      <strong>Messages:</strong> Retained for 1 year for safety and dispute resolution
                    </li>
                  </ul>

                  <h3>Legal and Safety Requirements:</h3>
                  <ul>
                    <li>Some data may be retained longer for legal compliance</li>
                    <li>Safety-related information may be kept to prevent future harm</li>
                    <li>Anonymized analytics data may be retained indefinitely</li>
                  </ul>

                  <h3>Data Deletion Process:</h3>
                  <ul>
                    <li>Account deletion removes most personal information immediately</li>
                    <li>Some data may take up to 90 days to be fully removed from backups</li>
                    <li>Anonymized data may remain for research and improvement purposes</li>
                  </ul>
                </div>
              </section>

              {/* Third-Party Services */}
              <section id="third-party" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                  <h2 className="text-2xl font-bold">9. Third-Party Services</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>Services We Use:</h3>
                  <ul>
                    <li>
                      <strong>Hosting Services:</strong> For platform infrastructure and data storage
                    </li>
                    <li>
                      <strong>Analytics:</strong> Google Analytics for usage insights (anonymized)
                    </li>
                    <li>
                      <strong>Email Services:</strong> For sending notifications and communications
                    </li>
                    <li>
                      <strong>Security Services:</strong> For protection against spam and abuse
                    </li>
                  </ul>

                  <h3>Third-Party Privacy:</h3>
                  <ul>
                    <li>We carefully select service providers with strong privacy practices</li>
                    <li>Third parties are contractually required to protect your data</li>
                    <li>We limit data sharing to what's necessary for service provision</li>
                  </ul>

                  <h3>External Links:</h3>
                  <ul>
                    <li>Our platform may contain links to external websites</li>
                    <li>We are not responsible for the privacy practices of external sites</li>
                    <li>Please review the privacy policies of any external sites you visit</li>
                  </ul>
                </div>
              </section>

              {/* Privacy Contact */}
              <section id="contact-privacy" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold">10. Privacy Contact & Updates</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3>Contact Information:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>Privacy Officer:</strong> Vipul Attri (Developer)
                    </p>
                    <p>
                      <strong>Institution:</strong> K.C Group of Institutions
                    </p>
                    <p>
                      <strong>Email:</strong> bookbazaar.initiative@gmail.com
                    </p>
                    <p>
                      <strong>Subject Line:</strong> "Privacy Inquiry - BookBazaar"
                    </p>
                  </div>

                  <h3>When to Contact Us:</h3>
                  <ul>
                    <li>Questions about this privacy policy</li>
                    <li>Requests to access, update, or delete your data</li>
                    <li>Privacy concerns or complaints</li>
                    <li>Suspected privacy violations</li>
                  </ul>

                  <h3>Policy Updates:</h3>
                  <ul>
                    <li>We may update this privacy policy periodically</li>
                    <li>Significant changes will be communicated via email or platform notification</li>
                    <li>Continued use after changes constitutes acceptance</li>
                    <li>Previous versions are available upon request</li>
                  </ul>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium">
                      <strong>Our Promise:</strong> We are committed to transparency and will always prioritize your
                      privacy and the educational mission of BookBazaar.
                    </p>
                  </div>
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

export default PrivacyPage
