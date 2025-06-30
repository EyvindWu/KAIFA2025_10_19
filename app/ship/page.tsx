'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Package,
  User,
  MapPin,
  Truck,
  CreditCard,
  Calendar,
  Clock,
  Shield,
  CheckCircle
} from 'lucide-react'

export default function ShipPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Sender info
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    senderCity: '',
    senderPostalCode: '',
    senderCountry: '',
    
    // Recipient info
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientCity: '',
    recipientPostalCode: '',
    recipientCountry: '',
    
    // Package info
    packageType: 'package',
    weight: '',
    length: '',
    width: '',
    height: '',
    description: '',
    
    // Service options
    serviceType: 'standard',
    insurance: false,
    pickupDate: '',
    pickupTime: '',
    
    // Payment
    paymentMethod: 'credit_card'
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Submit order
      console.log('Submitting order:', formData)
      alert('Order submitted successfully!')
    }
  }

  const serviceTypes = [
    { id: 'standard', name: 'Standard Delivery', price: '€15.99', time: '3-5 business days' },
    { id: 'express', name: 'Express Delivery', price: '€29.99', time: '1-2 business days' },
    { id: 'overnight', name: 'Overnight Delivery', price: '€49.99', time: 'Next business day' }
  ]

  const countries = [
    'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Switzerland'
  ]

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Sender Information</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={formData.senderName}
            onChange={(e) => handleInputChange('senderName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={formData.senderEmail}
            onChange={(e) => handleInputChange('senderEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="tel"
            value={formData.senderPhone}
            onChange={(e) => handleInputChange('senderPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <select
            value={formData.senderCountry}
            onChange={(e) => handleInputChange('senderCountry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input
            type="text"
            value={formData.senderAddress}
            onChange={(e) => handleInputChange('senderAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            value={formData.senderCity}
            onChange={(e) => handleInputChange('senderCity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
          <input
            type="text"
            value={formData.senderPostalCode}
            onChange={(e) => handleInputChange('senderPostalCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recipient Information</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleInputChange('recipientName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={formData.recipientEmail}
            onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="tel"
            value={formData.recipientPhone}
            onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <select
            value={formData.recipientCountry}
            onChange={(e) => handleInputChange('recipientCountry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input
            type="text"
            value={formData.recipientAddress}
            onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            value={formData.recipientCity}
            onChange={(e) => handleInputChange('recipientCity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
          <input
            type="text"
            value={formData.recipientPostalCode}
            onChange={(e) => handleInputChange('recipientPostalCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Package & Service Details</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Package Type *</label>
          <select
            value={formData.packageType}
            onChange={(e) => handleInputChange('packageType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="package">Package</option>
            <option value="document">Document</option>
            <option value="fragile">Fragile</option>
            <option value="electronics">Electronics</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
          <input
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
          <input
            type="number"
            value={formData.length}
            onChange={(e) => handleInputChange('length', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
          <input
            type="number"
            value={formData.width}
            onChange={(e) => handleInputChange('width', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the contents of your package..."
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Service Options</h3>
        
        <div className="space-y-4">
          {serviceTypes.map((service) => (
            <label key={service.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <input
                type="radio"
                name="serviceType"
                value={service.id}
                checked={formData.serviceType === service.id}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{service.name}</span>
                  <span className="text-lg font-bold text-blue-600">{service.price}</span>
                </div>
                <p className="text-sm text-gray-500">{service.time}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.insurance}
              onChange={(e) => handleInputChange('insurance', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Add insurance coverage (+€5.99)</span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Payment</h2>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Order Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Service Type:</span>
            <span className="font-medium">
              {serviceTypes.find(s => s.id === formData.serviceType)?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Base Price:</span>
            <span className="font-medium">
              {serviceTypes.find(s => s.id === formData.serviceType)?.price}
            </span>
          </div>
          {formData.insurance && (
            <div className="flex justify-between">
              <span className="text-gray-600">Insurance:</span>
              <span className="font-medium">€5.99</span>
            </div>
          )}
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-blue-600">
                {formData.insurance ? '€35.98' : '€29.99'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
        <select
          value={formData.paymentMethod}
          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="credit_card">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
          <div>
            <h4 className="font-medium text-blue-900">Secure Payment</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your payment information is encrypted and secure. We use industry-standard SSL encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const steps = [
    { number: 1, title: 'Sender Info', icon: User },
    { number: 2, title: 'Recipient Info', icon: MapPin },
    { number: 3, title: 'Package & Service', icon: Package },
    { number: 4, title: 'Review & Pay', icon: CreditCard }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="ml-6 text-xl font-semibold text-gray-900">Create Shipment</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepItem.number 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {step > stepItem.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <stepItem.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    step > stepItem.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((stepItem) => (
              <span key={stepItem.number} className={`text-xs ${
                step >= stepItem.number ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {stepItem.title}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {step === 4 ? 'Place Order' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
} 