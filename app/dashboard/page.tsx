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
  FileText,
  Lock,
  Mail,
  Phone,
  Building,
  CreditCard,
  Home,
  Edit,
  Trash2,
  Receipt,
  X,
  Shield,
  Key,
  Settings,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Box
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '../utils/translations';
import { SystemModal } from '../components/ClientProviders';

export default function UserDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, updateUser } = useAuth()
  const { t } = useTranslation();
  const [showRemindSuccess, setShowRemindSuccess] = useState(false);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [monthlyForm, setMonthlyForm] = useState({ name: user?.name || '', phone: '', piva: '', email: user?.email || '' });
  const [monthlyStatus, setMonthlyStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressForm, setAddressForm] = useState({ name: '', phone: '', address: '', city: '', postalCode: '', isDefault: false });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [billPaid, setBillPaid] = useState(false); // 账单支付状态
  const [isVerified, setIsVerified] = useState(false); // 企业认证状态 - 用于原型演示
  
  // 时间筛选状态
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month'); // 'month' 或 'year'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12

  // 检查账单支付状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const billStatus = localStorage.getItem('kaifa-bill-paid');
      setBillPaid(billStatus === 'true');
      
      // 监听 localStorage 变化
      const handleStorageChange = () => {
        const billStatus = localStorage.getItem('kaifa-bill-paid');
        setBillPaid(billStatus === 'true');
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

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

  // 时间切换函数
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handlePrevYear = () => {
    setSelectedYear(selectedYear - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(selectedYear + 1);
  };

  // 格式化月份显示
  const formatMonth = (year: number, month: number) => {
    return `${year}-${month.toString().padStart(2, '0')}`;
  };


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

  // 生成更多订单数据
  const generateRecentOrders = () => {
    const statuses = ['Delivered', 'In Transit', 'Pending Pickup', 'Exception'];
    const recipients = ['Xavier', 'Victor', 'Tina', 'Sarah', 'Mike', 'Jenny', 'David', 'Lisa', 'Tom', 'Emma', 
                        'Jack', 'Sophie', 'Ryan', 'Olivia', 'Lucas', 'Mia', 'Noah', 'Ava', 'Ethan', 'Isabella',
                        'Mason', 'Charlotte', 'Logan', 'Amelia', 'James', 'Harper', 'Benjamin', 'Evelyn', 'Henry', 'Abigail'];
    const services = ['Standard', 'Express'];
    const orders = [];
    
    for (let i = 0; i < 30; i++) {
      const daysAgo = i;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      // 根据日期决定状态 - 越早的订单越可能已送达
      let status;
      if (daysAgo < 2) {
        status = statuses[Math.floor(Math.random() * 3)]; // Pending Pickup, In Transit, Delivered
      } else if (daysAgo < 7) {
        status = Math.random() > 0.3 ? 'Delivered' : 'In Transit';
      } else {
        status = Math.random() > 0.1 ? 'Delivered' : 'Exception';
      }
      
      const recipient = recipients[i % recipients.length];
      const service = services[Math.floor(Math.random() * services.length)];
      const weight = (Math.random() * 4 + 0.5).toFixed(1);
      const amount = service === 'Express' ? 
        (Math.random() * 50 + 50).toFixed(2) : 
        (Math.random() * 40 + 25).toFixed(2);
      
      orders.push({
        id: `1Z999AA1012345${(6795 - i).toString().padStart(4, '0')}`,
        status: status,
        summary: `Andy Liu → ${recipient}, ${weight}kg, ${service}`,
        date: date.toISOString().split('T')[0],
        amount: parseFloat(amount)
      });
    }
    
    return orders;
  };

  const recentOrders = generateRecentOrders();

  // 基于最近订单计算统计数据
  const calculateStatsFromOrders = () => {
    const totalOrders = recentOrders.length;
    const inTransit = recentOrders.filter(order => order.status === 'In Transit').length;
    const delivered = recentOrders.filter(order => order.status === 'Delivered').length;
    const pendingPickup = recentOrders.filter(order => order.status === 'Pending Pickup').length;
    const totalSpent = recentOrders.reduce((sum, order) => sum + order.amount, 0);
    
    return {
      orders: totalOrders,
      inTransit: inTransit,
      delivered: delivered,
      pendingPickup: pendingPickup,
      packages: totalOrders,
      spent: Math.round(totalSpent)
    };
  };

  const statsData = calculateStatsFromOrders();

  // 模拟动态获取统计数据 - 账单仅在已完成认证后显示
  const userStats = user?.monthlyBillingAuthorized 
    ? [
    { name: t('totalOrders'), value: statsData.orders, icon: Package, color: 'blue', href: '/orders' },
    { name: t('inTransit'), value: statsData.inTransit, icon: Truck, color: 'yellow', href: '/orders?status=in-transit' },
    { name: '待取件', value: statsData.pendingPickup, icon: Clock, color: 'orange', href: '/orders?status=pending-pickup' },
    { name: t('delivered'), value: statsData.delivered, icon: CheckCircle, color: 'green', href: '/orders?status=delivered' },
    { name: t('totalSpent'), value: `€${statsData.spent.toLocaleString()}`, icon: Euro, color: 'purple', href: '/billing' }
      ]
    : [
        { name: t('totalOrders'), value: statsData.orders, icon: Package, color: 'blue', href: '/orders' },
        { name: t('inTransit'), value: statsData.inTransit, icon: Truck, color: 'yellow', href: '/orders?status=in-transit' },
        { name: '待取件', value: statsData.pendingPickup, icon: Clock, color: 'orange', href: '/orders?status=pending-pickup' },
        { name: t('delivered'), value: statsData.delivered, icon: CheckCircle, color: 'green', href: '/orders?status=delivered' }
      ];

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

  // 最近订单筛选/搜索和分页
  const [orderSearch, setOrderSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  
  const filteredOrders = recentOrders.filter(order =>
    order.id.includes(orderSearch) || order.summary.toLowerCase().includes(orderSearch.toLowerCase())
  );
  
  // 计算分页
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);
  
  // 当搜索改变时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [orderSearch]);
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

  // 初始化地址数据
  useEffect(() => {
    const savedAddresses = JSON.parse(localStorage.getItem('kaifa-addresses') || '[]');
    const userAddresses = savedAddresses.filter((addr: any) => addr.userId === user?.id);
    setAddresses(userAddresses);
  }, [user]);

  // 处理地址保存
  const handleSaveAddress = () => {
    const savedAddresses = JSON.parse(localStorage.getItem('kaifa-addresses') || '[]');
    if (editingAddress) {
      const updatedAddresses = savedAddresses.map((addr: any) =>
        addr.id === editingAddress.id ? { ...addressForm, id: editingAddress.id, userId: user?.id } : addr
      );
      localStorage.setItem('kaifa-addresses', JSON.stringify(updatedAddresses));
      setAddresses(updatedAddresses.filter((addr: any) => addr.userId === user?.id));
    } else {
      const newAddress = { ...addressForm, id: Date.now(), userId: user?.id };
      const updatedAddresses = [...savedAddresses, newAddress];
      if (newAddress.isDefault) {
        updatedAddresses.forEach((addr: any) => {
          if (addr.id !== newAddress.id && addr.userId === user?.id) addr.isDefault = false;
        });
      }
      localStorage.setItem('kaifa-addresses', JSON.stringify(updatedAddresses));
      setAddresses(updatedAddresses.filter((addr: any) => addr.userId === user?.id));
    }
    setShowAddressModal(false);
    setEditingAddress(null);
    setAddressForm({ name: '', phone: '', address: '', city: '', postalCode: '', isDefault: false });
  };

  // 处理地址删除
  const handleDeleteAddress = (id: number) => {
    const savedAddresses = JSON.parse(localStorage.getItem('kaifa-addresses') || '[]');
    const updatedAddresses = savedAddresses.filter((addr: any) => addr.id !== id);
    localStorage.setItem('kaifa-addresses', JSON.stringify(updatedAddresses));
    setAddresses(updatedAddresses.filter((addr: any) => addr.userId === user?.id));
  };

  // 处理设置默认地址
  const handleSetDefault = (id: number) => {
    const savedAddresses = JSON.parse(localStorage.getItem('kaifa-addresses') || '[]');
    const updatedAddresses = savedAddresses.map((addr: any) => ({
      ...addr,
      isDefault: addr.id === id && addr.userId === user?.id
    }));
    localStorage.setItem('kaifa-addresses', JSON.stringify(updatedAddresses));
    setAddresses(updatedAddresses.filter((addr: any) => addr.userId === user?.id));
  };

  // 处理密码修改
  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('新密码和确认密码不一致');
      return;
    }
    // 这里只是模拟，实际应该调用后端API
    alert('密码修改成功');
    setShowPasswordModal(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
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
    <>
      <SystemModal
        open={showRemindSuccess}
        onClose={() => setShowRemindSuccess(false)}
        title={t('remindSuccessTitle')}
        message={t('remindSent')}
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-white hover:text-blue-100 mr-6">
              <ArrowLeft className="h-5 w-5 mr-1" />
              {t('backToHome')}
            </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{t('welcomeBack')}, {user.name}!</h1>
                <p className="text-blue-100 text-sm mt-1">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen bg-gray-50">
        {/* 侧边栏 */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">功能导航</h2>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'overview' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>总览</span>
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'account' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Shield className="h-5 w-5" />
                <span>账户信息与安全</span>
              </button>
              <button
                onClick={() => setActiveTab('address')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'address' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span>地址管理</span>
              </button>
              {isVerified ? (
                <Link
                  href="/billing"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-700 hover:bg-gray-50"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>账单/发票</span>
                </Link>
              ) : (
                <div
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-not-allowed text-gray-400 hover:text-gray-400"
                  title="需要通过企业认证后才能访问"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>账单/发票</span>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 通知横幅区域 */}
              <div className="space-y-3 mb-6">
                {/* 系统通知 */}
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      系统通知：我们的服务已全面升级，现支持更快捷的国际物流配送服务！
                    </p>
                  </div>
                </div>

                {/* 企业认证状态通知 - 未认证用户显示申请提示 */}
                {!isVerified && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Building className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-sm font-medium text-yellow-900">
                        提交企业认证申请，开通账单月结权限
                      </p>
                      <button
                        className="px-4 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium whitespace-nowrap"
                        onClick={() => setShowMonthlyModal(true)}
                      >
                        立即申请
                      </button>
                    </div>
                  </div>
                )}

                {/* 账单状态通知 - 仅在已认证用户时显示 */}
                {isVerified && (
                  billPaid ? (
                    <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <p className="text-sm font-medium text-green-900">
                          ✓ 所有账单已支付
                        </p>
                        <button
                          onClick={() => {
                            setBillPaid(false);
                          }}
                          className="ml-4 text-xs text-green-700 hover:text-green-800 underline"
                        >
                          [演示：切换为未支付]
                        </button>
                      </div>
                </div>
                  ) : (
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-600 rounded-lg p-4 shadow-md flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-6 w-6 text-orange-600 animate-pulse" />
                      </div>
                      <div className="flex-1 flex items-center justify-between flex-wrap gap-2">
                        <p className="text-sm font-semibold text-orange-900">
                          ⚠️ 新账单已生成，请尽快支付以避免影响服务使用。
                        </p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setBillPaid(true)}
                            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-semibold whitespace-nowrap shadow-sm hover:shadow-md"
                          >
                            立即支付
                          </button>
                          <button
                            onClick={() => {
                              setBillPaid(true);
                            }}
                            className="text-xs text-orange-700 hover:text-orange-800 underline whitespace-nowrap"
                          >
                            [演示：标记已支付]
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

        {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {userStats.map((stat) => {
            const Icon = stat.icon
            return (
                    <Link key={stat.name} href={stat.href} className="bg-white rounded-lg shadow-md p-6 block hover:shadow-lg hover:scale-105 transition-all">
                <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'yellow' ? 'bg-yellow-100' :
                    stat.color === 'orange' ? 'bg-orange-100' :
                    stat.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'yellow' ? 'text-yellow-600' :
                      stat.color === 'orange' ? 'text-orange-600' :
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
              <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">{t('quickActions')}</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map(action => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.key}
                    href={action.href}
                          className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
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

              {/* 时间筛选器 */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col items-center gap-4">
                  {/* 视图模式切换 */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">数据时间范围：</span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('month')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                          viewMode === 'month' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        按月
                      </button>
                      <button
                        onClick={() => setViewMode('year')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                          viewMode === 'year' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        按年
                      </button>
                    </div>
                  </div>

                  {/* 时间导航和统计数据 */}
                  <div className="flex items-center gap-6">
                    {/* 总包裹数显示 */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <Box className="h-5 w-5 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="text-xs text-blue-600 font-medium">总包裹数</span>
                        <span className="text-lg font-bold text-blue-900">
                          {statsData.packages}
                        </span>
                      </div>
                    </div>

                    {/* 时间导航 */}
                    <div className="flex items-center gap-3">
                      {viewMode === 'month' ? (
                        <>
                          <button
                            onClick={handlePrevMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-1 text-gray-700 hover:text-gray-900"
                          >
                            <ChevronLeft className="h-5 w-5" />
                            <span className="text-sm font-medium">前月</span>
                          </button>
                          <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-lg font-bold text-blue-900">
                              {formatMonth(selectedYear, selectedMonth)}
                            </span>
                          </div>
                          <button
                            onClick={handleNextMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-1 text-gray-700 hover:text-gray-900"
                          >
                            <span className="text-sm font-medium">次月</span>
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handlePrevYear}
                            className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-1 text-gray-700 hover:text-gray-900"
                          >
                            <ChevronLeft className="h-5 w-5" />
                            <span className="text-sm font-medium">上年</span>
                          </button>
                          <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-lg font-bold text-blue-900">
                              {selectedYear}
                            </span>
                          </div>
                          <button
                            onClick={handleNextYear}
                            className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-1 text-gray-700 hover:text-gray-900"
                          >
                            <span className="text-sm font-medium">次年</span>
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* 总金额显示 */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <Euro className="h-5 w-5 text-purple-600" />
                      <div className="flex flex-col">
                        <span className="text-xs text-purple-600 font-medium">总金额</span>
                        <span className="text-lg font-bold text-purple-900">
                          €{statsData.spent.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{t('recentOrders')}</h3>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索订单号/收件人"
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
                    <Link href="/orders" className="ml-2 text-blue-600 hover:underline text-sm font-medium">全部订单</Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {currentOrders.map((order) => (
                    <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition relative">
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
                            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                    >
                      {t('viewDetails')} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {currentOrders.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-400">无匹配订单</div>
            )}
          </div>
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                显示 {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} / 共 {filteredOrders.length} 条订单
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // 只显示当前页附近的页码
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 || 
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
          )}

          {/* 账户信息与安全 */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">账户信息与安全</h2>
              
              {/* 基础信息 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                  个人信息
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">姓名</p>
                      <p className="text-base font-medium text-gray-900">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">邮箱</p>
                      <p className="text-base font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">电话号码</p>
                      <p className="text-base font-medium text-gray-900">{user.phone || '355 1234567'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">公司名称</p>
                      <p className="text-base font-medium text-gray-900">{user.company || 'KAIFOOD S.r.l.'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="flex-1">
                      <p className={`text-sm ${monthlyStatus === 'approved' || monthlyStatus === 'pending' ? 'text-gray-500' : 'text-gray-300'}`}>P.IVA（税号）</p>
                      <p className={`text-base font-medium ${monthlyStatus === 'approved' || monthlyStatus === 'pending' ? 'text-gray-900' : 'text-gray-300'}`}>
                        {monthlyStatus === 'approved' || monthlyStatus === 'pending' ? (monthlyForm.piva || '01234567890') : '···········'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">用户ID</p>
                      <p className="text-base font-medium text-gray-900">KF{String(user.id).padStart(5, '0')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 账户信息 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">账户信息</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">注册时间</p>
                      <p className="text-base font-medium text-gray-900">2024-01-01</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">账户状态</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        正常
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 安全设置 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  修改密码
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">登录密码</p>
                        <p className="text-sm text-gray-500">定期更换密码可以保护账户安全</p>
                      </div>
                    </div>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      修改密码
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* 地址管理 */}
          {activeTab === 'address' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">地址与发货管理</h2>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressForm({ name: '', phone: '', address: '', city: '', postalCode: '', isDefault: false });
                    setShowAddressModal(true);
                  }}
                >
                  <Plus className="h-5 w-5" />
                  添加新地址
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">您还没有保存任何发货地址</p>
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    onClick={() => setShowAddressModal(true)}
                  >
                    添加第一个地址
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`bg-white rounded-lg shadow-md p-6 relative ${addr.isDefault ? 'border-2 border-blue-500' : ''}`}>
                      {addr.isDefault && (
                        <span className="absolute top-4 right-4 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">默认</span>
                      )}
                      <div className="mb-4">
                        <p className="font-bold text-gray-900 text-lg mb-1">{addr.name}</p>
                        <p className="text-sm text-gray-600">{addr.phone}</p>
                      </div>
                      <div className="mb-4 text-sm text-gray-700">
                        <p>{addr.address}</p>
                        <p>{addr.city} {addr.postalCode}</p>
                      </div>
                      <div className="flex gap-2">
                        {!addr.isDefault && (
                          <button
                            className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
                            onClick={() => handleSetDefault(addr.id)}
                          >
                            设为默认
                          </button>
                        )}
                        <button
                          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                          onClick={() => {
                            setEditingAddress(addr);
                            setAddressForm(addr);
                            setShowAddressModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                          onClick={() => {
                            if (confirm('确定要删除这个地址吗？')) {
                              handleDeleteAddress(addr.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 月结申请弹窗 */}
      {showMonthlyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={()=>setShowMonthlyModal(false)}>
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">提交企业认证</h2>
            <form onSubmit={e => {
              e.preventDefault();
              
              // 切换到已认证状态 - 原型演示
              setIsVerified(true);
              setShowMonthlyModal(false);
              
              // 保存到localStorage用于持久化演示
              const reqs = JSON.parse(localStorage.getItem('kaifa-monthly-requests') || '[]');
              const newRequest = {
                ...monthlyForm,
                email: user?.email,
                status: 'pending', // 改为待审核状态
                id: Date.now(),
                createdAt: new Date().toLocaleString('zh-CN', { 
                  year: 'numeric', 
                  month: '2-digit', 
                  day: '2-digit', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })
              };
              reqs.push(newRequest);
              localStorage.setItem('kaifa-monthly-requests', JSON.stringify(reqs));
              setMonthlyStatus('pending');
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">企业名称</label>
                <input 
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={monthlyForm.name} 
                  onChange={e=>setMonthlyForm(f=>({...f, name: e.target.value}))} 
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
                <input 
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={monthlyForm.phone} 
                  onChange={e=>setMonthlyForm(f=>({...f, phone: e.target.value}))} 
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">登记税号 (P.IVA)</label>
                <input 
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={monthlyForm.piva} 
                  onChange={e=>setMonthlyForm(f=>({...f, piva: e.target.value}))} 
                  pattern="[0-9]{11}"
                  title="请输入11位数字"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
                <input 
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 text-gray-900" 
                  value={user?.email||''} 
                  disabled 
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition">提交申请</button>
            </form>
          </div>
        </div>
      )}

      {/* 地址编辑弹窗 */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={()=>setShowAddressModal(false)}>
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">{editingAddress ? '编辑地址' : '添加新地址'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">联系人姓名</label>
                <input 
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={addressForm.name} 
                  onChange={e=>setAddressForm(f=>({...f, name: e.target.value}))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
                <input 
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={addressForm.phone} 
                  onChange={e=>setAddressForm(f=>({...f, phone: e.target.value}))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">详细地址</label>
                <textarea 
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={addressForm.address} 
                  onChange={e=>setAddressForm(f=>({...f, address: e.target.value}))} 
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
                <input 
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={addressForm.city} 
                  onChange={e=>setAddressForm(f=>({...f, city: e.target.value}))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮政编码</label>
                <input 
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={addressForm.postalCode} 
                  onChange={e=>setAddressForm(f=>({...f, postalCode: e.target.value}))} 
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isDefault"
                  checked={addressForm.isDefault} 
                  onChange={e=>setAddressForm(f=>({...f, isDefault: e.target.checked}))} 
                  className="h-4 w-4"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">设为默认地址</label>
              </div>
              <button 
                onClick={handleSaveAddress} 
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition"
              >
                保存地址
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 密码修改弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={()=>setShowPasswordModal(false)}>
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">修改登录密码</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                <input 
                  type="password"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={passwordForm.current} 
                  onChange={e=>setPasswordForm(f=>({...f, current: e.target.value}))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                <input 
                  type="password"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={passwordForm.new} 
                  onChange={e=>setPasswordForm(f=>({...f, new: e.target.value}))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                <input 
                  type="password"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={passwordForm.confirm} 
                  onChange={e=>setPasswordForm(f=>({...f, confirm: e.target.value}))} 
                />
              </div>
              <button 
                onClick={handleChangePassword} 
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}