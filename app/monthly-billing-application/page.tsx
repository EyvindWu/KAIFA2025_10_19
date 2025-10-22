'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../utils/translations'
import { 
  ArrowLeft,
  Building,
  FileText,
  Phone,
  MapPin,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

interface MonthlyBillingRequest {
  id: number
  companyName: string
  vatNumber: string
  phone: string
  address: string
  contactName: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
}

export default function MonthlyBillingApplicationPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState({
    companyName: '',
    vatNumber: '',
    phone: '',
    address: '',
    contactName: ''
  })
  
  const [existingRequest, setExistingRequest] = useState<MonthlyBillingRequest | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // 检查权限
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, user, isLoading, router])

  // 检查是否已有申请
  useEffect(() => {
    if (user?.email) {
      // 为Tony Leung预设月结申请历史（已通过）
      if (user.email === 'tony.leung@example.com') {
        const tonyRequest = {
          id: 1234567890,
          name: 'Tony Leung Trading Co.',
          piva: 'DE123456789',
          phone: '+49 30 12345678',
          email: 'tony.leung@example.com',
          status: 'approved',
          createdAt: '2025-01-15 10:30:00',
          approvedAt: '2025-01-15 15:45:00'
        }
        
        const requests = JSON.parse(localStorage.getItem('kaifa-monthly-requests') || '[]')
        const existingRequest = requests.find((req: any) => req.email === user.email)
        
        if (!existingRequest) {
          requests.push(tonyRequest)
          localStorage.setItem('kaifa-monthly-requests', JSON.stringify(requests))
        }
      }
      
      // 为Andy Liu预设月结申请历史（待审核）
      if (user.email === 'andy.liu@example.com') {
        const andyRequest = {
          id: 1234567891,
          name: 'Andy Liu Import Export',
          piva: 'DE987654321',
          phone: '+49 40 87654321',
          email: 'andy.liu@example.com',
          status: 'pending',
          createdAt: '2025-01-20 14:20:00'
        }
        
        const requests = JSON.parse(localStorage.getItem('kaifa-monthly-requests') || '[]')
        const existingRequestIndex = requests.findIndex((req: any) => req.email === user.email)
        
        if (existingRequestIndex === -1) {
          // 不存在则添加
          requests.push(andyRequest)
        } else {
          // 存在则重置为待审核状态
          requests[existingRequestIndex] = {
            ...andyRequest,
            id: requests[existingRequestIndex].id
          }
        }
        localStorage.setItem('kaifa-monthly-requests', JSON.stringify(requests))
      }
      
      // 添加额外的待审核申请（Lisa Chen）
      const allRequests = JSON.parse(localStorage.getItem('kaifa-monthly-requests') || '[]')
      const lisaRequest = {
        id: 1234567892,
        name: 'Chen Global Logistics',
        piva: 'DE456789123',
        phone: '+49 89 98765432',
        email: 'lisa.chen@example.com',
        status: 'pending',
        createdAt: '2025-01-22 09:15:00'
      }
      
      const existingLisaRequest = allRequests.find((req: any) => req.id === 1234567892)
      if (!existingLisaRequest) {
        allRequests.push(lisaRequest)
        localStorage.setItem('kaifa-monthly-requests', JSON.stringify(allRequests))
      }
      
      const requests = JSON.parse(localStorage.getItem('kaifa-monthly-requests') || '[]')
      const userRequest = requests.find((req: MonthlyBillingRequest) => req.email === user.email)
      if (userRequest) {
        setExistingRequest(userRequest)
        // 如果已有申请，填充表单数据
        setFormData({
          companyName: userRequest.companyName,
          vatNumber: userRequest.vatNumber,
          phone: userRequest.phone,
          address: userRequest.address,
          contactName: userRequest.contactName
        })
      }
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = '企业名称不能为空'
    }
    
    if (!formData.vatNumber.trim()) {
      newErrors.vatNumber = '企业税号不能为空'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '联系手机号不能为空'
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = '手机号格式不正确'
    }
    
    if (!formData.address.trim()) {
      newErrors.address = '企业地址不能为空'
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = '联系人姓名不能为空'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const monthlyRequest: MonthlyBillingRequest = {
        id: Date.now(),
        ...formData,
        email: user?.email || '',
        status: 'pending',
        submittedAt: new Date().toISOString()
      }
      
      const requests = JSON.parse(localStorage.getItem('kaifa-monthly-requests') || '[]')
      
      // 如果已有申请，更新现有申请
      const existingIndex = requests.findIndex((req: MonthlyBillingRequest) => req.email === user?.email)
      if (existingIndex >= 0) {
        requests[existingIndex] = { ...requests[existingIndex], ...monthlyRequest }
      } else {
        requests.push(monthlyRequest)
      }
      
      localStorage.setItem('kaifa-monthly-requests', JSON.stringify(requests))
      setExistingRequest(monthlyRequest)
      setSubmitSuccess(true)
      
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error('提交申请失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-5 w-5 text-yellow-600" />,
          text: '审核中',
          description: '您的申请正在审核中，通常需要2-3个工作日',
          color: 'text-yellow-600 bg-yellow-100'
        }
      case 'approved':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          text: '已通过',
          description: '恭喜！您的月结权限已开通，现在可以使用月结支付',
          color: 'text-green-600 bg-green-100'
        }
      case 'rejected':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          text: '未通过',
          description: '很抱歉，您的申请未通过审核，请检查信息后重新申请',
          color: 'text-red-600 bg-red-100'
        }
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-600" />,
          text: '未知状态',
          description: '',
          color: 'text-gray-600 bg-gray-100'
        }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center">
            <Link href="/profile" className="flex items-center text-blue-600 hover:underline mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              返回个人资料
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">企业月结申请</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 成功消息 */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">申请提交成功！我们将在2-3个工作日内完成审核。</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 申请表单 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {existingRequest ? '更新申请信息' : '填写企业信息'}
                </h2>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        企业名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.companyName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="请输入企业全称"
                      />
                      {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        企业税号 (VAT/P.IVA) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.vatNumber}
                        onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.vatNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="请输入企业税号"
                      />
                      {errors.vatNumber && <p className="mt-1 text-sm text-red-600">{errors.vatNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        联系手机号 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="请输入联系手机号"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        企业联系人姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.contactName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="请输入联系人姓名"
                      />
                      {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        企业注册地址 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="请输入完整的企业注册地址"
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? '提交中...' : (existingRequest ? '更新申请' : '提交申请')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 申请状态 */}
            {existingRequest && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">申请状态</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {getStatusInfo(existingRequest.status).icon}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(existingRequest.status).color}`}>
                      {getStatusInfo(existingRequest.status).text}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {getStatusInfo(existingRequest.status).description}
                  </p>
                  <div className="text-xs text-gray-500">
                    申请时间：{new Date(existingRequest.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            {/* 月结说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                月结服务说明
              </h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <strong>适用对象：</strong>企业客户
                </div>
                <div>
                  <strong>结算周期：</strong>每月月底统一结算
                </div>
                <div>
                  <strong>审核时间：</strong>2-3个工作日
                </div>
                <div>
                  <strong>优势：</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    <li>无需每次支付，提高效率</li>
                    <li>统一账单，便于财务管理</li>
                    <li>享受企业级服务</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 联系客服 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">需要帮助？</h3>
              <p className="text-sm text-gray-600 mb-4">
                如果您在申请过程中遇到任何问题，请联系我们的客服团队。
              </p>
              <Link
                href="/support"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                联系客服 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 