'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, Truck, Shield, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../utils/translations'

export default function LoginPage() {
  const { t } = useTranslation();
  // 账号卡片内描述多语言
  const savedAccounts = [
    {
      id: '1',
      email: 'admin@kaifa.com',
      password: 'admin123',
      name: t('systemAdministrator'),
      role: 'Super Admin',
      description: t('systemMaintenance'),
      avatar: '👨‍💻'
    },
    {
      id: '2',
      email: 'manager@kaifa.com',
      password: 'manager123',
      name: t('customerServiceManager'),
      role: 'Admin',
      description: t('businessOperations'),
      avatar: '👩‍💼'
    },
    {
      id: '3',
      email: 'andy.liu@example.com',
      password: 'andy123',
      name: 'Andy Liu',
      role: 'Customer (Pending)',
      description: '普通用户 - 月结申请中',
      avatar: '👤'
    },
    {
      id: '4',
      email: 'tony.leung@example.com',
      password: 'tony123',
      name: 'Tony Leung',
      role: 'Customer (Approved)',
      description: '月结用户 - 已授权',
      avatar: '👨‍💼'
    }
  ];
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated, user } = useAuth()
  
  const emailInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 如果已经登录，根据角色重定向
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.email === 'admin@kaifa.com') {
        router.push('/system_admin/dashboard')
      } else if (user.email === 'manager@kaifa.com') {
        router.push('/admin/dashboard')
      } else {
        // 普通用户重定向到主页或发货页面
        router.push('/')
      }
    }
  }, [isAuthenticated, user, router])

  // 点击外部关闭下拉
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password)
      
      if (result.success && result.user) {
        // 登录成功，根据邮箱精确重定向
        if (result.user.email === 'admin@kaifa.com') {
          router.push('/system_admin/dashboard')
        } else if (result.user.email === 'manager@kaifa.com') {
          router.push('/admin/dashboard')
        } else {
          // 普通用户重定向到主页
          router.push('/')
        }
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccountSelect = (account: typeof savedAccounts[0]) => {
    setEmail(account.email)
    setPassword(account.password)
    setShowAccountDropdown(false)
    // 聚焦到密码输入框
    setTimeout(() => {
      const passwordInput = document.getElementById('password') as HTMLInputElement
      if (passwordInput) {
        passwordInput.focus()
      }
    }, 100)
  }

  const handleEmailFocus = () => {
    setIsEmailFocused(true)
    setShowAccountDropdown(true)
  }

  const handleEmailBlur = () => {
    setIsEmailFocused(false)
    // 延迟关闭下拉，让用户有时间点击选项
    setTimeout(() => {
      setShowAccountDropdown(false)
    }, 200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t('welcomeBack')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('loginToYourAccount')}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('email')}
              </label>
              <div className="mt-1 relative">
                <input
                  ref={emailInputRef}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleEmailFocus}
                  onBlur={handleEmailBlur}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={t('email')}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} />
                </div>
                
                {/* Account Dropdown */}
                {showAccountDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('savedAccounts')}
                      </div>
                      {savedAccounts.map((account) => (
                        <button
                          key={account.id}
                          type="button"
                          onClick={() => handleAccountSelect(account)}
                          className="w-full flex items-center px-3 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          <span className="text-lg mr-3">{account.avatar}</span>
                                                   <div className="flex-1 text-left">
                           <div className="font-medium">{account.name}</div>
                           <div className="text-xs text-gray-500">{account.email}</div>
                           <div className="text-xs text-gray-400">{account.description}</div>
                         </div>
                         <span className={`text-xs px-2 py-1 rounded-full ${
                           account.role === 'Super Admin' ? 'bg-red-100 text-red-600' :
                           account.role === 'Admin' ? 'bg-blue-100 text-blue-600' :
                           account.role === 'Customer (Approved)' ? 'bg-green-100 text-green-600' :
                           account.role === 'Customer (Pending)' ? 'bg-yellow-100 text-yellow-600' :
                           'bg-gray-100 text-gray-600'
                         }`}>
                           {account.role}
                         </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('password')}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={t('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                                      <>
                      <User className="h-5 w-5 mr-2" />
                      {t('login')}
                    </>
                )}
              </button>
            </div>
          </form>

          {/* Demo Accounts Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">测试账户说明</h3>
            <div className="space-y-2 text-xs text-blue-700">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <strong>System Administrator:</strong> 超级管理员，可访问系统管理面板
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <strong>Customer Service Manager:</strong> 客服管理员，可访问客服管理面板
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                <strong>Andy Liu:</strong> 普通用户，月结申请中，只能使用微信支付
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <strong>Tony Leung:</strong> 月结用户，已授权，可使用月结支付
              </div>
              <div className="text-blue-600 mt-2">
                点击邮箱输入框可选择预设账户，自动填充登录信息
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 