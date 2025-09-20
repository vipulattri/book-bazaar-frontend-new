"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "../context/auth-provider"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  Edit3,
  Save,
  X,
  Camera,
  Settings,
  Award,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react"

const ProfilePage = () => {
  const { user } = useAuth()
  const pageRef = useRef(null)
  const headerRef = useRef(null)
  const contentRef = useRef(null)

  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    username: user?.username || "Student",
    email: user?.email || "student@college.edu",
    phone: "+91 98765 43210",
    college: user?.college || "Your College Name",
    class: user?.class || "Final Year",
    course: "Computer Science Engineering",
    year: "2025",
    bio: "Passionate reader and knowledge seeker. Love exchanging books and learning from others.",
    location: "Delhi, India",
    joinedDate: "January 2024",
    favoriteGenres: ["Technology", "Fiction", "Science", "Philosophy"],
    totalBooks: 15,
    booksExchanged: 8,
    rating: 4.8,
  })

  const [editData, setEditData] = useState(profileData)

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        username: user.username || prev.username,
        email: user.email || prev.email,
        college: user.college || prev.college,
        class: user.class || prev.class,
      }))
      setEditData(prev => ({
        ...prev,
        username: user.username || prev.username,
        email: user.email || prev.email,
        college: user.college || prev.college,
        class: user.class || prev.class,
      }))
    }
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(profileData)
  }

  const handleSave = () => {
    setProfileData(editData)
    setIsEditing(false)
    // Here you would typically save to backend
    console.log("Profile updated:", editData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(profileData)
  }

  const updateField = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const stats = [
    { icon: BookOpen, label: "Total Books", value: profileData.totalBooks, color: "blue" },
    { icon: Heart, label: "Books Exchanged", value: profileData.booksExchanged, color: "green" },
    { icon: Award, label: "Rating", value: `${profileData.rating}/5`, color: "yellow" },
    { icon: MessageCircle, label: "Member Since", value: profileData.joinedDate, color: "purple" },
  ]

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      {/* Header Section */}
      <section ref={headerRef} className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Cover Background */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>

              {/* Profile Content */}
              <div className="px-8 pb-8">
                {/* Profile Picture & Basic Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 relative z-10">
                  <div className="relative">
                    <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-blue-600 bg-gradient-to-br from-blue-100 to-purple-100">
                      {profileData.username.charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.username}</h1>
                        <div className="flex items-center text-gray-600 mb-2">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          <span>{profileData.course} • {profileData.class}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{profileData.college}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0">
                        {!isEditing ? (
                          <button
                            onClick={handleEdit}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSave}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <stat.icon className={`w-6 h-6 mx-auto mb-2 text-${stat.color}-600`} />
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section ref={contentRef} className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Main Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.username}
                        onChange={(e) => updateField("username", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{profileData.username}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        {profileData.email}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        {profileData.phone}
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        {profileData.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                  Academic Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* College */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">College/University</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.college}
                        onChange={(e) => updateField("college", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{profileData.college}</div>
                    )}
                  </div>

                  {/* Course */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.course}
                        onChange={(e) => updateField("course", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{profileData.course}</div>
                    )}
                  </div>

                  {/* Class/Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class/Year</label>
                    {isEditing ? (
                      <select
                        value={editData.class}
                        onChange={(e) => updateField("class", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="First Year">First Year</option>
                        <option value="Second Year">Second Year</option>
                        <option value="Third Year">Third Year</option>
                        <option value="Final Year">Final Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{profileData.class}</div>
                    )}
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Graduation</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.year}
                        onChange={(e) => updateField("year", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        {profileData.year}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell others about yourself, your reading interests, and what you're looking for..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Favorite Genres */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.favoriteGenres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View My Books
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </button>
                </div>
              </div>

              {/* Member Since */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Member Since</h3>
                <p className="text-gray-600">{profileData.joinedDate}</p>
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">Profile Completion</div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full w-4/5"></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">80% Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Elements */}
      <div className="fixed top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-10 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-10 animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>
      <div className="fixed top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-10 animate-pulse pointer-events-none" style={{ animationDelay: "2s" }}></div>
    </div>
  )
}

export default ProfilePage