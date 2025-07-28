'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../utils/translations'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  ArrowLeft,
  Calendar,
  Euro,
  MapPin
} from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  status: string
  summary: string
  date: string
  amount: number
  from: string
  to: string
  weight: string
  service: string
  trackingNumber?: string
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

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

  // 模拟订单数据
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1Z999AA10123456795',
        status: 'Pending Pickup',
        summary: 'Andy Liu → Xavier, 1.8kg, Standard',
        date: '2024-01-15',
        amount: 45.50,
        from: 'Andy Liu',
        to: 'Xavier',
        weight: '1.8kg',
        service: 'Standard',
        trackingNumber: '1Z999AA10123456795'
      },
      {
        id: '1Z999AA10123456794',
        status: 'In Transit',
        summary: 'Andy Liu → Victor, 2.1kg, Express',
        date: '2024-01-14',
        amount: 67.80,
        from: 'Andy Liu',
        to: 'Victor',
        weight: '2.1kg',
        service: 'Express',
        trackingNumber: '1Z999AA10123456794'
      },
      {
        id: '1Z999AA10123456793',
        status: 'Delivered',
        summary: 'Andy Liu → Tina, 3.5kg, Standard',
        date: '2024-01-13',
        amount: 32.20,
        from: 'Andy Liu',
        to: 'Tina',
        weight: '3.5kg',
        service: 'Standard',
        trackingNumber: '1Z999AA10123456793'
      },
      {
        id: '1Z999AA10123456792',
        status: 'Exception',
        summary: 'Andy Liu → Maria, 0.8kg, Express',
        date: '2024-01-12',
        amount: 28.90,
        from: 'Andy Liu',
        to: 'Maria',
        weight: '0.8kg',
        service: 'Express',
        trackingNumber: '1Z999AA10123456792'
      },
      {
        id: '1Z999AA10123456791',
        status: 'Delivered',
        summary: 'Andy Liu → John, 1.2kg, Standard',
        date: '2024-01-11',
        amount: 25.60,
        from: 'Andy Liu',
        to: 'John',
        weight: '1.2kg',
        service: 'Standard',
        trackingNumber: '1Z999AA10123456791'
      }
    ]
    setOrders(mockOrders)
    setFilteredOrders(mockOrders)
  }, [])

  // 筛选和搜索
  useEffect(() => {
    let filtered = orders

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // 日期筛选
    if (dateFilter !== 'all') {
      const today = new Date()
      const orderDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => {
            orderDate.setTime(Date.parse(order.date))
            return orderDate.toDateString() === today.toDateString()
          })
          break
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter(order => {
            orderDate.setTime(Date.parse(order.date))
            return orderDate >= weekAgo
          })
          break
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter(order => {
            orderDate.setTime(Date.parse(order.date))
            return orderDate >= monthAgo
          })
          break
      }
    }

    // 搜索
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'id':
          aValue = a.id
          bValue = b.id
          break
        default:
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy, sortOrder])

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

  const exportOrders = () => {
    const csvContent = [
      ['订单号', '状态', '发件人', '收件人', '重量', '服务类型', '金额', '日期'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.status,
        order.from,
        order.to,
        order.weight,
        order.service,
        order.amount,
        order.date
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
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
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center text-blue-600 hover:underline mr-4">
                <ArrowLeft className="h-5 w-5 mr-1" />
                {t('backToDashboard')}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={exportOrders}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                导出订单
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 筛选和搜索 */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 搜索 */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索订单号、发件人、收件人..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 状态筛选 */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">所有状态</option>
                  <option value="Pending Pickup">待取件</option>
                  <option value="In Transit">运输中</option>
                  <option value="Delivered">已送达</option>
                  <option value="Exception">异常</option>
                </select>
              </div>

              {/* 日期筛选 */}
              <div>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">所有时间</option>
                  <option value="today">今天</option>
                  <option value="week">最近7天</option>
                  <option value="month">最近30天</option>
                </select>
              </div>
            </div>

            {/* 排序 */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-600">排序：</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">按日期</option>
                <option value="amount">按金额</option>
                <option value="id">按订单号</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总订单数</p>
                <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">待取件</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredOrders.filter(o => o.status === 'Pending Pickup').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">运输中</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredOrders.filter(o => o.status === 'In Transit').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Euro className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总金额</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{filteredOrders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 订单列表 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              订单列表 ({filteredOrders.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    订单信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金额
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {order.from} → {order.to}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {order.weight} • {order.service}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">
                          {order.status === 'Pending Pickup' ? '待取件' :
                           order.status === 'In Transit' ? '运输中' :
                           order.status === 'Delivered' ? '已送达' :
                           order.status === 'Exception' ? '异常' : order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      €{order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link
                        href={`/track/detail/${order.id}`}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        查看详情
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>暂无订单数据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 