"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import {
  Settings,
  Palette,
  Moon,
  Sun,
  Bell,
  Shield,
  User,
  Mail,
  Phone,
  Eye,
  Download,
  Trash2,
  Save,
  RefreshCw,
  Monitor,
} from "lucide-react"

const SettingsPage = () => {
  const pageRef = useRef(null)
  const headerRef = useRef(null)
  const sectionsRef = useRef(null)
  const sidebarRef = useRef(null)

  // Settings state
  const [settings, setSettings] = useState({
    // Appearance
    theme: "light", // light, dark, auto
    backgroundColor: "#ffffff",
    accentColor: "#3b82f6",
    fontSize: "medium", // small, medium, large, extra-large
    fontFamily: "inter", // inter, roboto, poppins, open-sans

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    bookAlerts: true,
    messageNotifications: true,
    weeklyDigest: false,

    // Privacy
    profileVisibility: "public", // public, students-only, private
    showEmail: false,
    showPhone: false,
    allowMessages: true,

    // Account
    language: "english",
    timezone: "Asia/Kolkata",
    autoSave: true,

    // Accessibility
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    largeButtons: false,
  })

  const [activeSection, setActiveSection] = useState("appearance")

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
        sectionsRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6",
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    // Save settings to localStorage or backend
    localStorage.setItem("bookbazaar-settings", JSON.stringify(settings))
    // Show success message
    console.log("Settings saved successfully!")
  }

  const resetSettings = () => {
    // Reset to default settings
    setSettings({
      theme: "light",
      backgroundColor: "#ffffff",
      accentColor: "#3b82f6",
      fontSize: "medium",
      fontFamily: "inter",
      emailNotifications: true,
      pushNotifications: true,
      bookAlerts: true,
      messageNotifications: true,
      weeklyDigest: false,
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
      allowMessages: true,
      language: "english",
      timezone: "Asia/Kolkata",
      autoSave: true,
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      largeButtons: false,
    })
  }

  const sidebarItems = [
    { id: "appearance", title: "Appearance", icon: Palette },
    { id: "notifications", title: "Notifications", icon: Bell },
    { id: "privacy", title: "Privacy", icon: Shield },
    { id: "account", title: "Account", icon: User },
    { id: "accessibility", title: "Accessibility", icon: Eye },
    { id: "data", title: "Data & Storage", icon: Download },
  ]

  return (
    <div
      ref={pageRef}
      className={`min-h-screen transition-colors duration-300 ${
        settings.theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
      style={{
        fontSize:
          settings.fontSize === "small"
            ? "14px"
            : settings.fontSize === "large"
              ? "18px"
              : settings.fontSize === "extra-large"
                ? "20px"
                : "16px",
        fontFamily:
          settings.fontFamily === "roboto"
            ? "Roboto, sans-serif"
            : settings.fontFamily === "poppins"
              ? "Poppins, sans-serif"
              : settings.fontFamily === "open-sans"
                ? "Open Sans, sans-serif"
                : "Inter, sans-serif",
      }}
    >
      {/* Header Section */}
      <section ref={headerRef} className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div
            className={`inline-flex items-center px-4 py-2 mb-6 rounded-full text-sm font-medium ${
              settings.theme === "dark"
                ? "bg-blue-900 text-blue-200 border border-blue-800"
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            <Settings className="h-3 w-3 mr-2" />
            Customize Your Experience
          </div>
          <h1
            className={`text-4xl md:text-6xl font-bold mb-6 ${
              settings.theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Settings &{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Preferences
            </span>
          </h1>
          <p className={`text-lg max-w-3xl mx-auto ${settings.theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Personalize your BookBazaar experience with custom themes, notifications, and privacy settings.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Sidebar Navigation */}
            <div ref={sidebarRef} className="lg:col-span-1">
              <div
                className={`sticky top-8 p-6 rounded-xl shadow-sm border ${
                  settings.theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
                }`}
              >
                <h3 className={`font-semibold mb-4 ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Settings Categories
                </h3>
                <nav className="space-y-2">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeSection === item.id
                          ? settings.theme === "dark"
                            ? "bg-blue-900 text-blue-200"
                            : "bg-blue-50 text-blue-600"
                          : settings.theme === "dark"
                            ? "text-gray-300 hover:text-blue-400 hover:bg-gray-700"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div ref={sectionsRef} className="lg:col-span-3">
              <div
                className={`p-8 rounded-xl shadow-sm border ${
                  settings.theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
                }`}
              >
                {/* Appearance Settings */}
                {activeSection === "appearance" && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <Palette className="w-6 h-6 text-blue-600 mr-3" />
                      <h2
                        className={`text-2xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}
                      >
                        Appearance Settings
                      </h2>
                    </div>

                    {/* Theme Selection */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-3 ${
                          settings.theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Theme
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "light", label: "Light", icon: Sun },
                          { value: "dark", label: "Dark", icon: Moon },
                          { value: "auto", label: "Auto", icon: Monitor },
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => updateSetting("theme", theme.value)}
                            className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
                              settings.theme === theme.value
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : settings.theme === "dark"
                                  ? "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            <theme.icon className="w-4 h-4 mr-2" />
                            {theme.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-3 ${
                          settings.theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Font Size
                      </label>
                      <select
                        value={settings.fontSize}
                        onChange={(e) => updateSetting("fontSize", e.target.value)}
                        className={`w-full p-3 rounded-lg border transition-colors ${
                          settings.theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-200 text-gray-900"
                        }`}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="extra-large">Extra Large</option>
                      </select>
                    </div>

                    {/* Font Family */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-3 ${
                          settings.theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Font Family
                      </label>
                      <select
                        value={settings.fontFamily}
                        onChange={(e) => updateSetting("fontFamily", e.target.value)}
                        className={`w-full p-3 rounded-lg border transition-colors ${
                          settings.theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-200 text-gray-900"
                        }`}
                      >
                        <option value="inter">Inter</option>
                        <option value="roboto">Roboto</option>
                        <option value="poppins">Poppins</option>
                        <option value="open-sans">Open Sans</option>
                      </select>
                    </div>

                    {/* Accent Color */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-3 ${
                          settings.theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Accent Color
                      </label>
                      <div className="flex space-x-3">
                        {["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"].map((color) => (
                          <button
                            key={color}
                            onClick={() => updateSetting("accentColor", color)}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                              settings.accentColor === color ? "border-gray-400 scale-110" : "border-gray-200"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeSection === "notifications" && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <Bell className="w-6 h-6 text-blue-600 mr-3" />
                      <h2
                        className={`text-2xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}
                      >
                        Notification Settings
                      </h2>
                    </div>

                    {[
                      {
                        key: "emailNotifications",
                        label: "Email Notifications",
                        desc: "Receive notifications via email",
                      },
                      { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications" },
                      { key: "bookAlerts", label: "Book Alerts", desc: "Notify when books you want are available" },
                      { key: "messageNotifications", label: "Message Notifications", desc: "New message alerts" },
                      { key: "weeklyDigest", label: "Weekly Digest", desc: "Weekly summary of platform activity" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                      >
                        <div>
                          <h3 className={`font-medium ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {item.label}
                          </h3>
                          <p className={`text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            {item.desc}
                          </p>
                        </div>
                        <button
                          onClick={() => updateSetting(item.key, !settings[item.key as keyof typeof settings])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings[item.key as keyof typeof settings] ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings[item.key as keyof typeof settings] ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Privacy Settings */}
                {activeSection === "privacy" && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <Shield className="w-6 h-6 text-blue-600 mr-3" />
                      <h2
                        className={`text-2xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}
                      >
                        Privacy Settings
                      </h2>
                    </div>

                    {/* Profile Visibility */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-3 ${
                          settings.theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Profile Visibility
                      </label>
                      <select
                        value={settings.profileVisibility}
                        onChange={(e) => updateSetting("profileVisibility", e.target.value)}
                        className={`w-full p-3 rounded-lg border transition-colors ${
                          settings.theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-200 text-gray-900"
                        }`}
                      >
                        <option value="public">Public</option>
                        <option value="students-only">Students Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    {/* Contact Information */}
                    {[
                      { key: "showEmail", label: "Show Email Address", icon: Mail },
                      { key: "showPhone", label: "Show Phone Number", icon: Phone },
                      { key: "allowMessages", label: "Allow Direct Messages", icon: Bell },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5 text-gray-400 mr-3" />
                          <span className={`font-medium ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {item.label}
                          </span>
                        </div>
                        <button
                          onClick={() => updateSetting(item.key, !settings[item.key as keyof typeof settings])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings[item.key as keyof typeof settings] ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings[item.key as keyof typeof settings] ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Account Settings */}
                {activeSection === "account" && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <User className="w-6 h-6 text-blue-600 mr-3" />
                      <h2
                        className={`text-2xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}
                      >
                        Account Settings
                      </h2>
                    </div>

                    {/* Language */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-3 ${
                          settings.theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => updateSetting("language", e.target.value)}
                        className={`w-full p-3 rounded-lg border transition-colors ${
                          settings.theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-200 text-gray-900"
                        }`}
                      >
                        <option value="english">English</option>
                        <option value="hindi">हिंदी (Hindi)</option>
                        <option value="punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                      </select>
                    </div>

                    {/* Timezone */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-3 ${
                          settings.theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSetting("timezone", e.target.value)}
                        className={`w-full p-3 rounded-lg border transition-colors ${
                          settings.theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-200 text-gray-900"
                        }`}
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                      </select>
                    </div>

                    {/* Auto Save */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                      <div>
                        <h3 className={`font-medium ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Auto Save
                        </h3>
                        <p className={`text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          Automatically save your work
                        </p>
                      </div>
                      <button
                        onClick={() => updateSetting("autoSave", !settings.autoSave)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.autoSave ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.autoSave ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* Accessibility Settings */}
                {activeSection === "accessibility" && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <Eye className="w-6 h-6 text-blue-600 mr-3" />
                      <h2
                        className={`text-2xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}
                      >
                        Accessibility Settings
                      </h2>
                    </div>

                    {[
                      { key: "highContrast", label: "High Contrast", desc: "Increase contrast for better visibility" },
                      { key: "reducedMotion", label: "Reduced Motion", desc: "Minimize animations and transitions" },
                      { key: "screenReader", label: "Screen Reader Support", desc: "Optimize for screen readers" },
                      {
                        key: "largeButtons",
                        label: "Large Buttons",
                        desc: "Increase button sizes for easier clicking",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                      >
                        <div>
                          <h3 className={`font-medium ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {item.label}
                          </h3>
                          <p className={`text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            {item.desc}
                          </p>
                        </div>
                        <button
                          onClick={() => updateSetting(item.key, !settings[item.key as keyof typeof settings])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings[item.key as keyof typeof settings] ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings[item.key as keyof typeof settings] ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Data & Storage Settings */}
                {activeSection === "data" && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <Download className="w-6 h-6 text-blue-600 mr-3" />
                      <h2
                        className={`text-2xl font-bold ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}
                      >
                        Data & Storage
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <Download className="w-5 h-5 text-blue-600 mr-3" />
                          <div className="text-left">
                            <h3 className={`font-medium ${settings.theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              Export Data
                            </h3>
                            <p className={`text-sm ${settings.theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                              Download all your BookBazaar data
                            </p>
                          </div>
                        </div>
                      </button>

                      <button className="w-full flex items-center justify-between p-4 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-red-600">
                        <div className="flex items-center">
                          <Trash2 className="w-5 h-5 mr-3" />
                          <div className="text-left">
                            <h3 className="font-medium">Delete Account</h3>
                            <p className="text-sm text-red-500">Permanently delete your account and data</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={saveSettings}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </button>
                  <button
                    onClick={resetSettings}
                    className={`flex items-center px-6 py-3 rounded-lg border transition-colors ${
                      settings.theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Default
                  </button>
                </div>
              </div>
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

export default SettingsPage
