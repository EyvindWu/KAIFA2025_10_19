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
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from './utils/translations'

// Tab按钮统一样式
const tabBtnClass = 'flex-1 w-1/4 px-6 py-2 font-semibold border-b-2 transition-colors text-center flex items-center justify-center gap-1 text-base h-12'

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [activeTab, setActiveTab] = useState<'track' | 'ship' | 'billing' | 'printShare'>('track')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showShare, setShowShare] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  // mockOrders同步为Order History的orderList
  const mockOrders = [
    {
      id: '1Z999AA10123456795',
      status: 'Pending Pickup',
      recipient: 'Xavier',
      city: 'Munich',
      createdAt: '2024-05-01',
    },
    {
      id: '1Z999AA10123456794',
      status: 'Pending Pickup',
      recipient: 'Victor',
      city: 'Frankfurt',
      createdAt: '2024-05-01',
    },
    {
      id: '1Z999AA10123456793',
      status: 'In Transit',
      recipient: 'Tina',
      city: 'Hamburg',
      createdAt: '2024-05-01',
    },
    {
      id: '1Z999AA10123456792',
      status: 'In Transit',
      recipient: 'Rose',
      city: 'Stuttgart',
      createdAt: '2024-05-01',
    },
  ]

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

  const handlePrint = async (order: any) => {
    if (window.confirm(t('downloadConfirm'))) {
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
    }
  }

  const handleShare = (order: any) => {
    setShowShare(true)
  }

  // 处理点击外部关闭分享弹窗
  React.useEffect(() => {
    if (!showShare) return
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (target && (target.closest('.share-popover') || target.closest('.share-btn'))) return
      setShowShare(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showShare])

  return (
    <div className="min-h-screen bg-gray-50 max-w-7xl mx-auto px-4 py-8">
      {/* Quick Actions Section - Tabs */}
      <section className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-green-900 via-blue-900 to-green-800 shadow-lg">
        <div className="max-w-6xl mx-auto py-10 px-2 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow-lg">{t('quickActions')}</h2>

          {/* Tabs Header & Content - 响应式 */}
          {/* PC端 横向Tabs+内容，整体包裹在一个白色卡片里 */}
          <div className="hidden md:flex justify-center">
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
                        <p className="text-gray-600 text-sm">Select an order to view details and actions</p>
                      </div>
                      <div className="space-y-6">
                        {mockOrders.filter(order => order.status === 'Pending Pickup' || order.status === 'In Transit').slice(0, 3).map((order, idx) => (
                          <div key={order.id} className="relative group">
                            {/* 订单条目 */}
                            <div 
                              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                                selectedOrder?.id === order.id 
                                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl scale-[1.02]' 
                                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:scale-[1.01]'
                              }`}
                              onClick={() => handleOrderClick(order)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                                      <Package className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="font-mono text-blue-700 text-lg font-bold truncate">{order.id}</div>
                                      <div className="text-sm text-gray-600">{order.recipient}</div>
                                    </div>
                                    <span className={
                                      `inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ml-auto ` +
                                      (order.status === 'Pending Pickup'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                        : order.status === 'In Transit'
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : order.status === 'Delivered'
                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                        : order.status === 'Cancelled'
                                        ? 'bg-gray-100 text-gray-800 border border-gray-200'
                                        : 'bg-gray-100 text-gray-800 border border-gray-200')
                                    }>
                                      <div className={`w-2 h-2 rounded-full mr-2 ${
                                        order.status === 'Pending Pickup' ? 'bg-amber-500' :
                                        order.status === 'In Transit' ? 'bg-blue-500' :
                                        order.status === 'Delivered' ? 'bg-green-500' :
                                        'bg-gray-500'
                                      }`}></div>
                                      {t(order.status.toLowerCase().replace(/ /g, '_'))}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    selectedOrder?.id === order.id 
                                      ? 'bg-blue-500 text-white rotate-180' 
                                      : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                                  }`}>
                                    <ChevronDown className="h-4 w-4" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* 详情框 - 附着于对应条目 */}
                            {selectedOrder?.id === order.id && (
                              <div className="mt-4 bg-gradient-to-br from-white via-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6 shadow-lg relative overflow-hidden">
                                {/* 装饰性背景 */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-30"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100 to-transparent rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
                                
                                {/* 连接线 */}
                                <div className="absolute -top-2 left-8 w-4 h-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-2 border-t-2 border-blue-200 transform rotate-45"></div>
                                
                                {/* 操作按钮：右上角 */}
                                <div className="absolute top-4 right-4 flex gap-3 z-20">
                                  <div className="flex flex-col gap-3 items-stretch mt-6 mb-2">
                                    {selectedOrder.status === 'Pending Pickup' && (
                                      <button
                                        onClick={() => handlePrint(selectedOrder)}
                                        className="w-12 h-12 md:w-60 md:h-auto mx-auto flex items-center justify-center gap-0 md:gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full md:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-xl md:text-base font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer border-0 outline-none"
                                        title={t('downloadPdf')}
                                        type="button"
                                      >
                                        <Printer className="h-6 w-6 md:h-5 md:w-5 flex-shrink-0" />
                                        <span className="hidden md:inline whitespace-nowrap">{t('downloadPdf')}</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleShare(selectedOrder)}
                                      className="w-12 h-12 md:w-60 md:h-auto mx-auto flex items-center justify-center gap-0 md:gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full md:rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 text-xl md:text-base font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer border-0 outline-none share-btn"
                                      title={t('share')}
                                      type="button"
                                    >
                                      <Share2 className="h-6 w-6 md:h-5 md:w-5 flex-shrink-0" />
                                      <span className="hidden md:inline whitespace-nowrap">{t('share')}</span>
                                    </button>
                                  </div>
                                </div>

                                <div className="relative z-10 pr-40">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('trackingNumber')}</span>
                                      <div className="font-mono text-blue-700 font-bold text-lg mt-1">{selectedOrder.id}</div>
                                    </div>
                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('status')}</span>
                                      <div className="text-gray-800 font-semibold mt-1">{t(selectedOrder.status.toLowerCase().replace(/ /g, '_'))}</div>
                                    </div>
                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('packageCount')}</span>
                                      <div className="text-gray-800 font-semibold mt-1">1</div>
                                    </div>
                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('recipientInfo')}</span>
                                      <div className="text-gray-800 font-semibold mt-1">{selectedOrder.recipient}</div>
                                    </div>
                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('senderInfo')}</span>
                                      <div className="text-gray-800 font-semibold mt-1">Andy Liu</div>
                                    </div>
                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20 md:col-span-2">
                                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('summary')}</span>
                                      <div className="text-gray-800 font-semibold mt-1">Andy Liu → {selectedOrder.recipient}, {selectedOrder.city}</div>
                                    </div>
                                  </div>
                                </div>

                                {/* 查看全部信息按钮 */}
                                <div className="mt-4 flex justify-end">
                                  <Link
                                    href={`/track/detail/${selectedOrder.id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                                  >
                                    <span>{t('view_all_info')}</span>
                                    <ChevronRight className="h-4 w-4" />
                                  </Link>
                                </div>

                                {/* 分享弹窗 */}
                                {showShare && (
                                  <>
                                    {/* 遮罩层 */}
                                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] animate-fade-in" onClick={() => setShowShare(false)}></div>
                                    
                                    {/* 弹窗内容 */}
                                    <div className="share-popover fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-white border border-gray-200 rounded-xl shadow-2xl p-6 min-w-[280px] flex flex-col gap-3 animate-fade-in">
                                      {/* 关闭按钮 */}
                                      <button 
                                        onClick={() => setShowShare(false)}
                                        className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        type="button"
                                      >
                                        <X className="h-4 w-4 text-gray-500" />
                                      </button>
                                      
                                      <div className="font-bold text-gray-700 mb-2 text-center">{t('shareTo')}</div>
                                      <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50 text-green-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`)} type="button">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-5 w-5 flex-shrink-0" /> 
                                        <span className="whitespace-nowrap">WhatsApp</span>
                                      </button>
                                      <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50 text-green-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => alert('请在微信中手动粘贴链接') } type="button">
                                        <span className="h-5 w-5 flex items-center justify-center flex-shrink-0">
                                          <svg className="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M331.429 263.429q0-23.429-14.286-37.715t-37.714-14.285q-24.572 0-43.429 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.429 14.571q23.428 0 37.714-14t14.286-37.428zM756 553.143q0-16-14.571-28.572T704 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T704 594.857q22.857 0 37.429-12.571T756 553.143zM621.143 263.429q0-23.429-14-37.715t-37.429-14.285q-24.571 0-43.428 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.428 14.571q23.429 0 37.429-14t14-37.428zM984 553.143q0-16-14.857-28.572T932 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T932 594.857q22.286 0 37.143-12.571T984 553.143zM832 326.286Q814.286 324 792 324q-96.571 0-177.714 44T486.57 487.143 440 651.429q0 44.571 13.143 86.857-20 1.714-38.857 1.714-14.857 0-28.572-0.857t-31.428-3.714-25.429-4-31.143-6-28.571-6L124.57 792l41.143-124.571Q0 551.429 0 387.429q0-96.572 55.714-177.715T206.571 82t207.715-46.571q100.571 0 190 37.714T754 177.429t78 148.857z m338.286 320.571q0 66.857-39.143 127.714t-106 110.572l31.428 103.428-113.714-62.285q-85.714 21.143-124.571 21.143-96.572 0-177.715-40.286T512.857 797.714t-46.571-150.857T512.857 496t127.714-109.429 177.715-40.285q92 0 173.143 40.285t130 109.715 48.857 150.571z" fill="#0e932e"></path></svg>
                                        </span>
                                        <span className="whitespace-nowrap">WeChat</span>
                                      </button>
                                      <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)} type="button">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-5 w-5 flex-shrink-0" /> 
                                        <span className="whitespace-nowrap">Facebook</span>
                                      </button>
                                      <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`)} type="button">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" className="h-5 w-5 flex-shrink-0" /> 
                                        <span className="whitespace-nowrap">Telegram</span>
                                      </button>
                                      <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`)} type="button">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" alt="Twitter/X" className="h-5 w-5 flex-shrink-0" /> 
                                        <span className="whitespace-nowrap">X (Twitter)</span>
                                      </button>
                                      <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-gray-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => window.open(`mailto:?subject=Order%20Tracking&body=${encodeURIComponent(window.location.href)}`)} type="button">
                                        <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6" /></svg>
                                        <span className="whitespace-nowrap">Email</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 移动端：每个Tab按钮下方紧跟内容，纵向排列 */}
          <div className="md:hidden flex flex-col gap-2 w-full bg-gradient-to-br from-green-900 via-blue-900 to-green-800">
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
                    {mockOrders.filter(order => order.status === 'Pending Pickup' || order.status === 'In Transit').slice(0, 3).map((order, idx) => (
                      <div key={order.id}>
                        {/* 订单条目 */}
                        <div 
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            selectedOrder?.id === order.id 
                              ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl scale-[1.02]' 
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
                          }`}
                          onClick={() => handleOrderClick(order)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                  <Package className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-mono text-blue-700 text-base font-bold truncate">{order.id}</div>
                                  <div className="text-sm text-gray-600">{order.recipient}</div>
                                </div>
                                <span className={
                                  `inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ml-auto ` +
                                  (order.status === 'Pending Pickup'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : order.status === 'In Transit'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : order.status === 'Delivered'
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : order.status === 'Cancelled'
                                    ? 'bg-gray-100 text-gray-800 border border-gray-200'
                                    : 'bg-gray-100 text-gray-800 border border-gray-200')
                                }>
                                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                    order.status === 'Pending Pickup' ? 'bg-amber-500' :
                                    order.status === 'In Transit' ? 'bg-blue-500' :
                                    order.status === 'Delivered' ? 'bg-green-500' :
                                    'bg-gray-500'
                                  }`}></div>
                                  {t(order.status.toLowerCase().replace(/ /g, '_'))}
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                                selectedOrder?.id === order.id 
                                  ? 'bg-blue-500 text-white rotate-180' 
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                <ChevronDown className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* 详情框：附着于对应条目 */}
                        {selectedOrder?.id === order.id && (
                          <div className="mt-3 bg-gradient-to-br from-white via-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 shadow-lg relative overflow-hidden">
                            {/* 装饰性背景 */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-transparent rounded-full -translate-y-10 translate-x-10 opacity-30"></div>
                            
                            {/* 连接线 */}
                            <div className="absolute -top-1.5 left-6 w-3 h-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-2 border-t-2 border-blue-200 transform rotate-45"></div>
                            
                            {/* 操作按钮：右上角 */}
                            <div className="absolute top-3 right-3 flex gap-2 z-20">
                              <div className="flex flex-col gap-3 items-stretch mt-6 mb-2">
                                {selectedOrder.status === 'Pending Pickup' && (
                                  <button
                                    onClick={() => handlePrint(selectedOrder)}
                                    className="w-12 h-12 md:w-60 md:h-auto mx-auto flex items-center justify-center gap-0 md:gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full md:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-xl md:text-base font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer border-0 outline-none"
                                    title={t('downloadPdf')}
                                    type="button"
                                  >
                                    <Printer className="h-6 w-6 md:h-5 md:w-5 flex-shrink-0" />
                                    <span className="hidden md:inline whitespace-nowrap">{t('downloadPdf')}</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleShare(selectedOrder)}
                                  className="w-12 h-12 md:w-60 md:h-auto mx-auto flex items-center justify-center gap-0 md:gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full md:rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 text-xl md:text-base font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer border-0 outline-none share-btn"
                                  title={t('share')}
                                  type="button"
                                >
                                  <Share2 className="h-6 w-6 md:h-5 md:w-5 flex-shrink-0" />
                                  <span className="hidden md:inline whitespace-nowrap">{t('share')}</span>
                                </button>
                              </div>
                            </div>

                            <div className="relative z-10 pr-28">
                              <div className="space-y-3">
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('trackingNumber')}</span>
                                  <div className="font-mono text-blue-700 font-bold text-base mt-1">{selectedOrder.id}</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('status')}</span>
                                  <div className="text-gray-800 font-semibold mt-1">{t(selectedOrder.status.toLowerCase().replace(/ /g, '_'))}</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('recipientInfo')}</span>
                                  <div className="text-gray-800 font-semibold mt-1">{selectedOrder.recipient}</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('summary')}</span>
                                  <div className="text-gray-800 font-semibold mt-1">Andy Liu → {selectedOrder.recipient}, {selectedOrder.city}</div>
                                </div>
                              </div>
                              
                              {/* 查看全部信息按钮 */}
                              <div className="mt-4 flex justify-end">
                                <Link
                                  href={`/track/detail/${selectedOrder.id}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                  <span>{t('view_all_info')}</span>
                                  <ChevronRight className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>

                            {/* 分享弹窗 */}
                            {showShare && (
                              <>
                                {/* 遮罩层 */}
                                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] animate-fade-in" onClick={() => setShowShare(false)}></div>
                                
                                {/* 弹窗内容 */}
                                <div className="share-popover fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-white border border-gray-200 rounded-xl shadow-2xl p-6 min-w-[280px] flex flex-col gap-3 animate-fade-in">
                                  {/* 关闭按钮 */}
                                  <button 
                                    onClick={() => setShowShare(false)}
                                    className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    type="button"
                                  >
                                    <X className="h-4 w-4 text-gray-500" />
                                  </button>
                                  
                                  <div className="font-bold text-gray-700 mb-2 text-center">{t('shareTo')}</div>
                                  <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50 text-green-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`)} type="button">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-5 w-5 flex-shrink-0" /> 
                                    <span className="whitespace-nowrap">WhatsApp</span>
                                  </button>
                                  <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50 text-green-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => alert('请在微信中手动粘贴链接') } type="button">
                                    <span className="h-5 w-5 flex items-center justify-center flex-shrink-0">
                                      <svg className="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M331.429 263.429q0-23.429-14.286-37.715t-37.714-14.285q-24.572 0-43.429 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.429 14.571q23.428 0 37.714-14t14.286-37.428zM756 553.143q0-16-14.571-28.572T704 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T704 594.857q22.857 0 37.429-12.571T756 553.143zM621.143 263.429q0-23.429-14-37.715t-37.429-14.285q-24.571 0-43.428 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.428 14.571q23.429 0 37.429-14t14-37.428zM984 553.143q0-16-14.857-28.572T932 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T932 594.857q22.286 0 37.143-12.571T984 553.143zM832 326.286Q814.286 324 792 324q-96.571 0-177.714 44T486.57 487.143 440 651.429q0 44.571 13.143 86.857-20 1.714-38.857 1.714-14.857 0-28.572-0.857t-31.428-3.714-25.429-4-31.143-6-28.571-6L124.57 792l41.143-124.571Q0 551.429 0 387.429q0-96.572 55.714-177.715T206.571 82t207.715-46.571q100.571 0 190 37.714T754 177.429t78 148.857z m338.286 320.571q0 66.857-39.143 127.714t-106 110.572l31.428 103.428-113.714-62.285q-85.714 21.143-124.571 21.143-96.572 0-177.715-40.286T512.857 797.714t-46.571-150.857T512.857 496t127.714-109.429 177.715-40.285q92 0 173.143 40.285t130 109.715 48.857 150.571z" fill="#0e932e"></path></svg>
                                    </span>
                                    <span className="whitespace-nowrap">WeChat</span>
                                  </button>
                                  <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)} type="button">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-5 w-5 flex-shrink-0" /> 
                                    <span className="whitespace-nowrap">Facebook</span>
                                  </button>
                                  <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`)} type="button">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" className="h-5 w-5 flex-shrink-0" /> 
                                    <span className="whitespace-nowrap">Telegram</span>
                                  </button>
                                  <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`)} type="button">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" alt="Twitter/X" className="h-5 w-5 flex-shrink-0" /> 
                                    <span className="whitespace-nowrap">X (Twitter)</span>
                                  </button>
                                  <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-gray-700 font-semibold text-sm cursor-pointer border-0 outline-none w-full text-left transition-colors" onClick={() => window.open(`mailto:?subject=Order%20Tracking&body=${encodeURIComponent(window.location.href)}`)} type="button">
                                    <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6" /></svg>
                                    <span className="whitespace-nowrap">Email</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
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
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('connectWithLeading')}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Ship Packages */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('shipPackages')}</h3>
            <p className="text-gray-600 mb-4">{t('createShipments')}</p>
            <Link
              href="/ship"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('startShipping')}
            </Link>
          </div>

          {/* Track Deliveries */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('trackDeliveries')}</h3>
            <p className="text-gray-600 mb-4">{t('realTimeTracking')}</p>
            <Link
              href="/track"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {t('trackNow')}
            </Link>
          </div>

          {/* Billing & Payments */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('billingPayments')}</h3>
            <p className="text-gray-600 mb-4">{t('manageInvoices')}</p>
            <Link
              href="/billing"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              {t('viewBilling')}
            </Link>
          </div>
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
    </div>
  )
} 