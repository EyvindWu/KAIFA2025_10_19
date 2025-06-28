'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  User, 
  Truck, 
  Calendar,
  Clock,
  Euro,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function ShipPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    sender: {
      name: '',
      company: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      phone: '',
      email: ''
    },
    recipient: {
      name: '',
      company: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      phone: '',
      email: ''
    },
    package: {
      weight: '',
      length: '',
      width: '',
      height: '',
      description: '',
      value: ''
    },
    service: {
      provider: '',
      type: '',
      pickupDate: '',
      pickupTime: ''
    }
  })

  const logisticsProviders = [
    { id: 'ups', name: 'UPS', logo: '🚚', rating: 4.8, deliveryTime: '1-3 days' },
    { id: 'tnt', name: 'TNT', logo: '📦', rating: 4.6, deliveryTime: '2-4 days' },
    { id: 'dhl', name: 'DHL', logo: '✈️', rating: 4.9, deliveryTime: '1-2 days' },
    { id: 'fedex', name: 'FedEx', logo: '🚛', rating: 4.7, deliveryTime: '2-3 days' },
  ]

  const serviceTypes = [
    { id: 'express', name: 'Express Delivery', price: '€25-45', time: '1-2 days' },
    { id: 'standard', name: 'Standard Delivery', price: '€15-30', time: '3-5 days' },
    { id: 'economy', name: 'Economy Delivery', price: '€10-20', time: '5-7 days' },
  ]

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          Sender Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.sender.name}
              onChange={(e) => handleInputChange('sender', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={formData.sender.company}
              onChange={(e) => handleInputChange('sender', 'company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Company Name"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              type="text"
              value={formData.sender.address}
              onChange={(e) => handleInputChange('sender', 'address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              value={formData.sender.city}
              onChange={(e) => handleInputChange('sender', 'city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
            <input
              type="text"
              value={formData.sender.postalCode}
              onChange={(e) => handleInputChange('sender', 'postalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <select
              value={formData.sender.country}
              onChange={(e) => handleInputChange('sender', 'country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Country</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
              <option value="NL">Netherlands</option>
              <option value="BE">Belgium</option>
              <option value="AT">Austria</option>
              <option value="CH">Switzerland</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              value={formData.sender.phone}
              onChange={(e) => handleInputChange('sender', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+49 123 456 789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.sender.email}
              onChange={(e) => handleInputChange('sender', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-green-600" />
          Recipient Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.recipient.name}
              onChange={(e) => handleInputChange('recipient', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={formData.recipient.company}
              onChange={(e) => handleInputChange('recipient', 'company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Company Name"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              type="text"
              value={formData.recipient.address}
              onChange={(e) => handleInputChange('recipient', 'address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              value={formData.recipient.city}
              onChange={(e) => handleInputChange('recipient', 'city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
            <input
              type="text"
              value={formData.recipient.postalCode}
              onChange={(e) => handleInputChange('recipient', 'postalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <select
              value={formData.recipient.country}
              onChange={(e) => handleInputChange('recipient', 'country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Country</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
              <option value="NL">Netherlands</option>
              <option value="BE">Belgium</option>
              <option value="AT">Austria</option>
              <option value="CH">Switzerland</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              value={formData.recipient.phone}
              onChange={(e) => handleInputChange('recipient', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+49 123 456 789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.recipient.email}
              onChange={(e) => handleInputChange('recipient', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jane@example.com"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2 text-purple-600" />
          Package Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
            <input
              type="number"
              step="0.1"
              value={formData.package.weight}
              onChange={(e) => handleInputChange('package', 'weight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value (€) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.package.value}
              onChange={(e) => handleInputChange('package', 'value', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
            <input
              type="number"
              value={formData.package.length}
              onChange={(e) => handleInputChange('package', 'length', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
            <input
              type="number"
              value={formData.package.width}
              onChange={(e) => handleInputChange('package', 'width', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <input
              type="number"
              value={formData.package.height}
              onChange={(e) => handleInputChange('package', 'height', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="15"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.package.description}
              onChange={(e) => handleInputChange('package', 'description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Brief description of the package contents"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Truck className="h-5 w-5 mr-2 text-orange-600" />
          Select Logistics Provider
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {logisticsProviders.map((provider) => (
            <div
              key={provider.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                formData.service.provider === provider.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('service', 'provider', provider.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{provider.logo}</span>
                  <span className="font-semibold text-gray-900">{provider.name}</span>
                </div>
                <div className="text-sm text-gray-600">⭐ {provider.rating}</div>
              </div>
              <div className="text-sm text-gray-600">
                Delivery: {provider.deliveryTime}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-green-600" />
          Service Options
        </h3>
        <div className="space-y-4">
          {serviceTypes.map((service) => (
            <div
              key={service.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                formData.service.type === service.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('service', 'type', service.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">Delivery time: {service.time}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{service.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-purple-600" />
          Pickup Schedule
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date *</label>
            <input
              type="date"
              value={formData.service.pickupDate}
              onChange={(e) => handleInputChange('service', 'pickupDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time *</label>
            <select
              value={formData.service.pickupTime}
              onChange={(e) => handleInputChange('service', 'pickupTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Time</option>
              <option value="09:00-12:00">09:00 - 12:00</option>
              <option value="12:00-15:00">12:00 - 15:00</option>
              <option value="15:00-18:00">15:00 - 18:00</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          Review & Confirm
        </h3>
        
        <div className="space-y-6">
          {/* Sender Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">From:</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">{formData.sender.name}</p>
              {formData.sender.company && <p className="text-gray-600">{formData.sender.company}</p>}
              <p className="text-gray-600">{formData.sender.address}</p>
              <p className="text-gray-600">{formData.sender.city}, {formData.sender.postalCode}</p>
              <p className="text-gray-600">{formData.sender.country}</p>
              <p className="text-gray-600">{formData.sender.phone}</p>
            </div>
          </div>

          {/* Recipient Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">To:</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">{formData.recipient.name}</p>
              {formData.recipient.company && <p className="text-gray-600">{formData.recipient.company}</p>}
              <p className="text-gray-600">{formData.recipient.address}</p>
              <p className="text-gray-600">{formData.recipient.city}, {formData.recipient.postalCode}</p>
              <p className="text-gray-600">{formData.recipient.country}</p>
              <p className="text-gray-600">{formData.recipient.phone}</p>
            </div>
          </div>

          {/* Package Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Package Details:</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Weight:</span> {formData.package.weight} kg
                </div>
                <div>
                  <span className="text-gray-600">Value:</span> €{formData.package.value}
                </div>
                {formData.package.length && (
                  <div>
                    <span className="text-gray-600">Dimensions:</span> {formData.package.length}×{formData.package.width}×{formData.package.height} cm
                  </div>
                )}
              </div>
              {formData.package.description && (
                <p className="text-gray-600 mt-2">{formData.package.description}</p>
              )}
            </div>
          </div>

          {/* Service Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Service Details:</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Provider:</span> {logisticsProviders.find(p => p.id === formData.service.provider)?.name}
                </div>
                <div>
                  <span className="text-gray-600">Service Type:</span> {serviceTypes.find(s => s.id === formData.service.type)?.name}
                </div>
                <div>
                  <span className="text-gray-600">Pickup Date:</span> {formData.service.pickupDate}
                </div>
                <div>
                  <span className="text-gray-600">Pickup Time:</span> {formData.service.pickupTime}
                </div>
              </div>
            </div>
          </div>

          {/* Estimated Cost */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Estimated Cost:</span>
              <span className="text-2xl font-bold text-blue-600">€35.00</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Final cost will be calculated based on actual weight and dimensions</p>
          </div>
        </div>
      </div>
    </div>
  )

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
            <h1 className="text-xl font-semibold text-gray-900">Create Shipment</h1>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
            <div className="ml-4 text-sm text-gray-600">
              Step {step} of 4
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`px-6 py-2 rounded-md font-medium ${
              step === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>
          
          {step < 4 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => alert('Shipment created successfully!')}
              className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
            >
              Create Shipment
            </button>
          )}
        </div>
      </main>
    </div>
  )
} 