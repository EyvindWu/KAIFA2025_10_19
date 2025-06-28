'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Search, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle,
  Truck,
  AlertCircle,
  Calendar,
  Phone,
  Mail
} from 'lucide-react'

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Mock tracking data
  const mockTrackingData = {
    trackingNumber: 'UPS123456789',
    status: 'In Transit',
    estimatedDelivery: '2024-01-15',
    carrier: 'UPS',
    origin: 'Berlin, Germany',
    destination: 'Paris, France',
    timeline: [
      {
        date: '2024-01-12 14:30',
        status: 'Package picked up',
        location: 'Berlin, Germany',
        description: 'Package has been picked up from sender'
      },
      {
        date: '2024-01-12 18:45',
        status: 'In transit to facility',
        location: 'Berlin Hub, Germany',
        description: 'Package is being transported to sorting facility'
      },
      {
        date: '2024-01-13 09:20',
        status: 'Arrived at facility',
        location: 'Frankfurt Hub, Germany',
        description: 'Package arrived at sorting facility'
      },
      {
        date: '2024-01-13 16:15',
        status: 'Departed facility',
        location: 'Frankfurt Hub, Germany',
        description: 'Package departed for destination'
      },
      {
        date: '2024-01-14 11:30',
        status: 'In transit',
        location: 'Paris Hub, France',
        description: 'Package arrived at destination facility'
      }
    ],
    packageDetails: {
      weight: '2.5 kg',
      dimensions: '30 x 20 x 15 cm',
      type: 'Express Delivery',
      value: '€150.00'
    }
  }

  const handleSearch = () => {
    if (!trackingNumber.trim()) return
    
    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setSearchResult(mockTrackingData)
      setIsSearching(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'in transit':
        return 'text-blue-600 bg-blue-100'
      case 'out for delivery':
        return 'text-orange-600 bg-orange-100'
      case 'exception':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 mr-6">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Track Package</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-600" />
            Track Your Package
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number (e.g., UPS123456789)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !trackingNumber.trim()}
              className={`px-6 py-2 rounded-md font-medium flex items-center ${
                isSearching || !trackingNumber.trim()
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Track
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResult && (
          <div className="space-y-6">
            {/* Package Status Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Tracking Number: {searchResult.trackingNumber}</h3>
                  <p className="text-gray-600">Carrier: {searchResult.carrier}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(searchResult.status)}`}>
                  {searchResult.status}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    Route
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">From:</span> {searchResult.origin}</p>
                    <p><span className="text-gray-600">To:</span> {searchResult.destination}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    Delivery
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Estimated:</span> {searchResult.estimatedDelivery}</p>
                    <p><span className="text-gray-600">Service:</span> {searchResult.packageDetails.type}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Package className="h-4 w-4 mr-2 text-purple-600" />
                  Package Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Weight:</span> {searchResult.packageDetails.weight}
                  </div>
                  <div>
                    <span className="text-gray-600">Dimensions:</span> {searchResult.packageDetails.dimensions}
                  </div>
                  <div>
                    <span className="text-gray-600">Value:</span> {searchResult.packageDetails.value}
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span> {searchResult.packageDetails.type}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Tracking Timeline
              </h3>
              <div className="space-y-4">
                {searchResult.timeline.map((event: any, index: number) => (
                  <div key={index} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                      }`}></div>
                      {index < searchResult.timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{event.status}</h4>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{event.location}</p>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Call Support</p>
                    <p className="text-sm text-gray-600">+49 30 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@eurologistics.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!searchResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/ship" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <Package className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Create Shipment</p>
                  <p className="text-sm text-gray-600">Send a new package</p>
                </div>
              </Link>
              <Link href="/schedule" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                <Calendar className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Schedule Pickup</p>
                  <p className="text-sm text-gray-600">Arrange package pickup</p>
                </div>
              </Link>
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <Truck className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Track Multiple</p>
                  <p className="text-sm text-gray-600">Track multiple packages</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 