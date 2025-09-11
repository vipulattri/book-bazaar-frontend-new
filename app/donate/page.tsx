"use client"
import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, Users, Gift, Star, CheckCircle, ArrowRight, Download, Share2 } from 'lucide-react';

export default function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  const predefinedAmounts = [50, 100, 250, 500, 1000];

  useEffect(() => {
    setAnimateStats(true);
  }, []);

  const stats = [
    { number: '2,500+', label: 'Students Helped', icon: Users },
    { number: '15,000+', label: 'Books Donated', icon: BookOpen },
    { number: '₹5,00,000+', label: 'Books Worth', icon: Gift },
    { number: '95%', label: 'Happy Students', icon: Star }
  ];

  const impactStories = [
    {
      name: 'Priya Singh',
      story: 'Thanks to donated books, I could complete my engineering without financial burden on my family.',
      course: 'B.Tech Computer Science'
    },
    {
      name: 'Rahul Kumar',
      story: 'I received all my medical textbooks for free. Now I can focus on studies instead of worrying about costs.',
      course: 'MBBS 2nd Year'
    },
    {
      name: 'Anjali Sharma',
      story: 'The donated commerce books helped me score 85% in my finals. Education should be accessible to all!',
      course: 'B.Com Final Year'
    }
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const finalAmount = customAmount || selectedAmount;

  const generateQRCode = () => {
    // Generate UPI QR code URL - using a QR code generator service
    const upiString = `upi://pay?pa=attrivipul72@okaxis&pn=BookDonation&mc=0000&tid=123456789&tr=BookDonation&tn=Donation for Student Books&am=${finalAmount}&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Heart className="w-5 h-5 mr-2 text-red-300" />
              <span className="text-sm font-medium">Help Students Access Education</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Every Book You Donate
              <br />
              <span className="text-yellow-300">Changes a Life</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Many students can't afford textbooks. Your donation helps provide free books
              to those who need them most.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">₹250</div>
                <div className="text-sm text-blue-200">Can buy 1 textbook</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">₹500</div>
                <div className="text-sm text-blue-200">Can help 2 students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">₹1000</div>
                <div className="text-sm text-blue-200">Can support 4 students</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 mx-auto">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-3xl font-bold text-gray-800 mb-2 ${animateStats ? 'animate-pulse' : ''}`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Donation Form */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Make Your Donation Today
              </h2>
              <p className="text-lg text-gray-600">
                Choose an amount that feels right for you. Every rupee makes a difference.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Amount Selection */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Select Amount</h3>
                
                {/* Predefined Amounts */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 font-semibold ${
                        selectedAmount === amount
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter custom amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>

                {/* Impact Message */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start">
                    <Heart className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-800 mb-1">
                        Your ₹{finalAmount} donation will:
                      </div>
                      <div className="text-sm text-gray-600">
                        {finalAmount >= 1000 ? 'Help 4+ students get their required textbooks' :
                         finalAmount >= 500 ? 'Help 2 students access essential study materials' :
                         finalAmount >= 250 ? 'Buy 1 complete textbook for a needy student' :
                         'Contribute towards helping students access educational resources'}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowQR(true)}
                  disabled={!finalAmount || finalAmount < 10}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  Donate ₹{finalAmount}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>

              {/* QR Code Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Scan to Donate</h3>
                
                {showQR || finalAmount ? (
                  <div className="text-center">
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <img
                        src={generateQRCode()}
                        alt="UPI QR Code"
                        className="w-64 h-64 mx-auto rounded-lg shadow-md"
                      />
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                      <div className="text-sm text-gray-600 mb-2">UPI ID</div>
                      <div className="font-mono text-lg font-semibold text-blue-600">
                        attrivipul72@okaxis
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <button className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        <Download className="w-4 h-4 mr-2" />
                        Save QR
                      </button>
                      <button className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select an amount to generate QR code</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stories */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Stories of Impact
            </h2>
            <p className="text-lg text-gray-600">
              See how your donations are changing lives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {impactStories.map((story, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {story.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-800">{story.name}</div>
                    <div className="text-sm text-gray-600">{story.course}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{story.story}"</p>
                <div className="flex justify-end mt-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust & Transparency */}
      <div className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Trust Us?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">100% Transparency</h3>
              <p className="text-gray-600">Every donation is tracked and reported. You'll know exactly how your money helps students.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Direct Impact</h3>
              <p className="text-gray-600">Your donations go directly to purchasing books for students who cannot afford them.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Community Driven</h3>
              <p className="text-gray-600">Built by students, for students. We understand the challenges and work to solve them.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Change Lives?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Your donation today ensures no student goes without essential textbooks.
          </p>
          <button
            onClick={() => setShowQR(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors inline-flex items-center"
          >
            <Gift className="w-5 h-5 mr-2" />
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
}