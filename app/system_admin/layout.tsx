'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  X,
  Home,
  Package,
  Users,
  Truck,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  User,
  Bell,
  Search
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../utils/translations'

export default function SystemAdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAuth()

  const navigation = [
    { name: t('dashboard'), href: '/system_admin/dashboard', icon: Home },
    { name: t('systemSettings'), href: '/system_admin/system', icon: Settings },
    { name: t('userManagement'), href: '/system_admin/users', icon: Users },
    { name: t('systemLogs'), href: '/system_admin/logs', icon: BarChart3 },
    // 你可以继续添加 super_admin 专属菜单
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role !== 'super_admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-auto`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">{t('kaifaAdmin')}</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative z-10"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {/* Navigation */}
        <nav className="mt-6 px-3 pb-20">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {t('superAdmin')}
              </p>
            </div>
            <button
              onClick={logout}
              className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="lg:pl-64 flex-1 w-full">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              {/* Search */}
              <div className="ml-4 flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  )
} 