'use client'

import React, { useEffect, useState } from 'react'
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
  Download,
  Bell,
  Filter
} from 'lucide-react'
import { useTranslation } from '../../utils/translations'

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState<{id: string, summary: string, time: string}[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('kaifa-reminders');
      if (data) setReminders(JSON.parse(data));
    }
  }, []);

  const handleClearReminders = () => {
    localStorage.removeItem('kaifa-reminders');
    setReminders([]);
  };
  // 时间筛选
  const [statPeriod, setStatPeriod] = useState<'month'|'year'>('month');
  const statsData = {
    month: [
      { name: t('statTotalOrders'), value: '123', change: '+2.5%', changeType: 'increase', icon: Package, color: 'blue' },
      { name: t('statActiveCustomers'), value: '56', change: '+1.2%', changeType: 'increase', icon: Users, color: 'green' },
      { name: t('statInTransit'), value: '8', change: '-0.8%', changeType: 'decrease', icon: Truck, color: 'yellow' }
    ],
    year: [
      { name: t('statTotalOrders'), value: '1,234', change: '+12.5%', changeType: 'increase', icon: Package, color: 'blue' },
      { name: t('statActiveCustomers'), value: '567', change: '+8.2%', changeType: 'increase', icon: Users, color: 'green' },
      { name: t('statInTransit'), value: '89', change: '-3.1%', changeType: 'decrease', icon: Truck, color: 'yellow' }
    ]
  };
  const stats = statsData[statPeriod];

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

  // 用户付款管理mock数据和逻辑
  type Bill = { id: string; customer: string; amount: number; dueDate: string; status: string };
  const [paymentTab, setPaymentTab] = useState<string>('all');
  const [editingBill, setEditingBill] = useState<Bill|null>(null);
  const [bills, setBills] = useState<Bill[]>([
    { id: 'B2024001', customer: 'Andy Liu', amount: 120.5, dueDate: '2024-06-01', status: '待付' },
    { id: 'B2024002', customer: 'Carol Wang', amount: 89.0, dueDate: '2024-05-20', status: '已付' },
    { id: 'B2024003', customer: 'Dave Miller', amount: 150.0, dueDate: '2024-05-10', status: '超期' },
    { id: 'B2024004', customer: 'Eva Schmidt', amount: 60.0, dueDate: '2024-06-10', status: '待付' },
    { id: 'B2024005', customer: 'Frank Zhang', amount: 200.0, dueDate: '2024-05-01', status: '超期' },
    { id: 'B2024006', customer: 'Grace Lee', amount: 75.0, dueDate: '2024-05-30', status: '已付' },
  ]);
  const filteredPayments = bills.filter((bill: Bill) => paymentTab==='all' ? true : paymentTab==='paid' ? bill.status==='已付' : paymentTab==='unpaid' ? bill.status==='待付' : paymentTab==='overdue' ? bill.status==='超期' : true);
  const editBill = (bill: Bill) => setEditingBill({...bill});
  const saveBill = () => {
    if (!editingBill) return;
    setBills(bills.map(b => b.id===editingBill.id ? editingBill : b));
    setEditingBill(null);
  };
  const remindBill = (bill: Bill) => {
    alert(`${t('remindPaymentSent')||'Payment reminder sent to'} ${bill.customer}`);
  };

  // 最近订单筛选
  const [orderStatus, setOrderStatus] = useState('');
  const [orderCustomer, setOrderCustomer] = useState('');
  const [orderDateStart, setOrderDateStart] = useState('');
  const [orderDateEnd, setOrderDateEnd] = useState('');
  const filteredOrders = recentOrders.filter(order =>
    (orderStatus ? order.status === orderStatus : true) &&
    (orderCustomer ? order.customer.toLowerCase().includes(orderCustomer.toLowerCase()) : true) &&
    (orderDateStart && orderDateEnd ? order.date >= orderDateStart && order.date <= orderDateEnd : true) &&
    (orderDateStart && !orderDateEnd ? order.date >= orderDateStart : true) &&
    (!orderDateStart && orderDateEnd ? order.date <= orderDateEnd : true)
  );

  // 删除topRoutes相关数据和区块

  // 账单管理区块批量操作
  const handleExportBills = () => alert('导出账单功能（占位）');
  const handleBatchRemind = () => alert('批量提醒功能（占位）');

  // 假数据：待审核月结申请、异常订单
  const pendingMonthly = 2;

  return (
    <section className="space-y-6">
      {/* 顶部提醒 */}
      <div className="flex gap-4 mb-2">
        <a href="/admin/monthly-billing-requests" className="flex items-center gap-1 bg-yellow-50 border border-yellow-300 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-100 cursor-pointer">
          <Bell className="h-4 w-4" /> 待审核月结申请 <span className="font-bold">{pendingMonthly}</span>
        </a>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboardTitle')}</h1>
        <p className="text-gray-600">{t('dashboardWelcome')}</p>
        </div>
        {/* 时间筛选 */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">统计周期：</span>
          <button className={`px-3 py-1 rounded text-xs font-semibold border ${statPeriod==='month'?'bg-blue-50 border-blue-400 text-blue-700':'bg-gray-50 border-gray-300 text-gray-600'}`} onClick={()=>setStatPeriod('month')}>本月</button>
          <button className={`px-3 py-1 rounded text-xs font-semibold border ${statPeriod==='year'?'bg-blue-50 border-blue-400 text-blue-700':'bg-gray-50 border-gray-300 text-gray-600'}`} onClick={()=>setStatPeriod('year')}>本年</button>
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
      {/* 用户付款管理区块 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">{t('paymentManagement') || 'Payment Management'}</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded text-xs font-semibold border bg-blue-50 border-blue-400 text-blue-700" onClick={handleExportBills}><Download className="h-4 w-4 inline" /> 导出账单</button>
            <button className="px-3 py-1 rounded text-xs font-semibold border bg-yellow-50 border-yellow-400 text-yellow-700" onClick={handleBatchRemind}><Bell className="h-4 w-4 inline" /> 批量提醒</button>
          </div>
        </div>
        <table className="min-w-full text-xs text-gray-900">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2 text-left">{t('customer')}</th>
              <th className="py-2 text-left">{t('billNo')||'Bill No.'}</th>
              <th className="py-2 text-left">{t('amount')}</th>
              <th className="py-2 text-left">{t('dueDate')}</th>
              <th className="py-2 text-left">{t('status')}</th>
              <th className="py-2 text-left">{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(bill => (
              <tr key={bill.id} className="border-b last:border-0">
                <td className="py-2">{bill.customer}</td>
                <td className="py-2">{bill.id}</td>
                <td className="py-2">€{bill.amount}</td>
                <td className="py-2">{bill.dueDate}</td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bill.status==='已付'?'bg-green-100 text-green-700':bill.status==='待付'?'bg-yellow-100 text-yellow-700':bill.status==='超期'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-700'}`}>{t(bill.status==='已付'?'paid':bill.status==='待付'?'unpaid':bill.status==='超期'?'overdue':bill.status)}</span>
                </td>
                <td className="py-2 flex gap-2">
                  <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50" onClick={()=>editBill(bill)}>{t('edit')||'Edit'}</button>
                  {(bill.status==='待付'||bill.status==='超期') && <button className="px-2 py-1 text-xs border border-blue-300 text-blue-700 rounded hover:bg-blue-50" onClick={()=>remindBill(bill)}>{t('remindPayment')||'Remind'}</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 编辑弹窗 */}
        {editingBill && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
              <h3 className="text-lg font-bold mb-4">{t('editBill')||'Edit Bill'}</h3>
              <div className="mb-2">
                <label className="block text-xs text-gray-500 mb-1">{t('amount')}</label>
                <input type="number" className="border rounded px-2 py-1 w-full" value={editingBill.amount} onChange={e=>setEditingBill({...editingBill,amount:Number(e.target.value)})} />
              </div>
              <div className="mb-2">
                <label className="block text-xs text-gray-500 mb-1">{t('dueDate')}</label>
                <input type="date" className="border rounded px-2 py-1 w-full" value={editingBill.dueDate} onChange={e=>setEditingBill({...editingBill,dueDate:e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">{t('status')}</label>
                <select className="border rounded px-2 py-1 w-full" value={editingBill.status} onChange={e=>setEditingBill({...editingBill,status:e.target.value})}>
                  <option value="已付">{t('paid')}</option>
                  <option value="待付">{t('unpaid')}</option>
                  <option value="超期">{t('overdue')}</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50" onClick={()=>setEditingBill(null)}>{t('cancel')}</button>
                <button className="px-3 py-1 text-xs border border-blue-500 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={saveBill}>{t('save')}</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 催单提醒区：优先级降低，白色卡片，次要按钮，位置下移 */}
      <div className="bg-white border border-gray-300 rounded-md p-3 flex items-center justify-between mb-4 text-xs mt-4">
        <div>
          <div className="font-semibold text-gray-700 mb-1" style={{fontSize:'13px'}}>{t('remindAreaTitle') || 'Reminders'}</div>
          {reminders.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-800 text-xs">
              {reminders.map(r => (
                <li key={r.id + r.time}>{r.summary} <span className="text-xs text-gray-400">[{new Date(r.time).toLocaleString()}]</span></li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 italic">{t('noReminders') || 'No reminders yet.'}</div>
          )}
        </div>
        <div className="flex flex-col gap-2 ml-6">
          <button 
            onClick={handleClearReminders} 
            className="px-2 py-1 bg-white text-gray-600 rounded border border-gray-300 text-xs font-normal hover:bg-gray-100 transition-colors" 
            disabled={reminders.length === 0}
            title="清除所有催单提醒"
          >
            {t('clearReminders') || 'Clear'}
          </button>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => { handleClearReminders(); alert(t('remindProcessed') || 'All reminders processed!'); }} 
              className="px-2 py-1 bg-white text-gray-600 rounded border border-gray-300 text-xs font-normal hover:bg-gray-100 transition-colors" 
              disabled={reminders.length === 0}
            >
              {t('processReminders') || 'Process All'}
            </button>
            <button 
              onClick={() => {
                alert(`一键处理功能说明：\n\n自动编辑当前列表中所有催单单号并提出催促，发邮件给相应公司UPS/TNT。\n\n如单号全部来自UPS与TNT其中一方则只编辑一封邮件发送至UPS客服邮箱，如单号来自UPS于TNT双方则各编辑一封邮件(内容为各自公司的单号)至UPS/TNT邮箱`);
              }}
              className="w-5 h-5 bg-orange-500 text-white rounded-full text-xs font-bold hover:bg-orange-600 transition-colors flex items-center justify-center shadow-md"
              title="查看功能说明"
            >
              !
            </button>
          </div>
        </div>
      </div>
      {/* 最近订单筛选区块 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-400" />
          <select value={orderStatus} onChange={e=>setOrderStatus(e.target.value)} className="border px-2 py-1 rounded text-sm text-black">
            <option value="">全部状态</option>
            <option value="Pending Pickup">待揽收</option>
            <option value="In Transit">运输中</option>
            <option value="Delivered">已送达</option>
            <option value="Exception">异常</option>
          </select>
          <input type="text" placeholder="客户名" value={orderCustomer} onChange={e=>setOrderCustomer(e.target.value)} className="border px-2 py-1 rounded text-sm text-black" />
          <div className="flex items-center gap-1">
            <span className="text-sm text-black">开始日期：</span>
            <input type="date" value={orderDateStart} onChange={e=>setOrderDateStart(e.target.value)} className="border px-2 py-1 rounded text-sm text-black" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-black">结束日期：</span>
            <input type="date" value={orderDateEnd} onChange={e=>setOrderDateEnd(e.target.value)} className="border px-2 py-1 rounded text-sm text-black" />
          </div>
        </div>
        <table className="min-w-full text-xs text-gray-900">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2 text-left">订单号</th>
              <th className="py-2 text-left">客户</th>
              <th className="py-2 text-left">状态</th>
              <th className="py-2 text-left">金额</th>
              <th className="py-2 text-left">时间</th>
              <th className="py-2 text-left">目的地</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{statusMap[order.status]}</td>
                <td>€{order.amount}</td>
                <td>{order.date}</td>
                <td>{order.destination}</td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr><td colSpan={6} className="text-center text-gray-400 py-4">无匹配订单</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* 删除topRoutes相关数据和区块 */}
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
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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