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
  MapPin,
  Settings,
  Users as UsersIcon,
  Shield,
  Database,
  BarChart2,
  FileText,
  Download,
  AlertTriangle
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

  // 系统配置快捷入口
  const systemLinks = [
    { label: '用户管理', icon: UsersIcon, href: '/system_admin/users' },
    { label: '权限分配', icon: Shield, href: '/system_admin/roles' },
    { label: '价格配置', icon: FileText, href: '/system_admin/pricing' },
    { label: 'API管理', icon: Database, href: '/system_admin/api' },
    { label: '数据导出', icon: Download, href: '#' },
  ];
  // 用户/企业管理入口
  const userCompanyLinks = [
    { label: '用户管理', href: '/system_admin/users' },
    { label: '企业管理', href: '/system_admin/companies' },
  ];
  // 假数据：系统日志、安全告警
  const logs = [
    { time: '2024-06-01 10:00', type: '登录', user: 'admin', desc: '管理员登录系统' },
    { time: '2024-06-01 09:50', type: '权限变更', user: 'super_admin', desc: '修改用户权限' },
  ];
  const alerts = [
    { time: '2024-06-01 08:30', level: '高', desc: '检测到异常登录尝试' },
    { time: '2024-05-31 22:10', level: '中', desc: 'API访问频率异常' },
  ];

  return (
    <section className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboardTitle')}</h1>
        <p className="text-gray-600">{t('dashboardWelcome')}</p>
      </div>
      {/* 系统配置快捷入口 */}
      <div className="flex flex-wrap gap-4 mb-4">
        {systemLinks.map(link => (
          <a key={link.label} href={link.href} className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition">
            <link.icon className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">{link.label}</span>
          </a>
        ))}
      </div>
      {/* 平台运营数据可视化（占位） */}
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 className="h-5 w-5 text-purple-600" />
          <span className="font-bold text-lg text-gray-800">平台运营数据趋势</span>
        </div>
        <div className="h-32 flex items-center justify-center text-gray-400">[趋势图/数据可视化占位]</div>
      </div>
      {/* 用户/企业管理入口 */}
      <div className="flex gap-4 mb-4">
        {userCompanyLinks.map(link => (
          <a key={link.label} href={link.href} className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition">
            <UsersIcon className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">{link.label}</span>
          </a>
        ))}
      </div>
      {/* Stats Grid */}
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
      {/* Recent Orders & Top Routes 保持原有 */}
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
            {/* The topRoutes data and rendering were removed as per the edit hint. */}
            <div className="px-6 py-4 text-center text-gray-500">
              {t('topRoutesDataRemoved')}
            </div>
          </div>
        </div>
      </div>
      {/* 系统日志与安全告警区块 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <span className="font-bold text-gray-800">系统日志</span>
          </div>
          <ul className="text-xs text-gray-700">
            {logs.map((log, idx) => (
              <li key={idx} className="mb-1">[{log.time}] {log.type} - {log.user}：{log.desc}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-bold text-red-800">安全告警</span>
          </div>
          <ul className="text-xs text-gray-700">
            {alerts.map((alert, idx) => (
              <li key={idx} className="mb-1">[{alert.time}] <span className="font-bold">[{alert.level}]</span> {alert.desc}</li>
            ))}
          </ul>
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