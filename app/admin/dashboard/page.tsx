'use client'

import React, { useEffect, useState } from 'react'
import { 
  Package, 
  Users, 
  Truck, 
  Euro, 
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  MapPin,
  Download,
  Bell,
  Filter,
  Info,
  ChevronLeft,
  ChevronRight,
  Search,
  Mail,
  Copy,
  ExternalLink,
  ClipboardCheck,
  Eye,
  X,
  Code,
  TrendingUp,
  UserPlus,
  Edit,
  Trash2,
  Save,
  Building2,
  Phone,
  MapPinned,
  CreditCard,
  UserCheck,
  UserX
} from 'lucide-react'
import { useTranslation } from '../../utils/translations'

export default function AdminDashboard() {
  const { t } = useTranslation();
  
  // 催单工作台状态
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  // 时间筛选 - 标签状态选择
  type TimeRangeType = 'month' | 'lastMonth' | 'quarter' | 'year';
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeType>('month');
  
  const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };
  
  const [startMonth, setStartMonth] = useState<string>(getCurrentYearMonth());
  const [endMonth, setEndMonth] = useState<string>(getCurrentYearMonth());

  // 根据选择的时间范围计算起止月份
  const setTimeRange = (range: TimeRangeType) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    setSelectedTimeRange(range);
    
    switch (range) {
      case 'month':
        // 本月
        const currentMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
        setStartMonth(currentMonth);
        setEndMonth(currentMonth);
        break;
      case 'lastMonth':
        // 上月
        const lastMonthDate = new Date(year, month - 1, 1);
        const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;
        setStartMonth(lastMonth);
        setEndMonth(lastMonth);
        break;
      case 'quarter':
        // 本季度
        const quarterStartMonth = Math.floor(month / 3) * 3;
        const quarterEndMonth = quarterStartMonth + 2;
        setStartMonth(`${year}-${String(quarterStartMonth + 1).padStart(2, '0')}`);
        setEndMonth(`${year}-${String(quarterEndMonth + 1).padStart(2, '0')}`);
        break;
      case 'year':
        // 本年
        setStartMonth(`${year}-01`);
        setEndMonth(`${year}-12`);
        break;
    }
  };

  // 根据时间范围计算统计数据的倍数
  const getStatsMultiplier = () => {
    switch (selectedTimeRange) {
      case 'month':
        return 1;
      case 'lastMonth':
        return 0.85; // 上月数据略少于本月（模拟真实场景）
      case 'quarter':
        return 2.8; // 季度约为3个月，但考虑到增长趋势
      case 'year':
        return 11.5; // 年度约为12个月，但考虑到全年增长
      default:
        return 1;
    }
  };

  // 统计数据 - 根据时间范围动态计算
  const multiplier = getStatsMultiplier();
  const baseOrders = 123;
  const baseRevenue = 12345.50;
  const baseMerchants = 56;
  const baseInTransit = 8;

  const stats = [
    { 
      name: t('statTotalOrders'), 
      value: Math.round(baseOrders * multiplier).toString(), 
      icon: Package, 
      color: 'blue' 
    },
    { 
      name: t('statTotalRevenue'), 
      value: `€${(baseRevenue * multiplier).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      icon: Euro, 
      color: 'purple' 
    },
    { 
      name: t('statActiveMerchants'), 
      value: Math.round(baseMerchants * Math.min(multiplier, 1.5)).toString(), // 商家数增长较慢
      icon: Users, 
      color: 'green', 
      tooltip: t('statActiveMerchantsTooltip') 
    },
    { 
      name: t('statInTransit'), 
      value: Math.round(baseInTransit * Math.min(multiplier, 2)).toString(), // 在途订单不会随时间范围线性增长
      icon: Truck, 
      color: 'yellow' 
    }
  ];

  // 仅保留客服/管理员常用统计
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
  ]

  // 催单工作台 - 待取件超期订单数据
  const overduePickupOrders = [
    {
      id: '1Z999AA10123456795',
      customer: 'Andy Liu',
      company: 'Liu Trading GmbH',
      email: 'andy@liutrading.de',
      phone: '+49 30 12345678',
      address: 'Friedrichstraße 123, 10117 Berlin',
      orderDate: '2024-01-12 09:30',
      expectedPickup: '2024-01-13',
      overdueDays: 2,
      amount: 45.50,
      weight: '2.5kg',
      destination: 'Berlin, Germany'
    },
    {
      id: '1Z999AA10123456788',
      customer: 'Zhang Wei',
      company: 'Wei Import Export',
      email: 'zhang@weiimport.com',
      phone: '+49 89 98765432',
      address: 'Karlsplatz 5, 80335 Munich',
      orderDate: '2024-01-11 14:20',
      expectedPickup: '2024-01-12',
      overdueDays: 3,
      amount: 78.90,
      weight: '4.2kg',
      destination: 'Munich, Germany'
    },
    {
      id: '1Z999AA10123456780',
      customer: 'Lisa Schmidt',
      company: 'Schmidt Logistics',
      email: 'lisa@schmidtlog.de',
      phone: '+49 40 11223344',
      address: 'Reeperbahn 88, 20359 Hamburg',
      orderDate: '2024-01-13 16:45',
      expectedPickup: '2024-01-14',
      overdueDays: 1,
      amount: 52.30,
      weight: '3.1kg',
      destination: 'Hamburg, Germany'
    },
    {
      id: '1Z999AA10123456775',
      customer: 'Marco Rossi',
      company: 'Rossi Handelhaus',
      email: 'marco@rossihandel.de',
      phone: '+49 69 55667788',
      address: 'Zeil 112, 60313 Frankfurt',
      orderDate: '2024-01-10 11:15',
      expectedPickup: '2024-01-11',
      overdueDays: 4,
      amount: 95.60,
      weight: '5.8kg',
      destination: 'Frankfurt, Germany'
    },
    {
      id: '1Z999AA10123456770',
      customer: 'Sarah Müller',
      company: 'Müller Fashion GmbH',
      email: 'sarah@muellerfashion.com',
      phone: '+49 221 99887766',
      address: 'Hohe Straße 45, 50667 Cologne',
      orderDate: '2024-01-14 08:00',
      expectedPickup: '2024-01-14',
      overdueDays: 1,
      amount: 38.75,
      weight: '1.9kg',
      destination: 'Cologne, Germany'
    }
  ];

  // 催单工作台功能函数
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === overduePickupOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(overduePickupOrders.map(order => order.id));
    }
  };

  // 方案A：邮件自动化
  const handleSendBatchEmail = () => {
    if (selectedOrders.length === 0) {
      alert('请先选择要催单的订单');
      return;
    }
    
    const selectedOrdersData = overduePickupOrders.filter(order => 
      selectedOrders.includes(order.id)
    );
    
    // 按公司分组
    const groupedByCompany = selectedOrdersData.reduce((acc, order) => {
      if (!acc[order.company]) {
        acc[order.company] = [];
      }
      acc[order.company].push(order);
      return acc;
    }, {} as Record<string, typeof overduePickupOrders>);

    // 生成邮件内容预览
    let emailPreview = '将发送以下催单邮件：\n\n';
    Object.entries(groupedByCompany).forEach(([company, orders]) => {
      emailPreview += `收件人：${company} (${orders[0].email})\n`;
      emailPreview += `订单号：${orders.map(o => o.id).join(', ')}\n`;
      emailPreview += `超期天数：${orders.map(o => `${o.overdueDays}天`).join(', ')}\n\n`;
    });

    alert(emailPreview + '\n✅ 邮件已发送（演示功能）');
    setSelectedOrders([]);
  };

  // 方案B：复制订单号
  const handleCopyOrderNumbers = () => {
    if (selectedOrders.length === 0) {
      alert('请先选择要复制的订单');
      return;
    }
    
    const orderNumbers = selectedOrders.join('\n');
    navigator.clipboard.writeText(orderNumbers).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // 查看订单详情（新窗口）
  const handleViewOrderDetail = (orderId: string) => {
    window.open(`/track/detail/${orderId}`, '_blank');
  };

  // 删除topRoutes相关数据和区块

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



  // 订单管理筛选
  const [orderStatus, setOrderStatus] = useState('');
  const [orderSearch, setOrderSearch] = useState(''); // 客户或订单号搜索
  const [orderDateStart, setOrderDateStart] = useState('');
  const [orderDateEnd, setOrderDateEnd] = useState('');

  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null); // 选中查看详情的订单
  
  const filteredOrders = recentOrders.filter(order => {
    // 状态筛选
    if (orderStatus && order.status !== orderStatus) return false;
    
    // 客户或订单号搜索
    if (orderSearch) {
      const searchLower = orderSearch.toLowerCase();
      const matchCustomer = order.customer.toLowerCase().includes(searchLower);
      const matchOrderId = order.id.toLowerCase().includes(searchLower);
      if (!matchCustomer && !matchOrderId) return false;
    }
    
    // 时间范围筛选
    if (orderDateStart && orderDateEnd) {
      return order.date >= orderDateStart && order.date <= orderDateEnd;
    }
    if (orderDateStart && !orderDateEnd) {
      return order.date >= orderDateStart;
    }
    if (!orderDateStart && orderDateEnd) {
      return order.date <= orderDateEnd;
    }
    
    return true;
  });

  // 删除topRoutes相关数据和区块

  // 账单管理区块批量操作
  const handleExportBills = () => alert('导出账单功能（占位）');
  const handleBatchRemind = () => alert('批量提醒功能（占位）');

  // 假数据：待审核月结申请、异常订单
  const pendingMonthly = 2;

  return (
    <section className="space-y-6">
      {/* 顶部提醒 */}
      <div className="flex gap-4 mb-2 flex-wrap">
        <a href="/admin/monthly-billing-requests" className="flex items-center gap-1 bg-orange-500 border border-orange-600 text-white px-3 py-1.5 rounded hover:bg-orange-600 cursor-pointer shadow-md">
          <Bell className="h-4 w-4" /> 待审核月结申请 <span className="font-bold">{pendingMonthly}</span>
        </a>
      </div>
      {/* 时间范围筛选 - 标签状态 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTimeRange === 'month' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setTimeRange('month')}
          >
            月度
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTimeRange === 'lastMonth' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setTimeRange('lastMonth')}
          >
            上月
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTimeRange === 'quarter' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setTimeRange('quarter')}
          >
            季度
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTimeRange === 'year' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setTimeRange('year')}
          >
            年度
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">统计周期：</span>
          <input 
            type="month" 
            value={startMonth} 
            onChange={(e) => setStartMonth(e.target.value)}
            className="px-3 py-1.5 rounded text-sm border border-gray-300 text-gray-700"
            style={{ colorScheme: 'light' }}
          />
          <span className="text-gray-500">至</span>
          <input 
            type="month" 
            value={endMonth} 
            onChange={(e) => setEndMonth(e.target.value)}
            className="px-3 py-1.5 rounded text-sm border border-gray-300 text-gray-700"
            style={{ colorScheme: 'light' }}
          />
          <button 
            className="px-4 py-1.5 rounded text-sm font-semibold border bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              // 触发数据查询 - 预留接口对接
              console.log('查询统计数据:', { startMonth, endMonth });
            }}
          >
            查询
          </button>
        </div>
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
                  <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    {stat.tooltip && (
                      <button 
                        onClick={() => {
                          alert(stat.tooltip);
                        }}
                        className="w-4 h-4 bg-orange-500 text-white rounded-full text-[10px] font-bold hover:bg-orange-600 transition-colors flex items-center justify-center shadow-md"
                        title="查看说明"
                      >
                        !
                      </button>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 催单工作台 - 待取件超期订单 */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              催单工作台 - 待取件超期订单
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                {overduePickupOrders.length} 单
              </span>
            </h3>
            
            {/* 批量操作按钮 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                已选 {selectedOrders.length} 单
              </span>
              
              {/* 方案A：邮件自动化 */}
              <button
                onClick={handleSendBatchEmail}
                disabled={selectedOrders.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="h-4 w-4" />
                发送催单邮件
              </button>
              
              {/* 方案B：复制订单号 */}
              <button
                onClick={handleCopyOrderNumbers}
                disabled={selectedOrders.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  copySuccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {copySuccess ? (
                  <>
                    <ClipboardCheck className="h-4 w-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    复制订单号
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* 固定高度可滚动表格 */}
        <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === overduePickupOrders.length && overduePickupOrders.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3">超期</th>
                <th className="px-6 py-3">订单号</th>
                <th className="px-6 py-3">客户/公司</th>
                <th className="px-6 py-3">联系方式</th>
                <th className="px-6 py-3">取件地址</th>
                <th className="px-6 py-3">下单时间</th>
                <th className="px-6 py-3">金额</th>
                <th className="px-6 py-3">操作</th>
            </tr>
          </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overduePickupOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className={`hover:bg-gray-50 transition ${
                    selectedOrders.includes(order.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      order.overdueDays >= 3 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {order.overdueDays}天
                </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    <div className="text-xs text-gray-500">{order.weight}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-900">{order.phone}</div>
                    <div className="text-xs text-blue-600">{order.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-700 max-w-xs">{order.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-900">{order.orderDate}</div>
                    <div className="text-xs text-gray-500">应取: {order.expectedPickup}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">€{order.amount}</div>
                </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewOrderDetail(order.id)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      详情
                      <ExternalLink className="h-3 w-3" />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
              </div>
        
        {overduePickupOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-300" />
            <p className="text-lg font-medium">太棒了！当前没有超期订单</p>
          </div>
        )}
      </div>
      {/* 订单管理 */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            订单管理
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {filteredOrders.length} 单
            </span>
          </h3>
          </div>
        
        {/* B1 筛选器 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400" />
            
            {/* B1.2 订单状态 */}
            <select 
              value={orderStatus} 
              onChange={e => setOrderStatus(e.target.value)} 
              className="border border-gray-300 px-3 py-2 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <option value="">全部状态</option>
            <option value="Pending Pickup">待揽收</option>
            <option value="In Transit">运输中</option>
            <option value="Delivered">已送达</option>
            <option value="Exception">异常</option>
          </select>
            
            {/* B1.3 用户/客户名称 + 订单号搜索 */}
            <input 
              type="text" 
              placeholder="请输入客户或订单号" 
              value={orderSearch} 
              onChange={e => setOrderSearch(e.target.value)} 
              className="flex-1 min-w-[200px] border border-gray-300 px-3 py-2 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
            
            {/* B1.1 时间范围 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">时间范围：</span>
              <input 
                type="date" 
                value={orderDateStart} 
                onChange={e => setOrderDateStart(e.target.value)} 
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <span className="text-gray-400">-</span>
              <input 
                type="date" 
                value={orderDateEnd} 
                onChange={e => setOrderDateEnd(e.target.value)} 
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
          </div>
          </div>
        </div>
        
        {/* B2 查询结果列表 */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
                  <th className="py-3 px-4 text-left font-medium">订单号</th>
                  <th className="py-3 px-4 text-left font-medium">用户名称</th>
                  <th className="py-3 px-4 text-left font-medium">物流状态</th>
                  <th className="py-3 px-4 text-left font-medium">创建时间</th>
                  <th className="py-3 px-4 text-left font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
                {filteredOrders.map(order => {
                  // B2.3 物流状态带色彩标签
                  const statusColors: Record<string, string> = {
                    'Pending Pickup': 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    'In Transit': 'bg-blue-100 text-blue-800 border-blue-300',
                    'Delivered': 'bg-green-100 text-green-800 border-green-300',
                    'Exception': 'bg-red-100 text-red-800 border-red-300'
                  };
                  
                  return (
                    <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                      {/* B2.1 订单号 */}
                      <td className="py-3 px-4 font-mono text-xs text-gray-900">{order.id}</td>
                      
                      {/* B2.2 用户名称 */}
                      <td className="py-3 px-4 text-gray-900">{order.customer}</td>
                      
                      {/* B2.3 物流状态 */}
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                          {statusMap[order.status]}
                        </span>
                </td>
                      
                      {/* B2.4 创建时间 */}
                      <td className="py-3 px-4 text-gray-600">{order.date}</td>
                      
                      {/* B3 查看详情按钮 */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedOrderDetail(order)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          查看详情
                        </button>
                </td>
              </tr>
                  );
                })}
            {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>无匹配订单</p>
                    </td>
                  </tr>
            )}
          </tbody>
        </table>
      </div>
              </div>
      </div>
      
      {/* B3 订单详情弹窗 */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-blue-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                订单详情 - {selectedOrderDetail.id}
              </h3>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* 弹窗内容 - 可滚动 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 基本信息 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">基本信息</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">订单号：</span>
                    <span className="font-mono text-gray-900">{selectedOrderDetail.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">客户：</span>
                    <span className="text-gray-900">{selectedOrderDetail.customer}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">创建时间：</span>
                    <span className="text-gray-900">{selectedOrderDetail.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">目的地：</span>
                    <span className="text-gray-900">{selectedOrderDetail.destination}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">金额：</span>
                    <span className="text-gray-900 font-semibold">€{selectedOrderDetail.amount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">状态：</span>
                    <span className="font-semibold">{statusMap[selectedOrderDetail.status]}</span>
                  </div>
                </div>
              </div>
              
              {/* B3.1 完整的物流轨迹 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  物流轨迹
                </h4>
                <div className="space-y-3">
                  {/* 模拟物流轨迹数据 */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="w-0.5 h-full bg-green-300"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-sm font-medium text-gray-900">已送达</div>
                      <div className="text-xs text-gray-500">2024-01-15 16:30</div>
                      <div className="text-xs text-gray-600 mt-1">包裹已成功送达，签收人：本人</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-full bg-blue-300"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-sm font-medium text-gray-900">派送中</div>
                      <div className="text-xs text-gray-500">2024-01-15 09:20</div>
                      <div className="text-xs text-gray-600 mt-1">快递员正在派送中</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-full bg-blue-300"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-sm font-medium text-gray-900">到达目的地网点</div>
                      <div className="text-xs text-gray-500">2024-01-14 22:15</div>
                      <div className="text-xs text-gray-600 mt-1">Berlin Distribution Center</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-full bg-blue-300"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-sm font-medium text-gray-900">运输中</div>
                      <div className="text-xs text-gray-500">2024-01-13 14:00</div>
                      <div className="text-xs text-gray-600 mt-1">Hamburg Hub → Berlin</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">已揽收</div>
                      <div className="text-xs text-gray-500">2024-01-12 10:30</div>
                      <div className="text-xs text-gray-600 mt-1">包裹已被揽收</div>
                    </div>
                  </div>
        </div>
              </div>
              
              {/* B3.2 原始请求/响应数据 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Code className="h-4 w-4 text-gray-600" />
                  原始请求/响应数据（服务器记录）
                </h4>
                
                {/* 原始请求 */}
              <div className="mb-4">
                  <div className="text-xs font-medium text-gray-600 mb-2">请求 XML：</div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                    <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<TrackRequest>
  <Request>
    <TransactionReference>
      <CustomerContext>Track Request</CustomerContext>
    </TransactionReference>
    <RequestAction>Track</RequestAction>
  </Request>
  <TrackingNumber>${selectedOrderDetail.id}</TrackingNumber>
</TrackRequest>`}</pre>
              </div>
                </div>
                
                {/* 原始响应 */}
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">响应 JSON：</div>
                  <div className="bg-gray-900 text-blue-300 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                    <pre>{JSON.stringify({
                      trackingNumber: selectedOrderDetail.id,
                      status: selectedOrderDetail.status,
                      customer: selectedOrderDetail.customer,
                      destination: selectedOrderDetail.destination,
                      events: [
                        { timestamp: '2024-01-15 16:30', location: 'Berlin', status: 'Delivered', description: '包裹已成功送达' },
                        { timestamp: '2024-01-15 09:20', location: 'Berlin', status: 'Out for Delivery', description: '快递员正在派送中' },
                        { timestamp: '2024-01-14 22:15', location: 'Berlin Distribution Center', status: 'Arrived', description: '到达目的地网点' },
                        { timestamp: '2024-01-13 14:00', location: 'Hamburg Hub', status: 'In Transit', description: '运输中' },
                        { timestamp: '2024-01-12 10:30', location: 'Origin', status: 'Picked Up', description: '已揽收' }
                      ],
                      estimatedDelivery: '2024-01-15',
                      weight: '2.5kg',
                      serviceType: 'EXPRESS'
                    }, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 弹窗底部 */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                关闭
            </button>
          </div>
        </div>
      </div>
        )}

      {/* 删除topRoutes相关数据和区块 */}
    </section>
  )
} 