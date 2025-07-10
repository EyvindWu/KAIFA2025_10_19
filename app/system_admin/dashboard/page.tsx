'use client'

import React from 'react'
import { 
  Package, 
  Users, 
  Truck, 
  Euro, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  MapPin
} from 'lucide-react'
import { useTranslation } from '../../utils/translations'

export default function SystemAdminDashboard() {
  const { t } = useTranslation();
  const stats = [
    {
      name: t('statTotalOrders'),
      value: '1,234',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: Package,
      color: 'blue'
    },
    {
      name: t('statActiveCustomers'),
      value: '567',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'green'
    },
    {
      name: t('statInTransit'),
      value: '89',
      change: '-3.1%',
      changeType: 'decrease' as const,
      icon: Truck,
      color: 'yellow'
    },
    {
      name: t('statRevenue'),
      value: '45,678',
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: Euro,
      color: 'purple'
    }
  ];

  const recentOrders = [
    {
      id: '1Z999AA10123456795',
      customer: 'Andy Liu',
      status: 'Pending Pickup',
      amount: 45.50,
      date: '2024-01-15 14:30',
      destination: 'Berlin, Germany'
    },
    {
      id: '1Z999AA10123456794',
      customer: 'Carol Wang',
      status: 'In Transit',
      amount: 67.80,
      date: '2024-01-15 12:15',
      destination: 'Munich, Germany'
    },
    {
      id: '1Z999AA10123456793',
      customer: 'Dave Miller',
      status: 'Delivered',
      amount: 32.20,
      date: '2024-01-15 10:45',
      destination: 'Frankfurt, Germany'
    },
    {
      id: '1Z999AA10123456792',
      customer: 'Eva Schmidt',
      status: 'Exception',
      amount: 89.90,
      date: '2024-01-15 09:20',
      destination: 'Hamburg, Germany'
    }
  ];

  const topRoutes = [
    { from: 'Berlin', to: 'Munich', orders: 156, revenue: 12450 },
    { from: 'Frankfurt', to: 'Hamburg', orders: 134, revenue: 10890 },
    { from: 'Cologne', to: 'Stuttgart', orders: 98, revenue: 7840 },
    { from: 'Düsseldorf', to: 'Leipzig', orders: 87, revenue: 6960 }
  ];

  const statusMap: Record<string, string> = {
    'Pending Pickup': t('pendingPickup'),
    'In Transit': t('inTransit'),
    'Delivered': t('delivered'),
    'Exception': t('exception'),
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'In Transit':
        return <Truck className="h-4 w-4" />
      case 'Pending Pickup':
        return <Clock className="h-4 w-4" />
      case 'Exception':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'In Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Pending Pickup':
        return 'bg-yellow-100 text-yellow-700';
      case 'Exception':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboardTitle')}</h1>
        <p className="text-gray-600">{t('dashboardWelcome')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
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
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`ml-1 text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="ml-2 text-sm text-gray-500">{t('statFromLastMonth')}</span>
              </div>
            </div>
          )
        })}
      </div>
      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{t('recentOrders')}</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>{getStatusIcon(order.status)}</div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">€{order.amount}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {order.destination}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>{statusMap[order.status]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Top Routes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{t('topRoutes')}</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {topRoutes.map((route, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{route.from} → {route.to}</p>
                    <p className="text-sm text-gray-500">{route.orders} {t('ordersLabel')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">€{route.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{t('revenueLabel')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{t('quickActions')}</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Package className="h-6 w-6 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{t('createOrder')}</p>
                <p className="text-xs text-gray-500">{t('addNewShipment')}</p>
              </div>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => window.location.href = '/system_admin/users'}>
              <Users className="h-6 w-6 text-green-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{t('addCustomer')}</p>
                <p className="text-xs text-gray-500">{t('registerNewCustomer')}</p>
              </div>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart3 className="h-6 w-6 text-purple-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{t('viewReports')}</p>
                <p className="text-xs text-gray-500">{t('analyticsInsights')}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
} 