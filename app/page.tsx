'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Truck, 
  Search, 
  Package, 
  User, 
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Printer,
  Share2,
  FileText,
  CreditCard,
  X,
  Bell
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from './utils/translations'
import { orderList } from './track/history/orderList'
import { personInfoMap } from './track/detail/[trackingNo]/utils'
import { buildTimeline } from './track/detail/[trackingNo]/utils'
import { SystemModal } from './components/ClientProviders';
import { usePathname } from 'next/navigation';

// Tab按钮统一样式
const tabBtnClass = 'flex-1 w-1/4 px-6 py-2 font-semibold border-b-2 transition-colors text-center flex items-center justify-center gap-1 text-base h-12'

// 1. 提取渲染条目的函数
function renderPrintShareOrders(mockOrders: any[], personInfoMap: any, t: any, handlePrint: any, handleShare: any, handleRemind: any, remindDisabledMap: any, printDisabledMap: any, remindSentMap: any, onRemindClick: any) {
  return mockOrders.map((order: any, idx: any) => {
    const isRemindDisabled = remindDisabledMap[order.id];
    const isPrintDisabled = printDisabledMap[order.id];
    const isRemindSent = remindSentMap[order.id];
    // 解析发件人/收件人
    const summaryMatch = order.summary?.match(/^(.*?) → (.*?)(,|，)(.*)$/);
    const senderName = summaryMatch ? summaryMatch[1].trim() : '-';
    const recipientName = summaryMatch ? summaryMatch[2].split(',')[0].trim() : '-';
    const senderCity = personInfoMap[senderName]?.city || '-';
    const recipientCity = personInfoMap[recipientName]?.city || '-';
    // 包裹数量和创建时间
    const packageCount = order.packageCount || 1;
    const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-';

    return (
      <div key={order.id} className="relative group p-6 rounded-xl border-2 bg-white hover:shadow-xl transition-all duration-300 flex flex-col gap-2">
          {/* 第一行：ICON、单号、状态标签 */}
          <div className="flex items-center gap-2 flex-nowrap">
            <Truck className="h-6 w-6 text-blue-600" />
            <Link href={`/track/detail/${order.id}`} className="font-mono text-base text-blue-700 font-bold hover:underline cursor-pointer whitespace-nowrap">{order.id}</Link>
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${order.status === 'Pending Pickup' ? 'bg-yellow-100 text-yellow-700' : order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
          </div>
          {/* 第二行：发件人姓名 → 收件人姓名，下一行显示城市+国家 */}
          <div className="flex flex-col gap-0 text-sm text-black">
            <div className="flex flex-row gap-2 items-center">
              <span className="truncate max-w-[120px] md:max-w-[200px]" title={senderName}>{senderName}</span>
              <span className="mx-1">→</span>
              <span className="truncate max-w-[120px] md:max-w-[200px]" title={recipientName}>{recipientName}</span>
            </div>
            <div className="flex flex-row gap-2 items-center text-xs text-gray-700 mt-0.5">
              <span>{senderCity}{personInfoMap[senderName]?.country ? `, ${personInfoMap[senderName].country}` : ''}</span>
              <span className="mx-1"></span>
              <span>{recipientCity}{personInfoMap[recipientName]?.country ? `, ${personInfoMap[recipientName].country}` : ''}</span>
            </div>
          </div>
          {/* 第三行：包裹数量，创建时间（同行） */}
          <div className="flex flex-row gap-6 text-sm text-black">
            <span>Package: {packageCount}</span>
            <span>Created: {createdAt}</span>
          </div>
          {/* 最后一行：View all info + 按钮组，移动端同行，PC端分开 */}
          <div className="flex flex-row items-center gap-2 mt-2">
            <Link href={`/track/detail/${order.id}`} className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors text-center">{t('view_all_info')}</Link>
            <button
              onClick={() => handlePrint(order)}
              className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-0 outline-none font-semibold ${isPrintDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              title={t('downloadPdf')}
              type="button"
              disabled={isPrintDisabled}
            >
              <Printer className="h-5 w-5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={e => handleShare(order, e)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-0 outline-none font-semibold share-btn"
              title={t('share')}
              type="button"
            >
              <Share2 className="h-5 w-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => onRemindClick(order)}
              className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-0 outline-none font-semibold ${isRemindDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              title={t('remind')}
              type="button"
              disabled={isRemindDisabled}
            >
              <Bell className="h-5 w-5" />
              <span className="hidden sm:inline">{isRemindSent ? t('reminded') : t('remind')}</span>
            </button>
          </div>
        </div>
      );
    });
}

// 新增分页和7天筛选逻辑
function getRecentOrders(orders: any[], days = 7) {
  const now = new Date();
  // 先筛选7天内
  const filtered = orders.filter(order => {
    if (!order.createdAt) return false;
    const created = new Date(order.createdAt);
    return (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24) < days;
  });
  // 优先Pending Pickup，再In Transit，队列内按时间倒序
  const pending = filtered.filter(o => o.status === 'Pending Pickup').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const inTransit = filtered.filter(o => o.status === 'In Transit').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const others = filtered.filter(o => o.status !== 'Pending Pickup' && o.status !== 'In Transit').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return [...pending, ...inTransit, ...others];
}

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [activeTab, setActiveTab] = useState<'track' | 'ship' | 'billing' | 'printShare'>('track')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showShare, setShowShare] = useState(false)
  const [showPrintConfirm, setShowPrintConfirm] = useState(false)
  const [pendingPrintOrder, setPendingPrintOrder] = useState<any>(null)
  const [shareOrder, setShareOrder] = useState<any>(null)
  const [sharePopoverPos, setSharePopoverPos] = useState<{top: number, left: number} | null>(null)
  const router = useRouter()
  const { t } = useTranslation()
  const [remindSentMap, setRemindSentMap] = useState<{[id: string]: boolean}>({});
  const [showRemindModal, setShowRemindModal] = useState(false);
  const [remindModalMsg, setRemindModalMsg] = useState('');
  const pathname = usePathname();

  // mockOrders同步为Order History的orderList
  const mockOrders = orderList

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      console.log(`Tracking package: ${trackingNumber}`)
      // In real implementation, this would redirect to tracking page with the number
    }
  }

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order)
  }

  // 初始化时默认选中第一个条目
  React.useEffect(() => {
    if (!selectedOrder) {
      const firstOrder = mockOrders.filter(order => order.status === 'Pending Pickup' || order.status === 'In Transit')[0]
      if (firstOrder) {
        setSelectedOrder(firstOrder)
      }
    }
  }, [selectedOrder])

  React.useEffect(() => {
    // 每次进入主页时重置关键状态，防止重复渲染
    setActiveTab('track');
    setShowShare(false);
    setShowPrintConfirm(false);
    setShareOrder(null);
    setSharePopoverPos(null);
    setRemindSentMap({});
    setShowRemindModal(false);
    setRemindModalMsg('');
  }, [pathname]);

  const handlePrint = async (order: any) => {
    setPendingPrintOrder(order);
    setShowPrintConfirm(true);
  }

  const handleShare = (order: any, e?: React.MouseEvent) => {
    setShareOrder(order);
    if (e && e.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setSharePopoverPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    } else {
      setSharePopoverPos(null);
    }
    setShowShare(true);
  }

  // 处理点击外部关闭分享弹窗
  React.useEffect(() => {
    if (!showShare) return
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (target && (target.closest('.share-popover') || target.closest('.share-btn'))) return
      setShowShare(false)
      setShareOrder(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showShare])

  // 确认打印弹窗的确认操作
  const confirmPrint = async () => {
    setShowPrintConfirm(false);
    if (!pendingPrintOrder) return;
    const order = pendingPrintOrder;
    // 动态导入jsbarcode库
    const JsBarcode = (await import('jsbarcode')).default;
    // 创建临时canvas元素来生成条形码
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, order.id, {
      format: "CODE128",
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 16,
      margin: 10,
      background: "#ffffff",
      lineColor: "#000000"
    });
    // 将canvas转换为data URL
    const barcodeDataUrl = canvas.toDataURL('image/png');
    // 生成包含订单详情的HTML内容，然后转换为PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Order Details - ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #2563eb; margin: 0; font-size: 28px; }
          .order-info { margin-bottom: 30px; }
          .info-row { display: flex; margin-bottom: 15px; }
          .label { font-weight: bold; width: 150px; color: #374151; }
          .value { flex: 1; color: #111827; }
          .status-badge { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: bold;
            ${order.status === 'Pending Pickup' ? 'background-color: #fef3c7; color: #92400e;' : ''}
            ${order.status === 'In Transit' ? 'background-color: #dbeafe; color: #1e40af;' : ''}
            ${order.status === 'Delivered' ? 'background-color: #d1fae5; color: #065f46;' : ''}
            ${order.status === 'Cancelled' ? 'background-color: #f3f4f6; color: #374151;' : ''}
          }
          .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>KAIFA EXPRESS</h1>
          <p>Order Details Report</p>
        </div>
        
        <div class="order-info">
          <div class="info-row">
            <div class="label">Order ID:</div>
            <div class="value">${order.id}</div>
          </div>
          <div class="info-row">
            <div class="label">Status:</div>
            <div class="value"><span class="status-badge">${order.status}</span></div>
          </div>
          <div class="info-row">
            <div class="label">Package Count:</div>
            <div class="value">1</div>
          </div>
          <div class="info-row">
            <div class="label">Recipient:</div>
            <div class="value">${order.recipient}</div>
          </div>
          <div class="info-row">
            <div class="label">Sender:</div>
            <div class="value">Andy Liu</div>
          </div>
          <div class="info-row">
            <div class="label">Summary:</div>
            <div class="value">Andy Liu → ${order.recipient}, ${order.city}</div>
          </div>
          <div class="info-row">
            <div class="label">Generated:</div>
            <div class="value">${new Date().toLocaleString()}</div>
          </div>
        </div>
        
        <!-- 条形码区域 -->
        <div style="text-align: center; margin: 30px 0; padding: 20px; border-top: 1px solid #e5e7eb;">
          <h3 style="color: #374151; margin-bottom: 15px; font-size: 16px;">Scan Barcode for Tracking</h3>
          <img src="${barcodeDataUrl}" alt="Barcode" style="border: 1px solid #d1d5db; border-radius: 8px; max-width: 100%;" />
          <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">Scan to track this order</p>
        </div>
        
        <div class="footer">
          <p>This document was generated by KAIFA EXPRESS Logistics Platform</p>
          <p>For any questions, please contact our support team</p>
        </div>
      </body>
      </html>
    `
    
    // 创建新窗口并打印
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      
      // 等待内容加载完成后打印
      printWindow.onload = () => {
        printWindow.print()
        // 打印完成后关闭窗口
        setTimeout(() => {
          printWindow.close()
        }, 1000)
      }
    } else {
      // 如果弹窗被阻止，使用alert提示
      alert('Please allow popups to print the order details')
    }
    setPendingPrintOrder(null);
  };

  // 取消打印
  const cancelPrint = () => {
    setShowPrintConfirm(false);
    setPendingPrintOrder(null);
  };

  const [printSharePage, setPrintSharePage] = useState(1);
  const ordersPerPage = 5;
  const recentOrders = getRecentOrders(orderList, 7);
  const totalPrintSharePages = Math.ceil(recentOrders.length / ordersPerPage);
  const pagedOrders = recentOrders.slice((printSharePage - 1) * ordersPerPage, printSharePage * ordersPerPage);

  const handleRemind = (order: any) => {
    // 可复用 dashboard 的提醒逻辑
    const reminders = JSON.parse(localStorage.getItem('kaifa-reminders') || '[]');
    reminders.push({
      id: order.id,
      summary: order.summary,
      time: new Date().toISOString(),
    });
    localStorage.setItem('kaifa-reminders', JSON.stringify(reminders));
    alert(t('remindSent'));
  };

  const onRemindClick = (order: any) => {
    setRemindSentMap(prev => ({ ...prev, [order.id]: true }));
    setRemindModalMsg(t('remindSent'));
    setShowRemindModal(true);
  };

  // 判断哪些订单不能催单/打印
  const remindDisabledMap = Object.fromEntries(pagedOrders.map(order => [order.id, ['In Transit', 'Delivered', 'Cancelled'].includes(order.status) || remindSentMap[order.id]]));
  const printDisabledMap = Object.fromEntries(pagedOrders.map(order => [order.id, ['Pending Pickup', 'Cancelled'].includes(order.status) ? false : true]));

  return (
    <div className="min-h-screen bg-[#f6f8fa] max-w-7xl mx-auto px-4 py-8">
      {/* Quick Actions Section - Tabs */}
      {/* PC端主功能区：只显示4个横向标签+功能面板 */}
      <section className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-green-900 via-blue-900 to-green-800 shadow-lg hidden md:block">
        <div className="max-w-6xl mx-auto py-10 px-2 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow-lg">{t('quickActions')}</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Tabs按钮组 */}
                <div className="flex flex-row justify-center gap-2 flex-1">
                  <button
                    className={`${tabBtnClass} border-transparent text-gray-700 bg-white hover:bg-green-50 hover:text-green-700`}
                    onClick={() => window.location.href = '/ship'}
                  >
                    {t('ship')}
                    <ChevronRight className="h-4 w-4 ml-1 text-green-600" />
                  </button>
                  <button
                    className={`${tabBtnClass} ${activeTab === 'track' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-700'}`}
                    onClick={() => setActiveTab('track')}
                  >
                    {t('track')}
                    {activeTab === 'track' ? (
                      <ChevronUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                  <button
                    className={`${tabBtnClass} ${activeTab === 'printShare' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-700'}`}
                    onClick={() => setActiveTab('printShare')}
                  >
                    {t('printShare')}
                    {activeTab === 'printShare' ? (
                      <ChevronUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                  <button
                    className={`${tabBtnClass} border-transparent text-gray-700 bg-white hover:bg-green-50 hover:text-green-700`}
                    onClick={() => window.location.href = '/billing'}
                  >
                    {t('billing')}
                    <ChevronRight className="h-4 w-4 ml-1 text-green-600" />
                  </button>
                </div>
                {/* Tabs内容区（主面板） */}
                <div className="p-6 min-h-[180px] w-full" style={{maxWidth: '100%'}}>
                  {activeTab === 'track' && (
                    <div className="max-w-md mx-auto text-center">
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder={t('enterTrackingNumber')}
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => router.push('/track')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {t('trackButton')}
                      </button>
                    </div>
                  )}
                  {activeTab === 'printShare' && (
                    <div className="max-w-4xl mx-auto">
                      <div className="mb-6 text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('recentOrders')}</h3>
                      </div>
                      <div className="space-y-6">
                        {renderPrintShareOrders(pagedOrders, personInfoMap, t, handlePrint, handleShare, handleRemind, remindDisabledMap, printDisabledMap, remindSentMap, onRemindClick)}
                      </div>
                      {/* 分页器和查看全部按钮 */}
                      <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-2">
                        <div className="flex gap-2">
                          <button disabled={printSharePage === 1} onClick={() => setPrintSharePage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50">&lt;</button>
                          <span>{printSharePage} / {totalPrintSharePages}</span>
                          <button disabled={printSharePage === totalPrintSharePages} onClick={() => setPrintSharePage(p => Math.min(totalPrintSharePages, p + 1))} className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50">&gt;</button>
                        </div>
                        <button onClick={() => router.push('/track/history')} className="mt-2 md:mt-0 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">{t('viewAllOrders')}</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 移动端主功能区：只在md以下显示 */}
      <section className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-green-900 via-blue-900 to-green-800 shadow-lg md:hidden">
        <div className="max-w-6xl mx-auto py-10 px-2 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow-lg">{t('quickActions')}</h2>
          <div className="flex flex-col gap-2 w-full bg-gradient-to-br from-green-900 via-blue-900 to-green-800">
            {/* Ship Tab (1) */}
            <div className="w-full">
              <button
                className={`w-full min-w-[140px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-left flex items-center gap-1 bg-transparent text-white`}
                onClick={() => window.location.href = '/ship'}
              >
                {t('ship')}
                <ChevronRight className="h-4 w-4 ml-1 text-white" />
              </button>
            </div>
            {/* Track Tab (2) */}
            <div className="w-full">
              <button
                className={`w-full min-w-[140px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-left flex items-center gap-1 bg-transparent text-white`}
                onClick={() => setActiveTab('track')}
              >
                {t('track')}
                <span className={`transition-transform duration-300 ml-1 ${activeTab === 'track' ? 'rotate-180' : ''}`}>
                  <ChevronDown className="h-4 w-4 text-white" />
                </span>
              </button>
              {activeTab === 'track' && (
                <div className="bg-white rounded-b-lg shadow-md p-4 w-full text-center transition-all duration-300 transform animate-slide-in-down">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder={t('enterTrackingNumber')}
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => router.push('/track')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t('trackButton')}
                  </button>
                </div>
              )}
            </div>
            {/* Print/Share Tab (3) */}
            <div className="w-full">
              <button
                className={`w-full min-w-[140px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-left flex items-center gap-1 bg-transparent text-white`}
                onClick={() => setActiveTab('printShare')}
              >
                {t('printShare')}
                <span className={`transition-transform duration-300 ml-1 ${activeTab === 'printShare' ? 'rotate-180' : ''}`}>
                  <ChevronDown className="h-4 w-4 text-white" />
                </span>
              </button>
              {activeTab === 'printShare' && (
                <div className="bg-white rounded-b-lg shadow-md p-4 w-full transition-all duration-300 transform animate-slide-in-down">
                  <div className="mb-4 text-center font-semibold text-gray-700">{t('recentOrders')}</div>
                  {/* 移动端：订单列表，每个条目后紧跟其详情框 */}
                  <div className="space-y-3">
                    {renderPrintShareOrders(pagedOrders, personInfoMap, t, handlePrint, handleShare, handleRemind, remindDisabledMap, printDisabledMap, remindSentMap, onRemindClick)}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
                    <div className="flex gap-2">
                      <button disabled={printSharePage === 1} onClick={() => setPrintSharePage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50">&lt;</button>
                      <span>{printSharePage} / {totalPrintSharePages}</span>
                      <button disabled={printSharePage === totalPrintSharePages} onClick={() => setPrintSharePage(p => Math.min(totalPrintSharePages, p + 1))} className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50">&gt;</button>
                    </div>
                    <button onClick={() => router.push('/track/history')} className="mt-2 sm:mt-0 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">{t('viewAllOrders')}</button>
                  </div>
                </div>
              )}
            </div>
            {/* Billing Tab (4) */}
            <div className="w-full">
              <button
                className={`w-full min-w-[140px] px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors text-left flex items-center gap-1 bg-transparent text-white`}
                onClick={() => window.location.href = '/billing'}
              >
                {t('billing')}
                <ChevronRight className="h-4 w-4 ml-1 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="mb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('professionalLogistics')}
            <span className="ml-3 align-super inline-block px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded-full">NEW</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('connectWithLeading')}
          </p>
        </div>
      </section>

      {/* Monthly Billing Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{t('monthlyBilling')}</h2>
            <p className="text-xl mb-6 opacity-90">{t('monthlyBillingDesc')}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                {t('learnMore')}
              </button>
              <button className="px-6 py-3 border-2 border-white text-white rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                {t('applyForMonthlyBilling')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('whyChoose')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('fastDelivery')}</h3>
            <p className="text-gray-600">{t('quickReliable')}</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('realTimeTrackingTitle')}</h3>
            <p className="text-gray-600">{t('trackPackages')}</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('support247')}</h3>
            <p className="text-gray-600">{t('roundTheClock')}</p>
          </div>
        </div>
      </section>

      {showPrintConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 min-w-[300px] max-w-[90vw] flex flex-col items-center gap-6 border border-gray-200">
            <div className="font-bold text-lg text-gray-800 mb-2">{t('downloadConfirm')}</div>
            {pendingPrintOrder && (
              <div className="text-base text-blue-700 font-mono font-bold">Order #: {pendingPrintOrder.id}</div>
            )}
            <div className="flex gap-4 w-full justify-center">
              <button onClick={cancelPrint} className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">{t('cancel')}</button>
              <button onClick={confirmPrint} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">{t('confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {showShare && shareOrder && sharePopoverPos && (
        <div style={{ position: 'absolute', top: sharePopoverPos.top, left: sharePopoverPos.left, zIndex: 9999 }}>
          <div className="share-popover bg-white border border-gray-200 rounded-xl shadow-2xl p-2 flex flex-row gap-2 animate-fade-in relative min-w-0">
            <button onClick={() => { setShowShare(false); setShareOrder(null); }} className="absolute -top-2 -right-2 p-1 bg-white border border-gray-200 rounded-full shadow hover:bg-gray-100 transition-colors" type="button">
              <X className="h-4 w-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-green-50 rounded transition-colors" title="WhatsApp" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.origin + '/track/detail/' + shareOrder.id)}`)} type="button">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-9 w-9" />
            </button>
            <button className="p-2 hover:bg-blue-50 rounded transition-colors" title="Facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/track/detail/' + shareOrder.id)}`)} type="button">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-9 w-9" />
            </button>
            <button className="p-2 hover:bg-blue-50 rounded transition-colors" title="Telegram" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/track/detail/' + shareOrder.id)}`)} type="button">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" className="h-9 w-9" />
            </button>
            <button className="p-2 hover:bg-blue-50 rounded transition-colors" title="X (Twitter)" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '/track/detail/' + shareOrder.id)}`)} type="button">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" alt="Twitter/X" className="h-9 w-9" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded transition-colors" title="Email" onClick={() => window.open(`mailto:?subject=Order%20Tracking&body=${encodeURIComponent(window.location.origin + '/track/detail/' + shareOrder.id)}`)} type="button">
              <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6" /></svg>
            </button>
          </div>
        </div>
      )}
      <SystemModal open={showRemindModal} onClose={() => setShowRemindModal(false)} message={remindModalMsg} />
    </div>
  )
} 