'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { 
  Package, 
  Truck, 
  Euro, 
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Plus,
  ArrowLeft,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '../utils/translations';

export default function UserDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation();

  // 检查权限
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/login')
      return
    }

    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      router.push('/admin/dashboard')
      return
    }
  }, [isAuthenticated, user, isLoading, router])

  // 统计卡片多语言
  const userStats = [
    { name: t('totalOrders'), value: '23', icon: Package, color: 'blue' },
    { name: t('inTransit'), value: '5', icon: Truck, color: 'yellow' },
    { name: t('delivered'), value: '18', icon: CheckCircle, color: 'green' },
    { name: t('totalSpent'), value: '€1,234', icon: Euro, color: 'purple' }
  ]

  // 快捷操作区块功能配置
  const quickActions = [
    {
      key: 'ship',
      href: '/ship',
      icon: Plus,
      title: t('createShipment'),
      desc: t('sendNewPackage'),
      enabled: true
    },
    {
      key: 'track',
      href: '/track',
      icon: Truck,
      title: t('trackPackage'),
      desc: t('checkDeliveryStatus'),
      enabled: true
    },
    {
      key: 'billing',
      href: '/billing',
      icon: Euro,
      title: t('viewBilling'),
      desc: t('managePayments'),
      enabled: false // 未开发，禁用
    }
  ];

  const recentOrders = [
    {
      id: '1Z999AA10123456795',
      status: 'Pending Pickup',
      summary: 'Andy Liu → Xavier, 1.8kg, Standard',
      date: '2024-01-15',
      amount: 45.50
    },
    {
      id: '1Z999AA10123456794',
      status: 'In Transit',
      summary: 'Andy Liu → Victor, 2.1kg, Express',
      date: '2024-01-14',
      amount: 67.80
    },
    {
      id: '1Z999AA10123456793',
      status: 'Delivered',
      summary: 'Andy Liu → Tina, 3.5kg, Standard',
      date: '2024-01-13',
      amount: 32.20
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100'
      case 'In Transit':
        return 'text-blue-600 bg-blue-100'
      case 'Pending Pickup':
        return 'text-yellow-600 bg-yellow-100'
      case 'Exception':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  // 服务类型英文→key映射表
  const serviceTypeKeyMap: { [key: string]: string } = {
    "Standard": "standardDelivery",
    "Express": "expressDelivery",
  };

  // 新增提醒功能
  const handleRemind = (order: { id: string; summary: string }) => {
    const reminders = JSON.parse(localStorage.getItem('kaifa-reminders') || '[]');
    reminders.push({
      id: order.id,
      summary: order.summary,
      time: new Date().toISOString(),
    });
    localStorage.setItem('kaifa-reminders', JSON.stringify(reminders));
    alert(t('remindSent'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user || (user.role === 'admin' || user.role === 'super_admin')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center">
            <Link href="/" className="flex items-center text-blue-600 hover:underline mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              {t('backToHome')}
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t('welcomeBack')}, {user.name}!</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'yellow' ? 'bg-yellow-100' :
                    stat.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'yellow' ? 'text-yellow-600' :
                      stat.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{t('quickActions')}</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map(action => {
                const Icon = action.icon;
                return action.enabled ? (
                  <Link
                    key={action.key}
                    href={action.href}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Icon className={`h-6 w-6 mr-3 ${action.key === 'ship' ? 'text-blue-600' : action.key === 'track' ? 'text-green-600' : 'text-purple-600'}`} />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{action.title}</p>
                      <p className="text-xs text-gray-500">{action.desc}</p>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={action.key}
                    className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-100 opacity-50 cursor-not-allowed select-none"
                  >
                    <Icon className={`h-6 w-6 mr-3 ${action.key === 'ship' ? 'text-blue-600' : action.key === 'track' ? 'text-green-600' : 'text-purple-600'}`} />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{action.title}</p>
                      <p className="text-xs text-gray-500">{action.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{t('recentOrders')}</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 relative">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}> 
                      {order.status === 'Delivered' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : order.status === 'In Transit' ? (
                        <Truck className="h-4 w-4" />
                      ) : order.status === 'Pending Pickup' ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{(() => {
                        const parts = order.summary.split(',');
                        if (parts.length === 3) {
                          const [names, weight, service] = parts;
                          return `${names},${weight},${t(serviceTypeKeyMap[service.trim()] || service.trim())}`;
                        }
                        return order.summary;
                      })()}</p>
                      <p className="text-sm text-gray-500">{order.id}</p>
                    </div>
                  </div>
                  <span className={`absolute right-6 top-4 h-7 w-24 flex items-center justify-center text-xs font-semibold ${getStatusColor(order.status)} z-10 rounded`}>{t(order.status === 'Pending Pickup' ? 'pendingPickup' : order.status === 'In Transit' ? 'inTransit' : order.status === 'Delivered' ? 'delivered' : order.status)}</span>
                  {order.status === 'Pending Pickup' && (
                    <div className="absolute right-6" style={{top: '3.5rem'}}>
                      <button
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-300 hover:bg-gray-200 transition-colors flex items-center gap-1"
                        onClick={() => handleRemind(order)}
                      >
                        <Bell className="h-4 w-4 mr-1" />
                        {t('remind')}
                      </button>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-sm text-gray-500">€{order.amount}</div>
                    <div className="text-sm text-gray-500">{order.date}</div>
                  </div>
                  <div className="mt-2">
                    <Link
                      href={`/track/detail/${order.id}`}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      {t('viewDetails')} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 