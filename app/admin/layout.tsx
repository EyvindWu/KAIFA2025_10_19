'use client'

import React, { useState, useEffect } from 'react'
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
  Shield,
  Bell,
  Search
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../utils/translations'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAuth()

  // 检查权限
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/login')
      return
    }

    if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/dashboard')
      return
    }
  }, [isAuthenticated, user, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navigation = [
    // 系统管理功能 - 仅 Super Admin
    { name: t('systemSettings'), href: '/admin/system', icon: Settings, permission: 'system_settings', role: 'super_admin' },
    { name: t('userManagement'), href: '/admin/users', icon: Users, permission: 'user_management', role: 'super_admin' },
    { name: t('systemLogs'), href: '/admin/logs', icon: BarChart3, permission: 'system_logs', role: 'super_admin' },
    
    // 业务管理功能 - Admin 和 Super Admin
    { name: t('dashboard'), href: user?.role === 'super_admin' ? '/system_admin/dashboard' : '/admin/dashboard', icon: Home, permission: 'all', role: 'all' },
    { name: t('orders'), href: '/admin/orders', icon: Package, permission: 'orders', role: 'admin' },
    { name: t('customers'), href: '/admin/customers', icon: Users, permission: 'customers', role: 'admin' },
    { name: t('shipments'), href: '/admin/shipments', icon: Truck, permission: 'shipments', role: 'admin' },
    { name: t('billing'), href: '/admin/billing', icon: CreditCard, permission: 'billing', role: 'admin' },
    { name: t('reports'), href: '/admin/reports', icon: BarChart3, permission: 'reports', role: 'admin' },
  ]

  const hasPermission = (permission: string, requiredRole?: string) => {
    if (!user) return false
    
    // Super Admin 有系统管理权限
    if (user.role === 'super_admin' && permission.startsWith('system_')) {
      return true
    }
    
    // Admin 有业务管理权限
    if (user.role === 'admin' && requiredRole === 'admin') {
      return user.permissions.includes(permission)
    }
    
    // 通用权限检查
    return user.permissions.includes('all') || user.permissions.includes(permission)
  }

  const shouldShowMenuItem = (item: any) => {
    if (item.role === 'all') return true
    if (item.role === user?.role) return hasPermission(item.permission, item.role)
    return false
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-auto`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-blue-600 mr-2" />
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
            {navigation.map((item) => {
              if (!shouldShowMenuItem(item)) return null
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                  {item.name}
                </Link>
              )
            })}
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
                {user.role === 'super_admin' ? t('superAdmin') : t('admin')}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex-1 w-full">
        <div className="p-6">
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
                
                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="p-4 sm:p-6 lg:p-8 min-h-0">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
} 