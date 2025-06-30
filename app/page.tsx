'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Truck, 
  Search, 
  Package, 
  User, 
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Printer,
  Share2,
  FileText,
  CreditCard
} from 'lucide-react'

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<'track' | 'ship' | 'billing' | 'printShare'>('track')

  // Get browser language and set initial language
  useEffect(() => {
    const getBrowserLanguage = () => {
      // First check if user has previously selected a language
      const savedLanguage = localStorage.getItem('kaifa-express-language')
      if (savedLanguage) {
        const supportedLanguages = ['en', 'zh', 'de', 'fr', 'es', 'it']
        if (supportedLanguages.includes(savedLanguage)) {
          return savedLanguage
        }
      }

      // Get browser language
      const browserLang = navigator.language || navigator.languages?.[0] || 'en'
      const langCode = browserLang.split('-')[0].toLowerCase() // Extract language code (e.g., 'zh' from 'zh-CN')
      
      // Check if the language is supported
      const supportedLanguages = ['en', 'zh', 'de', 'fr', 'es', 'it']
      if (supportedLanguages.includes(langCode)) {
        return langCode
      }
      
      // If not supported, return default language
      return 'en'
    }

    // Set initial language based on browser settings
    const initialLang = getBrowserLanguage()
    setCurrentLanguage(initialLang)
    setIsLanguageLoaded(true)
  }, [])

  // Translations
  const translations = {
    en: {
      track: 'Track',
      ship: 'Ship',
      billing: 'Billing',
      printShare: 'Print/Share',
      trackYourPackage: 'Track Your Package',
      enterTrackingNumber: 'Enter tracking number',
      trackButton: 'Track',
      recentOrders: 'Recent Orders',
      signIn: 'Sign In',
      register: 'Register',
      professionalLogistics: 'Professional Logistics for European Merchants',
      connectWithLeading: 'Connect with leading logistics providers across Europe. Ship, track, and manage your deliveries with ease.',
      shipPackages: 'Ship Packages',
      createShipments: 'Create shipments with our partner logistics companies.',
      startShipping: 'Start Shipping',
      trackDeliveries: 'Track Deliveries',
      realTimeTracking: 'Real-time tracking for all your shipments.',
      trackNow: 'Track Now',
      billingPayments: 'Billing & Payments',
      manageInvoices: 'Manage your invoices and payment methods.',
      viewBilling: 'View Billing',
      monthlyBilling: 'Monthly Billing for Verified Merchants',
      monthlyBillingDesc: 'After verification of your business information, enjoy the convenience of monthly billing. All your shipping costs are consolidated into a single monthly invoice for easy management.',
      learnMore: 'Learn More',
      applyForMonthlyBilling: 'Apply for Monthly Billing',
      whyChoose: 'Why Choose KAIFA EXPRESS?',
      fastDelivery: 'Fast Delivery',
      quickReliable: 'Quick and reliable delivery across Europe',
      realTimeTrackingTitle: 'Real-time Tracking',
      trackPackages: 'Track your packages in real-time',
      support247: '24/7 Support',
      roundTheClock: 'Round-the-clock customer support',
      quickActions: 'Quick Actions',
      trackPackage: 'Track Package',
      createShipment: 'Create Shipment',
      viewBillingInfo: 'View Billing',
      printDocuments: 'Print Documents'
    },
    zh: {
      track: '跟踪',
      ship: '发货',
      billing: '账单',
      printShare: '打印/分享',
      trackYourPackage: '跟踪您的包裹',
      enterTrackingNumber: '输入跟踪号',
      trackButton: '跟踪',
      recentOrders: '最近订单',
      signIn: '登录',
      register: '注册',
      professionalLogistics: '欧洲商户专业物流服务',
      connectWithLeading: '连接欧洲领先的物流提供商。轻松发货、跟踪和管理您的配送。',
      shipPackages: '发货包裹',
      createShipments: '与我们的物流合作伙伴创建运单。',
      startShipping: '开始发货',
      trackDeliveries: '跟踪配送',
      realTimeTracking: '所有包裹的实时跟踪。',
      trackNow: '立即跟踪',
      billingPayments: '账单与支付',
      manageInvoices: '管理您的发票和支付方式。',
      viewBilling: '查看账单',
      monthlyBilling: '已验证商户的月账单',
      monthlyBillingDesc: '验证您的业务信息后，享受月账单的便利。所有运输费用都整合到一张月发票中，便于管理。',
      learnMore: '了解更多',
      applyForMonthlyBilling: '申请月账单',
      whyChoose: '为什么选择KAIFA EXPRESS？',
      fastDelivery: '快速配送',
      quickReliable: '在欧洲范围内快速可靠的配送',
      realTimeTrackingTitle: '实时跟踪',
      trackPackages: '实时跟踪您的包裹',
      support247: '24/7支持',
      roundTheClock: '全天候客户支持',
      quickActions: '快速操作',
      trackPackage: '跟踪包裹',
      createShipment: '创建运单',
      viewBillingInfo: '查看账单',
      printDocuments: '打印文档'
    }
  }

  const t = translations[currentLanguage as keyof typeof translations] || translations.en

  // Mock order data for Print/Share dropdown
  const mockOrders = [
    {
      id: 'ORD-2024-001',
      createdAt: '2024-01-15',
      recipient: 'John Smith',
      city: 'Berlin',
      status: 'In Transit'
    },
    {
      id: 'ORD-2024-002', 
      createdAt: '2024-01-14',
      recipient: 'Maria Garcia',
      city: 'Madrid',
      status: 'Delivered'
    },
    {
      id: 'ORD-2024-003',
      createdAt: '2024-01-13', 
      recipient: 'Pierre Dubois',
      city: 'Paris',
      status: 'Out for Delivery'
    }
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ]

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode)
    
    // Save language preference to localStorage
    localStorage.setItem('kaifa-express-language', langCode)
  }

  const handlePrint = (orderId: string) => {
    // Simulate PDF download
    console.log(`Downloading PDF for order: ${orderId}`)
    // In real implementation, this would call the courier API to generate PDF
  }

  const handleShare = (orderId: string) => {
    // Simulate sharing functionality
    console.log(`Sharing order: ${orderId}`)
    // In real implementation, this would open native share dialog
  }

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      console.log(`Tracking package: ${trackingNumber}`)
      // In real implementation, this would redirect to tracking page with the number
    }
  }

  // Show loading state while language is being detected
  if (!isLanguageLoaded) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Quick Actions Section - Tabs */}
      <section className="mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-green-900 via-blue-900 to-green-800 shadow-lg">
        <div className="max-w-6xl mx-auto py-10 px-2 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow-lg">{t.quickActions}</h2>

          {/* Tabs Header & Content - 响应式 */}
          {/* PC端 横向Tabs+内容 */}
          <div className="hidden md:block">
            <div className="flex flex-row justify-between items-center mb-6 w-full max-w-2xl mx-auto">
              {/* 左侧三按钮居中 */}
              <div className="flex flex-row justify-center gap-2 flex-1">
                {/* Ship Tab (1) */}
                <button
                  className={`flex-1 min-w-[120px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-center flex items-center justify-center gap-1
                    ${'border-transparent text-gray-700 bg-white hover:bg-green-50 hover:text-green-700'}
                  `}
                  onClick={() => window.location.href = '/ship'}
                  style={{ width: '100%' }}
                >
                  {t.ship}
                  <ChevronRight className="h-4 w-4 ml-1 text-green-600" />
                </button>
                {/* Track Tab (2) */}
                <button
                  className={`flex-1 min-w-[120px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-center flex items-center justify-center gap-1
                    ${activeTab === 'track' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-700'}
                  `}
                  onClick={() => setActiveTab('track')}
                  style={{ width: '100%' }}
                >
                  {t.track}
                  {activeTab === 'track' ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
                {/* Print/Share Tab (3) */}
                <button
                  className={`flex-1 min-w-[120px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-center flex items-center justify-center gap-1
                    ${activeTab === 'printShare' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-700'}
                  `}
                  onClick={() => setActiveTab('printShare')}
                  style={{ width: '100%' }}
                >
                  {t.printShare}
                  {activeTab === 'printShare' ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>
              {/* Billing按钮单独靠右，预留气泡/徽章挂载点 */}
              <div className="relative ml-4 flex-shrink-0">
                <button
                  className={`min-w-[120px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-center flex items-center justify-center gap-1 border-transparent text-gray-700 bg-white hover:bg-green-50 hover:text-green-700`}
                  onClick={() => window.location.href = '/billing'}
                  style={{ width: '100%' }}
                >
                  {t.billing}
                  <ChevronRight className="h-4 w-4 ml-1 text-green-600" />
                </button>
                {/* 预留气泡/徽章挂载点 */}
                {/* <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5 shadow">1</div> */}
              </div>
            </div>
            {/* Tabs Content */}
            <div className="bg-white rounded-b-lg shadow-md p-6 min-h-[180px]">
              {activeTab === 'track' && (
                <div className="max-w-md mx-auto text-center">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder={t.enterTrackingNumber}
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleTrack}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t.trackButton}
                  </button>
                </div>
              )}
              {activeTab === 'printShare' && (
                <div className="max-w-lg mx-auto">
                  <div className="mb-2 text-center font-semibold text-gray-700">{t.recentOrders}</div>
                  <div className="space-y-2">
                    {mockOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-2 flex items-center justify-between">
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm text-gray-900">{order.id}</div>
                          <div className="text-xs text-gray-500">{order.createdAt} · {order.recipient} · {order.city}</div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handlePrint(order.id)}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                            title="Print PDF"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleShare(order.id)}
                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                            title="Share Order"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 移动端：每个Tab按钮下方紧跟内容，纵向排列 */}
          <div className="md:hidden flex flex-col gap-2">
            {/* Ship Tab (1) */}
            <div className="w-full">
              <button
                className={`w-full min-w-[140px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-left flex items-center gap-1
                  ${'border-transparent text-gray-700 bg-white hover:bg-green-50 hover:text-green-700'}
                `}
                onClick={() => window.location.href = '/ship'}
              >
                {t.ship}
                <ChevronRight className="h-4 w-4 ml-1 text-green-600" />
              </button>
            </div>
            {/* Track Tab (2) */}
            <div className="w-full">
              <button
                className={`w-full min-w-[140px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-left flex items-center gap-1
                  ${activeTab === 'track' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-700'}
                `}
                onClick={() => setActiveTab('track')}
              >
                {t.track}
                {activeTab === 'track' ? (
                  <ChevronUp className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </button>
              {activeTab === 'track' && (
                <div className="bg-white rounded-b-lg shadow-md p-4 max-w-md mx-auto text-center">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder={t.enterTrackingNumber}
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleTrack}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t.trackButton}
                  </button>
                </div>
              )}
            </div>
            {/* Print/Share Tab (3) */}
            <div className="w-full">
              <button
                className={`w-full min-w-[140px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-left flex items-center gap-1
                  ${activeTab === 'printShare' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-700'}
                `}
                onClick={() => setActiveTab('printShare')}
              >
                {t.printShare}
                {activeTab === 'printShare' ? (
                  <ChevronUp className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </button>
              {activeTab === 'printShare' && (
                <div className="bg-white rounded-b-lg shadow-md p-4 max-w-lg mx-auto">
                  <div className="mb-2 text-center font-semibold text-gray-700">{t.recentOrders}</div>
                  <div className="space-y-2">
                    {mockOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-2 flex items-center justify-between">
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm text-gray-900">{order.id}</div>
                          <div className="text-xs text-gray-500">{order.createdAt} · {order.recipient} · {order.city}</div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handlePrint(order.id)}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                            title="Print PDF"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleShare(order.id)}
                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                            title="Share Order"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Billing Tab (4) */}
            <div className="w-full">
              <button
                className={`w-full min-w-[140px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-left flex items-center gap-1
                  ${'border-transparent text-gray-700 bg-white hover:bg-green-50 hover:text-green-700'}
                `}
                onClick={() => window.location.href = '/billing'}
              >
                {t.billing}
                <ChevronRight className="h-4 w-4 ml-1 text-green-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section（下移） */}
      <section className="bg-gradient-to-br from-brown-50 to-brown-100 py-16 px-4 rounded-2xl mb-12 mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-brown-900 mb-6">
            {t.professionalLogistics}
          </h1>
          <p className="text-xl text-brown-700 mb-8 max-w-3xl mx-auto">
            {t.connectWithLeading}
          </p>
        </div>
      </section>

      {/* Monthly Billing Section */}
      <section className="py-16 px-4 bg-gray-50 rounded-2xl mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.monthlyBilling}</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t.monthlyBillingDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-brown-600 text-white px-6 py-3 rounded-lg hover:bg-brown-700 transition-colors font-semibold">
              {t.learnMore}
            </button>
            <button className="bg-white text-brown-600 px-6 py-3 rounded-lg border-2 border-brown-600 hover:bg-brown-50 transition-colors font-semibold">
              {t.applyForMonthlyBilling}
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 px-4 bg-white rounded-2xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.whyChoose}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t.fastDelivery}</h3>
              <p className="text-gray-600">{t.quickReliable}</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-green-600" />
          </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t.realTimeTrackingTitle}</h3>
              <p className="text-gray-600">{t.trackPackages}</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-purple-600" />
          </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t.support247}</h3>
              <p className="text-gray-600">{t.roundTheClock}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 