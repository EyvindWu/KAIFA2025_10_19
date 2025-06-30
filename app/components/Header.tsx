'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  User, 
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Globe
} from 'lucide-react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false)

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
    
    // Save language preference to localStorage
    localStorage.setItem('kaifa-express-language', langCode)
    
    // Reload page to apply language change
    window.location.reload()
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ]

  // Show loading state while language is being detected
  if (!isLanguageLoaded) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-brown-600">KAIFA EXPRESS</h1>
              </div>
            </div>
            <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-brown-600">KAIFA EXPRESS</h1>
            </Link>
          </div>

          {/* 功能按钮组（PC端显示，移动端收进菜单） */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors">Shipping</button>
            <button className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors">Tracking</button>
            <button className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors">Support</button>
          </div>

          {/* 语言切换和用户菜单始终显示在Header右侧 */}
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="relative" data-dropdown="language">
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
                    {languages.map((lang) => (
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
            {/* User Menu */}
            <div className="relative" data-dropdown="user">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User className="h-4 w-4 mr-1" />
                {isUserDropdownOpen ? (
                  <ChevronUp className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </button>
              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      Sign In
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      Register
                    </button>
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
                <button className="w-full text-left px-3 py-2 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors">Shipping</button>
                <button className="w-full text-left px-3 py-2 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors">Tracking</button>
                <button className="w-full text-left px-3 py-2 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors">Support</button>
              </div>
              {/* Language Selector */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Language</h3>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded"
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
                  <button className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                    Sign In
                  </button>
                  <button className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 