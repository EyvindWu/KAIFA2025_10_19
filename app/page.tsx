'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Truck, 
  Search, 
  Calendar, 
  User, 
  Package, 
  MapPin, 
  Clock,
  ArrowRight,
  Star,
  Shield,
  Zap
} from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('ship')

  const navigation = [
    { name: 'Ship', href: '#', icon: Package, current: activeTab === 'ship' },
    { name: 'Track', href: '#', icon: Search, current: activeTab === 'track' },
    { name: 'Schedule', href: '#', icon: Calendar, current: activeTab === 'schedule' },
    { name: 'Account', href: '#', icon: User, current: activeTab === 'account' },
  ]

  const logisticsPartners = [
    { name: 'UPS', logo: '🚚', rating: 4.8 },
    { name: 'TNT', logo: '📦', rating: 4.6 },
    { name: 'DHL', logo: '✈️', rating: 4.9 },
    { name: 'FedEx', logo: '🚛', rating: 4.7 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EuroLogistics</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name.toLowerCase())}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Logistics for European Merchants
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with leading logistics providers across Europe. Ship, track, and manage your deliveries with ease.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Ship Packages</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Create shipments with our partner logistics companies including UPS, TNT, DHL, and FedEx.
            </p>
            <Link href="/ship" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              Start Shipping <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Search className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Track Deliveries</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Real-time tracking for all your shipments across multiple logistics providers.
            </p>
            <Link href="/track" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
              Track Now <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Schedule Pickups</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Schedule convenient pickup times and manage your pickup locations.
            </p>
            <Link href="/schedule" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
              Schedule <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Partner Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Logistics Partners</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {logisticsPartners.map((partner) => (
              <div key={partner.name} className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="text-3xl mb-2">{partner.logo}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{partner.name}</h3>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  {partner.rating}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
            <p className="text-gray-600">Quick setup and reliable delivery across Europe</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h3>
            <p className="text-gray-600">Your packages are protected with full insurance coverage</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600">Round-the-clock customer support for all your needs</p>
          </div>
        </div>
      </main>
    </div>
  )
} 