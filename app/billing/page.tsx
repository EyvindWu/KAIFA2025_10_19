'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  CreditCard,
  Download,
  Eye,
  Plus,
  Calendar,
  Euro,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Shield,
  UserCheck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Bell,
  Settings
} from 'lucide-react'
import { useTranslation } from '../utils/translations';

export default function BillingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)

  // Mock data
  const merchantStatus = {
    isVerified: false,
    verificationStatus: 'pending', // pending, approved, rejected
    businessName: 'Sample Business Ltd.',
    registrationDate: '2024-01-10',
    monthlyBillingEligible: false
  }

  const monthlyBills = [
    {
      id: 'BILL-2024-01',
      period: 'January 2024',
      date: '2024-01-31',
      dueDate: '2024-02-15',
      amount: 1250.75,
      status: 'paid',
      shipments: 45,
      description: 'Monthly shipping services - January 2024'
    },
    {
      id: 'BILL-2024-02',
      period: 'February 2024',
      date: '2024-02-29',
      dueDate: '2024-03-15',
      amount: 1899.50,
      status: 'pending',
      shipments: 67,
      description: 'Monthly shipping services - February 2024'
    }
  ]

  const recentInvoices = [
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 125.50,
      status: 'paid',
      description: 'Express Delivery Services - January 2024'
    },
    {
      id: 'INV-2024-002',
      date: '2024-01-10',
      dueDate: '2024-02-10',
      amount: 89.99,
      status: 'pending',
      description: 'Standard Delivery Services - January 2024'
    },
    {
      id: 'INV-2024-003',
      date: '2024-01-05',
      dueDate: '2024-02-05',
      amount: 245.75,
      status: 'overdue',
      description: 'Overnight Delivery Services - January 2024'
    }
  ]

  const paymentMethods = [
    {
      id: 1,
      type: 'credit_card',
      name: 'Visa ending in 4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'paypal',
      name: 'PayPal Account',
      email: 'user@example.com',
      isDefault: false
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('backToHome')}
            </Link>
            <h1 className="ml-6 text-xl font-semibold text-gray-900">{t('billingPayments')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Merchant Verification Status */}
        {!merchantStatus.isVerified && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-yellow-400">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('businessVerificationRequired')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('businessVerificationDesc')}
                </p>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationStatusColor(merchantStatus.verificationStatus)}`}>
                    {getVerificationStatusIcon(merchantStatus.verificationStatus)}
                    <span className="ml-1 capitalize">{merchantStatus.verificationStatus}</span>
                  </span>
                  <button 
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="bg-brown-600 text-white px-4 py-2 rounded-md hover:bg-brown-700 transition-colors font-medium"
                  >
                    {t('completeVerification')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Euro className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('totalSpent')}</p>
                <p className="text-2xl font-bold text-gray-900">€3,150.24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('paidBills')}</p>
                <p className="text-2xl font-bold text-gray-900">€1,250.75</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3 mr-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('pending')}</p>
                <p className="text-2xl font-bold text-gray-900">€1,899.50</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('monthlyBills')}</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-brown-500 text-brown-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('overview')}
              </button>
              <button
                onClick={() => setActiveTab('monthly_bills')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'monthly_bills'
                    ? 'border-brown-500 text-brown-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('monthlyBills')}
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'invoices'
                    ? 'border-brown-500 text-brown-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('individualInvoices')}
              </button>
              <button
                onClick={() => setActiveTab('payment_methods')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payment_methods'
                    ? 'border-brown-500 text-brown-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('paymentMethods')}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('monthlyBillingStatus')}</h3>
                  {merchantStatus.monthlyBillingEligible ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">{t('monthlyBillingActive')}</span>
                      </div>
                      <p className="text-green-700 mt-1">{t('monthlyBillingEligibleDesc')}</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="text-yellow-800 font-medium">{t('monthlyBillingNotAvailable')}</span>
                      </div>
                      <p className="text-yellow-700 mt-1">{t('monthlyBillingNotAvailableDesc')}</p>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">{t('recentMonthlyBills')}</h4>
                    <div className="space-y-3">
                      {monthlyBills.slice(0, 3).map((bill) => (
                        <div key={bill.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-900">{bill.period}</h5>
                              <p className="text-sm text-gray-600">{bill.shipments} {t('shipments')}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatCurrency(bill.amount)}</p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                                {getStatusIcon(bill.status)}
                                <span className="ml-1 capitalize">{bill.status}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">{t('quickActions')}</h4>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <Download className="h-5 w-5 text-gray-600 mr-3" />
                          <span className="font-medium text-gray-900">{t('downloadCurrentBill')}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                          <span className="font-medium text-gray-900">{t('updatePaymentMethod')}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <Settings className="h-5 w-5 text-gray-600 mr-3" />
                          <span className="font-medium text-gray-900">{t('billingPreferences')}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'monthly_bills' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{t('monthlyBills')}</h3>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  >
                    <option value="current">{t('currentPeriod')}</option>
                    <option value="last_3_months">{t('last3Months')}</option>
                    <option value="last_6_months">{t('last6Months')}</option>
                    <option value="all">{t('allTime')}</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {monthlyBills.map((bill) => (
                    <div key={bill.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{bill.period}</h4>
                          <p className="text-gray-600">{bill.description}</p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bill.status)}`}>
                          {getStatusIcon(bill.status)}
                          <span className="ml-1 capitalize">{bill.status}</span>
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">{t('billAmount')}</p>
                          <p className="text-xl font-bold text-gray-900">{formatCurrency(bill.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t('shipments')}</p>
                          <p className="text-lg font-semibold text-gray-900">{bill.shipments}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t('issueDate')}</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(bill.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t('dueDate')}</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(bill.dueDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button className="flex items-center px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors">
                          <Eye className="h-4 w-4 mr-2" />
                          {t('viewDetails')}
                        </button>
                        <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                          <Download className="h-4 w-4 mr-2" />
                          {t('downloadPDF')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{t('individualInvoices')}</h3>
                  <button className="flex items-center px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    {t('exportAll')}
                  </button>
                </div>

                <div className="space-y-4">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{invoice.id}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                              {getStatusIcon(invoice.status)}
                              <span className="ml-1 capitalize">{invoice.status}</span>
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{invoice.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span>{t('date')}: {formatDate(invoice.date)}</span>
                            <span>{t('due')}: {formatDate(invoice.dueDate)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.amount)}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payment_methods' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{t('paymentMethods')}</h3>
                  <button className="flex items-center px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('addPaymentMethod')}
                  </button>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gray-100 rounded-lg p-3 mr-4">
                            <CreditCard className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{method.name}</h4>
                            {method.expiry && (
                              <p className="text-sm text-gray-500">{t('expires')}: {method.expiry}</p>
                            )}
                            {method.email && (
                              <p className="text-sm text-gray-500">{t('email')}: {method.email}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {method.isDefault && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brown-100 text-brown-800">
                              {t('default')}
                            </span>
                          )}
                          <button className="text-brown-600 hover:text-brown-700 text-sm font-medium">
                            {t('edit')}
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            {t('remove')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Payment Method Form */}
                <div className="mt-8 border-t pt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">{t('addNewPaymentMethod')}</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('cardNumber')}</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('cardholderName')}</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('expiryDate')}</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('cvv')}</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-brown-600 focus:ring-brown-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{t('setAsDefaultPaymentMethod')}</span>
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <button className="w-full px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors">
                        {t('addPaymentMethod')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Verification Modal */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('businessVerification')}</h3>
            <p className="text-gray-600 mb-6">
              {t('businessVerificationDescModal')}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('businessName')}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  placeholder={t('yourBusinessName')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('businessRegistrationNumber')}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  placeholder={t('vatNumberOrBusinessId')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('businessAddress')}</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  rows={3}
                  placeholder={t('fullBusinessAddress')}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button className="flex-1 px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors">
                {t('submitForReview')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 