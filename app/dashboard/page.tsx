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
  Plus
} from 'lucide-react'
import Link from 'next/link'

export default function UserDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

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

  // 模拟用户数据
  const userStats = [
    {
      name: 'Total Orders',
      value: '23',
      icon: Package,
      color: 'blue'
    },
    {
      name: 'In Transit',
      value: '5',
      icon: Truck,
      color: 'yellow'
    },
    {
      name: 'Delivered',
      value: '18',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'Total Spent',
      value: '€1,234',
      icon: Euro,
      color: 'purple'
    }
  ]

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
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="text-gray-600">Here's an overview of your shipments and orders.</p>
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
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/ship"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-6 w-6 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Create Shipment</p>
                  <p className="text-xs text-gray-500">Send a new package</p>
                </div>
              </Link>
              <Link
                href="/track"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Truck className="h-6 w-6 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Track Package</p>
                  <p className="text-xs text-gray-500">Check delivery status</p>
                </div>
              </Link>
              <Link
                href="/billing"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Euro className="h-6 w-6 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">View Billing</p>
                  <p className="text-xs text-gray-500">Manage payments</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
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
                      <p className="text-sm font-medium text-gray-900">{order.summary}</p>
                      <p className="text-sm text-gray-500">{order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">€{order.amount}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Link
                    href={`/track/detail/${order.id}`}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 