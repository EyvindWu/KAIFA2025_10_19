'use client'

import React, { useEffect, useState } from 'react'
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
  Bell,
  Search,
  User as UserIcon,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '../utils/translations';
import { SystemModal } from '../components/ClientProviders';

export default function UserDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation();
  const [showRemindSuccess, setShowRemindSuccess] = useState(false);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [monthlyForm, setMonthlyForm] = useState({ name: user?.name || '', phone: '', piva: '', email: user?.email || '' });
  const [monthlyStatus, setMonthlyStatus] = useState('');

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

  // 模拟动态获取统计数据
  const [userStats, setUserStats] = useState([
    { name: t('totalOrders'), value: 23, icon: Package, color: 'blue', href: '/orders' },
    { name: t('inTransit'), value: 5, icon: Truck, color: 'yellow', href: '/orders?status=in-transit' },
    { name: t('delivered'), value: 18, icon: CheckCircle, color: 'green', href: '/orders?status=delivered' },
    { name: t('totalSpent'), value: '€1,234', icon: Euro, color: 'purple', href: '/billing' }
  ]);

  // 快捷操作区全部可用
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
      enabled: true
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
    setShowRemindSuccess(true);
  };

  // 最近订单筛选/搜索
  const [orderSearch, setOrderSearch] = useState('');
  const filteredOrders = recentOrders.filter(order =>
    order.id.includes(orderSearch) || order.summary.toLowerCase().includes(orderSearch.toLowerCase())
  );
  // 月结账单状态映射
  const statusTextMap: Record<string, string> = {
    approved: '已开通',
    pending: '待审核',
    '': '未开通'
  };

  // 检查本地storage是否有申请
  useEffect(() => {
    const reqs = JSON.parse(localStorage.getItem('kaifa-monthly-requests') || '[]');
    const myReq = reqs.find((r: any) => r.email === user?.email);
    if (myReq) setMonthlyStatus(myReq.status);
    else setMonthlyStatus('');
  }, [user]);

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
    <>
      <SystemModal
        open={showRemindSuccess}
        onClose={() => setShowRemindSuccess(false)}
        title={t('remindSuccessTitle')}
        message={t('remindSent')}
      />
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center">
            <Link href="/" className="flex items-center text-blue-600 hover:underline mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              {t('backToHome')}
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t('welcomeBack')}, {user.name}!</h1>
            </div>
            {/* 个人资料快捷入口 */}
            <Link href="/profile" className="flex items-center gap-1 text-blue-600 hover:underline">
              <UserIcon className="h-5 w-5" /> {t('profile')}
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 月结申请按钮和弹窗 */}
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-medium text-gray-700">月结账单状态：</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              monthlyStatus === 'approved'
                ? 'bg-green-100 text-green-700'
                : monthlyStatus === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {statusTextMap[monthlyStatus] ?? '未开通'}
          </span>
          {monthlyStatus !== 'approved' && (
            <button className="ml-4 flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs" onClick={()=>setShowMonthlyModal(true)}>
              <Plus className="h-4 w-4" /> 申请月结
            </button>
          )}
        </div>
        {showMonthlyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={()=>setShowMonthlyModal(false)}>×</button>
              <h2 className="text-lg font-bold mb-4">申请月结</h2>
              <form onSubmit={e => {
                e.preventDefault();
                const reqs = JSON.parse(localStorage.getItem('kaifa-monthly-requests') || '[]');
                reqs.push({ ...monthlyForm, email: user?.email, status: 'pending', id: Date.now() });
                localStorage.setItem('kaifa-monthly-requests', JSON.stringify(reqs));
                setShowMonthlyModal(false);
                setMonthlyStatus('pending');
              }}>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">姓名</label>
                  <input className="w-full border px-3 py-2 rounded" value={monthlyForm.name} onChange={e=>setMonthlyForm(f=>({...f, name: e.target.value}))} required />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">电话号</label>
                  <input className="w-full border px-3 py-2 rounded" value={monthlyForm.phone} onChange={e=>setMonthlyForm(f=>({...f, phone: e.target.value}))} required />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">P.IVA</label>
                  <input className="w-full border px-3 py-2 rounded" value={monthlyForm.piva} onChange={e=>setMonthlyForm(f=>({...f, piva: e.target.value}))} required />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">邮箱号</label>
                  <input className="w-full border px-3 py-2 rounded bg-gray-100" value={user?.email||''} disabled />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">提交申请</button>
              </form>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.name} href={stat.href} className="bg-white rounded-lg shadow p-6 block hover:bg-blue-50 transition">
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
              </Link>
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
                return (
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
                )
              })}
            </div>
          </div>
        </div>
        {/* Recent Orders with search/filter */}
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{t('recentOrders')}</h3>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索订单号/收件人"
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none"
              />
              <Link href="/orders" className="ml-2 text-blue-600 hover:underline text-sm">全部订单</Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
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
                      <div className="absolute right-6 hidden md:block" style={{top: '3.5rem'}}>
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
                  {order.status === 'Pending Pickup' && (
                    <div className="mt-2 md:hidden w-full flex justify-end">
                      <button
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-300 hover:bg-gray-200 transition-colors flex items-center gap-1"
                        onClick={() => handleRemind(order)}
                      >
                        <Bell className="h-4 w-4 mr-1" />
                        {t('remind')}
                      </button>
                    </div>
                  )}
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
            {filteredOrders.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-400">无匹配订单</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
} 