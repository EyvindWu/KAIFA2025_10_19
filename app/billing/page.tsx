'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Download,
  Eye,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter
} from 'lucide-react'
import { useTranslation } from '../utils/translations'

// Type definitions
type InvoiceStatus = 'paid' | 'pending' | 'overdue'

interface Invoice {
  id: string
  date: string
  dueDate: string
  amount: number
  status: InvoiceStatus
  description: string
}

export default function BillingPage() {
  const { t } = useTranslation()
  
  // 筛选器状态
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // 生成过去12个月的账单数据
  const generateInvoices = (): Invoice[] => {
    const invoices: Invoice[] = []
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    
    const serviceTypes = [
      'Express Delivery Services',
      'Standard Delivery Services',
      'International Shipping',
      'Same-Day Delivery',
      'Freight Services',
      'Package Handling',
      'Storage Services',
      'Premium Logistics'
    ]
    
    // 生成过去12个月的数据
    for (let i = 0; i < 12; i++) {
      const targetDate = new Date(currentYear, currentMonth - i, 1)
      const year = targetDate.getFullYear()
      const month = targetDate.getMonth()
      
      const invoiceDate = new Date(year, month, 1)
      const dueDate = new Date(year, month + 1, 10)
      const monthYear = targetDate.toLocaleString('default', { month: 'long', year: 'numeric' })
      
      // 确定状态
      let status: InvoiceStatus
      if (i === 0) {
        status = 'pending' // 当前月
      } else if (i === 1 && dueDate < now) {
        status = 'overdue' // 上个月如果过期
      } else if (i === 1) {
        status = 'pending' // 上个月未过期
      } else {
        status = 'paid' // 更早的月份
      }
      
      // 随机金额和服务类型
      const amount = Math.floor(Math.random() * 400) + 50 + Math.random() * 0.99
      const serviceType = serviceTypes[i % serviceTypes.length]
      
      invoices.push({
        id: `INV-${year}-${String(month + 1).padStart(2, '0')}`,
        date: invoiceDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        amount: Math.round(amount * 100) / 100,
        status,
        description: `${serviceType} - ${monthYear}`
      })
    }
    
    return invoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const allInvoices = useMemo(() => generateInvoices(), [])
  
  // 筛选后的账单
  const filteredInvoices = useMemo(() => {
    return allInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date)
      const invoiceYear = invoiceDate.getFullYear().toString()
      
      if (selectedYear !== 'all' && invoiceYear !== selectedYear) return false
      if (selectedStatus !== 'all' && invoice.status !== selectedStatus) return false
      
      return true
    })
  }, [allInvoices, selectedYear, selectedStatus])
  
  // 计算账单总额
  const yearlyTotal = useMemo(() => {
    if (selectedYear === 'all') {
      // 全部年份时，返回所有订单的总金额
      return allInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
    }
    
    // 特定年份时，返回该年份的总金额
    return allInvoices
      .filter(invoice => {
        const invoiceYear = new Date(invoice.date).getFullYear().toString()
        return invoiceYear === selectedYear
      })
      .reduce((sum, invoice) => sum + invoice.amount, 0)
  }, [allInvoices, selectedYear])
  
  // 获取可用的年份
  const availableYears = useMemo(() => {
    const years = new Set(allInvoices.map(inv => new Date(inv.date).getFullYear().toString()))
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
  }, [allInvoices])

  // 工具函数
  const getStatusColor = (status: InvoiceStatus): string => {
    const statusColors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800'
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: InvoiceStatus) => {
    const statusIcons = {
      paid: <CheckCircle className="h-4 w-4" />,
      pending: <Clock className="h-4 w-4" />,
      overdue: <AlertCircle className="h-4 w-4" />
    }
    return statusIcons[status] || <Clock className="h-4 w-4" />
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleViewInvoice = (invoiceId: string) => {
    console.log('View invoice:', invoiceId)
    // TODO: 实现查看发票详情功能
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Download invoice:', invoiceId)
    // TODO: 实现下载发票功能
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5 mr-2" />
                {t('backToDashboard')}
            </Link>
              <h1 className="ml-6 text-xl font-semibold text-gray-900">{t('billingAndInvoices')}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">{t('filters')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('year')}
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">{t('allYears')}</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
          </div>

                {/* Status Filter */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('status')}
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">{t('allStatuses')}</option>
                    <option value="paid">{t('paid')}</option>
                    <option value="pending">{t('pending')}</option>
                    <option value="overdue">{t('overdue')}</option>
                  </select>
                </div>
              </div>
              
              {/* Reset Button */}
              {(selectedYear !== 'all' || selectedStatus !== 'all') && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setSelectedYear('all')
                      setSelectedStatus('all')
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {t('resetFilters')}
                  </button>
                </div>
              )}
            </div>

            {/* Yearly Total Summary */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg rounded-lg p-6">
              <div className="flex items-center justify-between">
              <div>
                  <h3 className="text-white text-sm font-medium opacity-90">
                    {selectedYear === 'all' ? '全部订单总金额' : `${selectedYear} 年度账单总额`}
                  </h3>
                  <p className="text-white text-3xl font-bold mt-2">
                    {formatCurrency(yearlyTotal)}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                <p className="text-white text-sm opacity-90">
                  {selectedYear === 'all' 
                    ? '基于全部订单的账单计算' 
                    : `基于 ${selectedYear} 年的所有账单计算`
                  }
                </p>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{t('recentInvoices')}</h3>
                  <span className="text-sm text-gray-500">
                    {filteredInvoices.length} {t('invoices')}
                  </span>
          </div>
                {filteredInvoices.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noInvoices')}</h3>
                    <p className="mt-1 text-sm text-gray-500">{t('noInvoicesDescription')}</p>
          </div>
                ) : (
            <div className="space-y-4">
                    {filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          <span>{t(invoice.status)}</span>
              </div>
              <div>
                          <p className="text-sm font-medium text-gray-900">{invoice.id}</p>
                          <p className="text-sm text-gray-500">{invoice.description}</p>
              </div>
            </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
                          <p className="text-sm text-gray-500">{t('due')}: {formatDate(invoice.dueDate)}</p>
                        </div>
                        <div className="flex space-x-2">
              <button
                            onClick={() => handleViewInvoice(invoice.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t('viewInvoice')}
              >
                            <Eye className="h-5 w-5" />
              </button>
                          <button 
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t('downloadInvoice')}
                          >
                            <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
                    </div>
                  ))}
        </div>
      )}
              </div>
            </div>
          </div>
      </main>
    </div>
  )
} 