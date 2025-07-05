'use client'

import React from 'react'
import { useTranslation } from '../utils/translations'

export default function TestLanguagePage() {
  const { t, currentLanguage, setCurrentLanguage, languages } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Language Test Page</h1>
        
        {/* Language Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Language: {currentLanguage.toUpperCase()}</h2>
          <div className="flex gap-2">
            {languages.map((lang: { code: string; name: string; flag: string }) => (
              <button
                key={lang.code}
                onClick={() => setCurrentLanguage(lang.code)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  currentLanguage === lang.code
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Translation Examples */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Header & Navigation</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Shipping:</strong> {t('shipping')}</div>
              <div><strong>Tracking:</strong> {t('tracking')}</div>
              <div><strong>Support:</strong> {t('support')}</div>
              <div><strong>Sign In:</strong> {t('signIn')}</div>
              <div><strong>Register:</strong> {t('register')}</div>
              <div><strong>Language:</strong> {t('language')}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Homepage Content</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Professional Logistics:</strong> {t('professionalLogistics')}</div>
              <div><strong>Ship Packages:</strong> {t('shipPackages')}</div>
              <div><strong>Track Deliveries:</strong> {t('trackDeliveries')}</div>
              <div><strong>Billing & Payments:</strong> {t('billingPayments')}</div>
              <div><strong>Quick Actions:</strong> {t('quickActions')}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Tracking</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Track Your Package:</strong> {t('trackYourPackage')}</div>
              <div><strong>Enter Tracking Number:</strong> {t('enterTrackingNumber')}</div>
              <div><strong>Order Detail:</strong> {t('orderDetail')}</div>
              <div><strong>Package Information:</strong> {t('packageInformation')}</div>
              <div><strong>Share:</strong> {t('share')}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Login</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Email:</strong> {t('email')}</div>
              <div><strong>Password:</strong> {t('password')}</div>
              <div><strong>Login:</strong> {t('login')}</div>
              <div><strong>Welcome Back:</strong> {t('welcomeBack')}</div>
              <div><strong>Saved Accounts:</strong> {t('savedAccounts')}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Admin</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Admin Panel:</strong> {t('adminPanel')}</div>
              <div><strong>Dashboard:</strong> {t('dashboard')}</div>
              <div><strong>System Settings:</strong> {t('systemSettings')}</div>
              <div><strong>User Management:</strong> {t('userManagement')}</div>
              <div><strong>Orders:</strong> {t('orders')}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Common</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Save:</strong> {t('save')}</div>
              <div><strong>Cancel:</strong> {t('cancel')}</div>
              <div><strong>Edit:</strong> {t('edit')}</div>
              <div><strong>Delete:</strong> {t('delete')}</div>
              <div><strong>Loading:</strong> {t('loading')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 