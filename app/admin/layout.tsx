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
  Receipt,
  ClipboardCheck
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../utils/translations'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
    { name: '客户管理', href: '/admin/customers', icon: Users, permission: 'customers', role: 'admin' },
    { name: '月结审核', href: '/admin/monthly-billing-requests', icon: ClipboardCheck, permission: 'monthly_billing', role: 'admin' },
    { name: '账单管理', href: '/admin/billing-management', icon: Receipt, permission: 'billing', role: 'admin' },
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
        {/* Mobile Menu Button - Only shows on mobile */}
        <div className="lg:hidden fixed top-4 left-4 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md bg-white shadow-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
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