'use client'

import React, { useState, useEffect, useContext, useRef } from 'react'
import Link from 'next/link'
import { 
  User, 
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Globe,
  LogOut,
  Settings,
  Truck
} from 'lucide-react'
import { LanguageContext } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../utils/translations'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [trackingMenuOpen, setTrackingMenuOpen] = useState(false)
  const [supportMenuOpen, setSupportMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const trackingMenuTimeout = useRef<NodeJS.Timeout | null>(null)
  const supportMenuTimeout = useRef<NodeJS.Timeout | null>(null)
  const { currentLanguage, setCurrentLanguage, languages, isLanguageLoaded } = useContext(LanguageContext)
  const { user, isAuthenticated, logout } = useAuth()
  const { t } = useTranslation()

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
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      
      // Close language dropdown
      if (isLanguageDropdownOpen && !target.closest('[data-dropdown="language"]')) {
        setIsLanguageDropdownOpen(false)
      }
      
      // Close user dropdown
      if (isUserDropdownOpen && !target.closest('[data-dropdown="user"]')) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLanguageDropdownOpen, isUserDropdownOpen])

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode)
    setIsLanguageDropdownOpen(false)
  }

  // Show loading state while language is being detected
  if (!isLanguageLoaded) {
    return (
      <header className="w-full shadow-sm bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-700 tracking-wide select-none">KAIFA EXPRESS</span>
          </div>
          <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
        </div>
      </header>
    )
  }

  // 样例历史订单
  const orderList = [
    {
      id: '1Z999AA10123456784',
      status: 'In Transit',
      summary: 'Alice → Bob, 2.5kg, Express',
      href: '/track/detail'
    },
    {
      id: '1Z999AA10123456785',
      status: 'Delivered',
      summary: 'Carol → Dave, 1.2kg, Standard',
      href: '/track/detail' // 可根据id跳转不同页面
    }
  ];

  return (
    <header className="w-full shadow-sm bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 bg-white">
        <div className="flex items-center gap-2">
          <Link href="/" className="focus:outline-none">
            <span className="text-2xl font-bold text-blue-700 select-none flex items-center gap-2">
              <Truck className="inline-block h-7 w-7 mr-1 text-blue-700" />
              KAIFA EXPRESS
            </span>
          </Link>
        </div>

        {/* 功能按钮组（PC端显示，移动端收进菜单） */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/ship" className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors">{t('shipping')}</Link>
          <div
            className="relative"
            onMouseEnter={() => {
              if (!isMobile) {
                if (trackingMenuTimeout.current) clearTimeout(trackingMenuTimeout.current)
                setTrackingMenuOpen(true)
              }
            }}
            onMouseLeave={() => {
              if (!isMobile) {
                if (trackingMenuTimeout.current) clearTimeout(trackingMenuTimeout.current)
                trackingMenuTimeout.current = setTimeout(() => setTrackingMenuOpen(false), 200)
              }
            }}
          >
            <button
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold focus:outline-none"
              onClick={() => isMobile && setTrackingMenuOpen(v => !v)}
            >
              {t('tracking')}
            </button>
            {trackingMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-50"
                onMouseEnter={() => {
                  if (!isMobile) {
                    if (trackingMenuTimeout.current) clearTimeout(trackingMenuTimeout.current)
                    setTrackingMenuOpen(true)
                  }
                }}
                onMouseLeave={() => {
                  if (!isMobile) {
                    if (trackingMenuTimeout.current) clearTimeout(trackingMenuTimeout.current)
                    trackingMenuTimeout.current = setTimeout(() => setTrackingMenuOpen(false), 200)
                  }
                }}
              >
                <Link
                  href="/track"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => setTrackingMenuOpen(false)}
                >
                  {t('track')}
                </Link>
                <Link
                  href="/track/history"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => setTrackingMenuOpen(false)}
                >
                  {t('orderHistory')}
                </Link>
              </div>
            )}
          </div>
          <div
            className="relative"
            onMouseEnter={() => {
              if (!isMobile) {
                if (supportMenuTimeout.current) clearTimeout(supportMenuTimeout.current)
                setSupportMenuOpen(true)
              }
            }}
            onMouseLeave={() => {
              if (!isMobile) {
                if (supportMenuTimeout.current) clearTimeout(supportMenuTimeout.current)
                supportMenuTimeout.current = setTimeout(() => setSupportMenuOpen(false), 200)
              }
            }}
          >
            <button
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold focus:outline-none"
              onClick={() => isMobile && setSupportMenuOpen(v => !v)}
            >
              {t('support')}
            </button>
            {supportMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-50"
                onMouseEnter={() => {
                  if (!isMobile) {
                    if (supportMenuTimeout.current) clearTimeout(supportMenuTimeout.current)
                    setSupportMenuOpen(true)
                  }
                }}
                onMouseLeave={() => {
                  if (!isMobile) {
                    if (supportMenuTimeout.current) clearTimeout(supportMenuTimeout.current)
                    supportMenuTimeout.current = setTimeout(() => setSupportMenuOpen(false), 200)
                  }
                }}
              >
                <Link href="/support/contact" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700" onClick={() => setSupportMenuOpen(false)}>
                  Contact Customer Service
                </Link>
                <Link href="/support/guide" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700" onClick={() => setSupportMenuOpen(false)}>
                  Guide
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Header右侧菜单 */}
        <div className="flex items-center space-x-2">
          {/* 桌面端语言选择 - 仅未登录用户显示 */}
          {!isAuthenticated && (
            <div className="relative hidden md:block" data-dropdown="language">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Globe className="h-4 w-4 mr-1" />
                <span className="text-sm">{currentLanguage.toUpperCase()}</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    {languages.map((lang: { code: string; name: string; flag: string }) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* User Menu */}
          <div className="relative" data-dropdown="user">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isAuthenticated ? (
                <>
                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </>
              ) : (
                <User className="h-4 w-4 mr-1" />
              )}
              {isUserDropdownOpen ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </button>
            {isUserDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      {user?.role === 'admin' || user?.role === 'super_admin' ? (
                        <Link
                          href="/admin/dashboard"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          {t('adminPanel')}
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          {t('dashboard')}
                        </Link>
                      )}
                      <Link
                        href="/settings"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4 inline mr-2" />
                        {t('settings')}
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsUserDropdownOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        {t('signOut')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        {t('signIn')}
                      </Link>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        {t('register')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="px-4 py-6 space-y-4">
            {/* 功能按钮组 */}
            <div className="flex flex-col gap-2 pb-4 border-b border-gray-200">
              <Link href="/ship" className="w-full text-left px-3 py-2 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t('shipping')}</Link>
              <Link href="/track" className="w-full text-left px-3 py-2 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t('tracking')}</Link>
              <Link href="/support/contact" className="w-full text-left px-3 py-2 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t('support')}</Link>
            </div>

            {/* Language Selector - 移动端显示 */}
            <div className="pb-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">{t('language')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang: { code: string; name: string; flag: string }) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center px-3 py-2 text-sm rounded transition-colors ${
                      currentLanguage === lang.code 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User Actions */}
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' || user?.role === 'super_admin' ? (
                      <Link
                        href="/admin/dashboard"
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        {t('adminPanel')}
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard"
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        {t('dashboard')}
                      </Link>
                    )}
                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      {t('signOut')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {t('signIn')}
                    </Link>
                    <button className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                      {t('register')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 