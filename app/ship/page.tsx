'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Package,
  User,
  MapPin,
  Truck,
  CreditCard,
  Calendar,
  Clock,
  Shield,
  CheckCircle,
  BookOpen,
  Trash2,
  Settings,
  AlertCircle,
  Info
} from 'lucide-react'
import AddressBookIcon from '../components/icons/AddressBookIcon'
import DeleteIcon from '../components/icons/DeleteIcon'
import dynamic from 'next/dynamic'
import { useTranslation } from '../utils/translations'
import { SystemModal } from '../components/ClientProviders';
import AddressBook from '../components/AddressBook/AddressBook';
import { useAuth } from '../context/AuthContext'
// 移除方案3相关import
// import ReactContactListDemo from '../components/AddressBook/ReactContactListDemo';

const SenderIcon = dynamic(() => import('../components/icons/SenderIcon'), { ssr: false })

// 生成50个A-Z联系人
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const addressList = Array.from({ length: 50 }, (_, i) => {
  const letter = alphabet[i % alphabet.length];
  return {
    addressType: "residential",
    receiverName: `${letter}erson${i + 1}`,
    addressId: `${i + 1}`,
    postalCode: `1000${i}`,
    city: "Sample City",
    state: "SC",
    country: "CHN",
    street: `${letter} Street`,
    number: `${i + 1}`,
    neighborhood: "Sample Neighborhood",
    complement: "",
    reference: null,
    geoCoordinates: [],
    selected: false
  };
});

// 生成50条A-Z演示联系人数据
const demoAddressList = Array.from({ length: 50 }, (_, i) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const letter = alphabet[i % alphabet.length];
  return {
    addressType: 'residential',
    receiverName: `${letter}erson${i + 1}`,
    addressId: `${i + 1}`,
    phone: `1380000${(100 + i).toString().slice(-3)}`,
    email: `${letter.toLowerCase()}erson${i + 1}@demo.com`,
    city: 'Sample City',
    country: 'China',
    street: `${letter} Street`,
  };
});

export default function ShipPage() {
  const { t, currentLanguage } = useTranslation()
  const { user, isAuthenticated, isLoading, updateUser } = useAuth()
  
  // 用户权限状态
  const isLoggedIn = isAuthenticated && user
  const hasMonthlyBilling = isLoggedIn && user?.monthlyBillingAuthorized
  const canCreateOrder = isLoggedIn // 已登录用户才能下单
  const canUseAddressBook = isLoggedIn // 已登录用户才能使用地址簿
  const canApplyMonthlyBilling = isLoggedIn && !hasMonthlyBilling // 已登录但未授权月结的用户才能申请
  
  // ===== 用户权限控制说明 =====
  /*
  根据用户角色实现的功能权限控制：
  
  1. 未登录用户：
     - ✅ 查看运费/时效报价
     - ✅ 地址验证功能
     - ❌ 创建发货订单（显示登录提示）
     - ❌ 使用地址簿功能
     - ❌ 提交企业认证
  
  2. 已登录用户（未授权月结）：
     - ✅ 查看运费/时效报价
     - ✅ 地址验证功能
     - ✅ 创建发货订单（仅限微信支付）
     - ✅ 使用地址簿功能
     - ✅ 提交企业认证
  
  3. 已登录用户（已授权月结）：
     - ✅ 查看运费/时效报价
     - ✅ 地址验证功能
     - ✅ 创建发货订单（微信支付或月结）
     - ✅ 使用地址簿功能
     - ❌ 提交企业认证（已有权限）
  
  权限控制实现：
  - 地址簿按钮：未登录时禁用并显示提示
  - 保存地址选项：未登录时禁用
  - 支付方式：根据月结权限显示/隐藏选项
  - 提交按钮：未登录时禁用并显示"请先登录"
  - 月结申请：仅对符合条件的用户显示
  */
  
  // ===== 智能实时地址验证功能说明 =====
  /*
  地址验证功能实现说明（实时验证模式）：
  
  1. 验证策略：
     - 实时验证：用户输入时自动触发API验证
     - 智能补全：提供地址建议和自动填充
     - 字段联动：邮编→城市→区域自动关联
     - 错误提示：实时显示格式和匹配错误
  
  2. 触发时机：
     - 邮编输入完成后（3位以上）
     - 街道名称输入完成后（5个字符以上）
     - 城市名称输入完成后（2个字符以上）
     - 防抖处理：停止输入后延迟500ms触发
  
  3. 验证流程：
     - 本地格式验证（邮编格式、必填字段）
     - API地址验证（UPS/FedEx/TNT API）
     - 智能建议生成（相似地址列表）
     - 字段自动补全（城市、区域信息）
  
  4. 用户体验：
     - 实时反馈：输入框下方显示验证状态
     - 智能建议：下拉列表显示匹配地址
     - 一键填充：点击建议自动完成表单
     - 错误引导：明确提示错误原因和修正建议
  
  5. API集成：
     - UPS Address Validation API
     - Google Maps Geocoding API
     - 本地地址数据库
     - 多API结果合并和优先级处理
  
  6. 错误处理：
     - 网络超时：显示重试选项
     - 地址模糊：提供多个选择
     - 格式错误：实时提示修正
     - 服务异常：降级到本地验证
  
  7. 性能优化：
     - 防抖处理：避免频繁API调用
     - 缓存机制：相同地址缓存结果
     - 异步处理：不阻塞用户输入
     - 加载状态：显示验证进度
  
  8. 实现步骤：
     - 配置地址验证API密钥
     - 实现防抖和缓存逻辑
     - 添加实时验证UI组件
     - 集成字段联动功能
     - 测试各种验证场景
  */
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Sender info
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    senderCity: '',
    senderPostalCode: '',
    senderCountry: '',
    
    // Recipient info
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientCity: '',
    recipientPostalCode: '',
    recipientCountry: '',
    
    // Package info
    packages: [{
      packageType: 'package', weight: '', length: '', width: '', height: '', description: '', serviceType: 'standard', insurance: false,
      fragile: false
    }],
    
    // Service options
    paymentMethod: 'wechat_pay',
    
    // 新增KFCode和addressBook
    kfCode: '', addressBook: '',
    // 新增延时取货
    delayedPickup: false
  })
  const [activePackageIdx, setActivePackageIdx] = useState(0)
  const [useDefaultSender, setUseDefaultSender] = useState(false)
  const [useAddressBook, setUseAddressBook] = useState(false)
  const [useSenderAddressBook, setUseSenderAddressBook] = useState(false)
  const [senderAddressBookInput, setSenderAddressBookInput] = useState('')
  const [showSenderContactDropdown, setShowSenderContactDropdown] = useState(false)
  const senderContactInputRef = useRef<HTMLInputElement>(null)

  // 新增：弹窗控制
  const [showSenderAddressBook, setShowSenderAddressBook] = useState(false);
  const [showRecipientAddressBook, setShowRecipientAddressBook] = useState(false);

  const contactList = [
    { key: 'alice', label: t('contactAliceBerlin') },
    { key: 'bob', label: t('contactBobMunich') },
    { key: 'charlie', label: t('contactCharlieParis') }
  ];

  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const contactInputRef = useRef<HTMLInputElement>(null);

  // 用户特定的地址簿数据
  const getUserAddressBook = () => {
    if (!isLoggedIn) return [];
    
    if (user?.email === 'tony.leung@example.com') {
      // Tony Leung的地址簿（月结用户）
      return [
        {
          name: 'Sarah Chen',
          email: 'sarah.chen@email.com',
          phone: '+49 100000031',
          address: 'Sarah Avenue 31',
          city: 'Munich',
          postalCode: '80331',
          country: 'Germany'
        },
        {
          name: 'David Wong',
          email: 'david.wong@email.com',
          phone: '+49 100000032',
          address: 'David Road 32',
          city: 'Hamburg',
          postalCode: '20095',
          country: 'Germany'
        },
        {
          name: 'Lisa Zhang',
          email: 'lisa.zhang@email.com',
          phone: '+49 100000033',
          address: 'Lisa Lane 33',
          city: 'Frankfurt',
          postalCode: '60311',
          country: 'Germany'
        },
        {
          name: 'Michael Brown',
          email: 'michael.brown@email.com',
          phone: '+49 100000034',
          address: 'Michael Street 34',
          city: 'Stuttgart',
          postalCode: '70173',
          country: 'Germany'
        }
      ];
    } else {
      // Andy Liu的地址簿（普通用户）
      return [
    {
      name: t('aliceSmith'),
      email: 'alice.smith@email.com',
      phone: '+49 111222333',
      address: t('aliceweg10'),
      city: t('hamburg'),
      postalCode: '20095',
      country: t('germany')
    },
    {
      name: t('bobLee'),
      email: 'bob.lee@email.com',
      phone: '+49 444555666',
      address: t('bobstrasse22'),
      city: t('frankfurt'),
      postalCode: '60311',
      country: t('germany')
    },
    {
      name: t('carolWang'),
      email: 'carol.wang@email.com',
      phone: '+49 777888999',
      address: t('carolplatz5'),
      city: t('stuttgart'),
      postalCode: '70173',
      country: t('germany')
    }
  ];
    }
  };

  const senderAddressBook = getUserAddressBook();

  const [selectedSenderIndex, setSelectedSenderIndex] = useState(-1);
  const [saveToAddressBook, setSaveToAddressBook] = useState(false);
  const [showKfTooltip, setShowKfTooltip] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showMonthlyBillingModal, setShowMonthlyBillingModal] = useState(false);
  const [showAddressValidationInfo, setShowAddressValidationInfo] = useState(false);

  // 检查用户月结权限
  const [monthlyBillingAuthorized, setMonthlyBillingAuthorized] = useState(false);
  
  // 模拟检查用户月结权限
  React.useEffect(() => {
    // 从localStorage检查月结申请状态
    const monthlyRequests = JSON.parse(localStorage.getItem('kaifa-monthly-requests') || '[]');
    const userEmail = 'user@example.com'; // 这里应该从用户上下文获取
    const userRequest = monthlyRequests.find((req: any) => req.email === userEmail);
    
    if (userRequest && userRequest.status === 'approved') {
      setMonthlyBillingAuthorized(true);
      // 如果用户有月结权限，默认选择月结支付
      setFormData(prev => ({ ...prev, paymentMethod: 'monthly_billing' }));
    }
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // ===== 地址验证功能说明 =====
  // 以下注释说明了地址验证功能在API接入后应该如何实现和展示
  
  // 1. 实时地址验证API调用函数
  // const validateAddress = async (addressData: {
  //   street: string,
  //   city: string,
  //   postalCode: string,
  //   country: string
  // }) => {
  //   try {
  //     // 多API验证，提高准确性
  //     const [upsResult, googleResult] = await Promise.allSettled([
  //       fetch('/api/ups-validate', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(addressData)
  //       }),
  //       fetch('/api/google-geocode', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(addressData)
  //       })
  //     ])
  //     
  //     // 合并和优先级处理结果
  //     const result = mergeValidationResults(upsResult, googleResult)
  //     return result
  //   } catch (error) {
  //     console.error('地址验证失败:', error)
  //     return { isValid: false, suggestions: [], message: '验证服务暂时不可用' }
  //   }
  // }

  // 2. 实时地址验证状态管理
  // const [addressValidation, setAddressValidation] = useState({
  //   sender: { isValid: null, suggestions: [], message: '', isChecking: false, autoFilled: false },
  //   recipient: { isValid: null, suggestions: [], message: '', isChecking: false, autoFilled: false }
  // })
  //
  // // 防抖处理，避免频繁API调用
  // const debouncedValidation = useMemo(
  //   () => debounce(async (type: 'sender' | 'recipient', addressData: any) => {
  //     if (addressData.postalCode.length < 3) return
  //     
  //     setAddressValidation(prev => ({
  //       ...prev,
  //       [type]: { ...prev[type], isChecking: true }
  //     }))
  //
  //     const result = await validateAddress(addressData)
  //
  //     setAddressValidation(prev => ({
  //       ...prev,
  //       [type]: {
  //         isValid: result.isValid,
  //         suggestions: result.suggestions,
  //         message: result.message,
  //         isChecking: false
  //       }
  //     }))
  //
  //     // 自动填充功能
  //     if (result.isValid && result.correctedAddress && !addressValidation[type].autoFilled) {
  //       if (type === 'sender') {
  //         setFormData(prev => ({
  //           ...prev,
  //           senderAddress: result.correctedAddress.street,
  //           senderCity: result.correctedAddress.city,
  //           senderPostalCode: result.correctedAddress.postalCode
  //         }))
  //       } else {
  //         setFormData(prev => ({
  //           ...prev,
  //           recipientAddress: result.correctedAddress.street,
  //           recipientCity: result.correctedAddress.city,
  //           recipientPostalCode: result.correctedAddress.postalCode
  //         }))
  //       }
  //     }
  //   }, 500),
  //   []
  // )

  // 3. 实时地址验证触发函数
  // const handleRealTimeValidation = (type: 'sender' | 'recipient', field: string, value: string) => {
  //   const addressData = type === 'sender' ? {
  //     street: formData.senderAddress,
  //     city: formData.senderCity,
  //     postalCode: formData.senderPostalCode,
  //     country: formData.senderCountry
  //   } : {
  //     street: formData.recipientAddress,
  //     city: formData.recipientCity,
  //     postalCode: formData.recipientPostalCode,
  //     country: formData.recipientCountry
  //   }
  //
  //   // 更新表单数据
  //   handleInputChange(field, value)
  //
  //   // 触发实时验证
  //   debouncedValidation(type, addressData)
  // }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Submit order
      console.log('Submitting order:', formData)
      setShowOrderSuccess(true)
    }
  }

  const serviceTypes = [
    { id: 'standard', name: t('standardDelivery'), price: '€15.99', time: currentLanguage === 'zh' ? '3-5 工作日' : '3-5 business days' },
    { id: 'express', name: t('expressDelivery'), price: '€29.99', time: currentLanguage === 'zh' ? '1-2 工作日' : '1-2 business days' }
  ]

  const countries = [
    t('germany'), t('france'), t('italy'), t('spain'), t('netherlands'), t('belgium'), t('austria'), t('switzerland')
  ]

  // 3. Recipient Info顶部添加KF代码和通讯录
  const addressBookData: { [key: string]: { recipientName: string; recipientEmail: string; recipientPhone: string; recipientAddress: string; recipientCity: string; recipientPostalCode: string; recipientCountry: string } } = {
    alice: { recipientName: 'Alice', recipientEmail: 'alice@email.com', recipientPhone: '+49 111111', recipientAddress: 'Alice St 2', recipientCity: 'Berlin', recipientPostalCode: '10115', recipientCountry: t('germany') },
    bob: { recipientName: 'Bob', recipientEmail: 'bob@email.com', recipientPhone: '+49 222222', recipientAddress: 'Bob Ave 3', recipientCity: 'Munich', recipientPostalCode: '80331', recipientCountry: t('germany') },
    charlie: { recipientName: 'Charlie', recipientEmail: 'charlie@email.com', recipientPhone: '+33 333333', recipientAddress: 'Charlie Rd 5', recipientCity: 'Paris', recipientPostalCode: '75001', recipientCountry: t('france') }
  }

  const handleContactSelect = (key: string) => {
    setFormData(prev => ({ ...prev, addressBook: key, ...addressBookData[key] }));
    setShowContactDropdown(false);
    // 失去焦点
    contactInputRef.current?.blur();
  };

  // 1. 伪造50个A-Z联系人
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const fakeContacts = Array.from({ length: 50 }, (_, i) => {
    const letter = alphabet[i % alphabet.length];
    return { name: `${letter}erson${i + 1}` };
  });
  const contactsByLetter = alphabet.map(letter => ({
    letter,
    contacts: fakeContacts.filter(c => c.name[0] === letter)
  }));

  // 地址簿弹窗外部点击关闭
  React.useEffect(() => {
    if (!showContactDropdown) return;
    function handleClickOutside(e: MouseEvent) {
      if (contactInputRef.current && !contactInputRef.current.contains(e.target as Node)) {
        setShowContactDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showContactDropdown]);

  // 监听通讯录弹窗滚动，动态高亮右侧字母索引
  React.useEffect(() => {
    if (!showContactDropdown) return;
    const input = contactInputRef.current as HTMLInputElement | null;
    if (!input) return;
    function onScroll() {
      if (!input) return;
      const scrollTop = input.scrollTop;
      let current = 'A';
      for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const el = document.getElementById(`letter-${letter}`);
        if (el) {
          if (el.offsetTop - input.offsetTop <= scrollTop + 10) {
            current = letter;
          } else {
            break;
          }
        }
      }
      // setActiveLetter(current); // This state is removed
    }
    input.addEventListener('scroll', onScroll);
    return () => {
      const cleanupInput = contactInputRef.current as HTMLInputElement | null;
      if (cleanupInput) cleanupInput.removeEventListener('scroll', onScroll);
    };
  }, [showContactDropdown, alphabet]);

  // 点击外部关闭地址验证说明气泡
  React.useEffect(() => {
    if (!showAddressValidationInfo) return;
    
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Element;
      if (!target.closest('.address-validation-info')) {
        setShowAddressValidationInfo(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAddressValidationInfo]);

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{t('senderInfo')}</h2>
      </div>
      {/* 删除原有的姓名输入栏和地址簿按钮行 */}
      {/* 在下方表单的“姓名”输入框右侧嵌入地址簿按钮 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
          <div className="flex">
            <input
              type="text"
              value={formData.senderName}
              onChange={(e) => handleInputChange('senderName', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {canUseAddressBook ? (
            <AddressBook
              addressList={addressList}
              onSelect={(contact: any) => {
                setFormData(prev => ({ ...prev, senderName: contact.receiverName }));
              }}
              trigger={
                <button
                  type="button"
                  className="border border-l-0 border-gray-300 rounded-r-md bg-white hover:bg-gray-100 flex items-center justify-center w-10"
                  tabIndex={0}
                  aria-label={t('addressBook')}
                  style={{boxShadow: 'none'}}
                >
                  <AddressBookIcon className="h-7 w-7" />
                </button>
              }
            />
            ) : (
              <button
                type="button"
                className="border border-l-0 border-gray-300 rounded-r-md bg-gray-100 flex items-center justify-center w-10 cursor-not-allowed"
                title="需要登录才能使用地址簿"
                disabled
              >
                <AddressBookIcon className="h-7 w-7 text-gray-400" />
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
          <input
            type="email"
            value={formData.senderEmail}
            onChange={(e) => handleInputChange('senderEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
          <input
            type="tel"
            value={formData.senderPhone}
            onChange={(e) => handleInputChange('senderPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('country')}</label>
          <select
            value={formData.senderCountry}
            onChange={(e) => handleInputChange('senderCountry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('selectCountry')}</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            {t('address')}
            <button
              type="button"
              onClick={() => setShowAddressValidationInfo(!showAddressValidationInfo)}
              className="ml-2 w-5 h-5 bg-orange-500 text-white rounded-full text-xs font-bold hover:bg-orange-600 transition-colors flex items-center justify-center shadow-md"
              title="地址验证功能说明"
            >
              !
            </button>
          </label>
          <div className="relative">
          <input
            type="text"
            value={formData.senderAddress}
            onChange={(e) => handleInputChange('senderAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            
            {/* 地址验证功能说明气泡 */}
            {showAddressValidationInfo && (
              <div className="address-validation-info absolute left-0 top-full mt-2 w-80 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg p-4 shadow-lg z-30">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-blue-900 mb-2">智能地址验证</h4>
                  <button
                    onClick={() => setShowAddressValidationInfo(false)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <p><strong>实时验证：</strong>输入时自动验证地址有效性</p>
                  <p><strong>智能补全：</strong>提供地址建议和自动填充</p>
                  <p><strong>字段联动：</strong>邮编→城市→区域自动关联</p>
                  <p><strong>错误提示：</strong>实时显示格式和匹配错误</p>
                  <p><strong>API集成：</strong>UPS/FedEx/TNT地址验证API</p>
                  <p className="text-blue-600 font-medium">提升用户体验，减少错误输入</p>
                </div>
              </div>
            )}
            
            {/* ===== 实时地址验证UI - API接入后取消注释 ===== */}
            {/*
            // 实时验证状态显示
            {addressValidation.sender.isChecking && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center text-blue-600 text-xs">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                验证中...
              </div>
            )}
            
            // 实时验证结果显示
            {addressValidation.sender.isValid === true && !addressValidation.sender.isChecking && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  地址验证通过
                </div>
              </div>
            )}
            
            {addressValidation.sender.isValid === false && !addressValidation.sender.isChecking && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {addressValidation.sender.message}
                </div>
                
                // 智能建议地址列表
                {addressValidation.sender.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">智能建议：</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {addressValidation.sender.suggestions.map((suggestion: any, index: number) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              senderAddress: suggestion.street,
                              senderCity: suggestion.city,
                              senderPostalCode: suggestion.postalCode
                            }))
                            // 标记已自动填充
                            setAddressValidation(prev => ({
                              ...prev,
                              sender: { ...prev.sender, autoFilled: true }
                            }))
                          }}
                          className="block w-full text-left p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-sm transition-colors"
                        >
                          <div className="font-medium">{suggestion.street}</div>
                          <div className="text-gray-600">{suggestion.city} {suggestion.postalCode}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            // 字段联动提示
            {addressValidation.sender.autoFilled && (
              <div className="mt-1 text-xs text-green-600">
                ✓ 已自动填充相关字段
              </div>
            )}
            */}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}</label>
          <input
            type="text"
            value={formData.senderCity}
            onChange={(e) => handleInputChange('senderCity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                {t('postalCode')}
                <button
                  type="button"
                  onClick={() => setShowAddressValidationInfo(!showAddressValidationInfo)}
                  className="ml-2 w-5 h-5 bg-orange-500 text-white rounded-full text-xs font-bold hover:bg-orange-600 transition-colors flex items-center justify-center shadow-md"
                  title="邮编字段联动功能"
                >
                  !
                </button>
              </label>
            <input
              type="text"
              value={formData.senderPostalCode}
              onChange={(e) => handleInputChange('senderPostalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* 邮编字段联动说明气泡 */}
            {showAddressValidationInfo && (
              <div className="address-validation-info absolute left-0 top-full mt-2 w-80 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg p-4 shadow-lg z-30">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-green-900 mb-2">邮编字段联动</h4>
                  <button
                    onClick={() => setShowAddressValidationInfo(false)}
                    className="text-green-500 hover:text-green-700"
                  >
                    ×
                  </button>
          </div>
                <div className="space-y-2 text-xs">
                  <p><strong>自动补全：</strong>输入邮编后自动填充城市和区域</p>
                  <p><strong>格式验证：</strong>实时检查邮编格式是否正确</p>
                  <p><strong>地址匹配：</strong>验证邮编与城市是否匹配</p>
                  <p><strong>智能建议：</strong>提供相似邮编和对应地址</p>
                  <p className="text-green-600 font-medium">减少手动输入，提高准确性</p>
                </div>
              </div>
            )}
          </div>
          {canUseAddressBook ? (
          <label className="flex items-center ml-2 mt-6">
            <input
              type="checkbox"
              checked={saveToAddressBook}
              onChange={e => setSaveToAddressBook(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-black">{t('saveToAddressBook')}</span>
          </label>
          ) : (
            <label className="flex items-center ml-2 mt-6 cursor-not-allowed">
              <input
                type="checkbox"
                disabled
                className="h-4 w-4 text-gray-400"
              />
              <span className="ml-2 text-sm text-gray-500">{t('saveToAddressBook')} (需要登录)</span>
            </label>
          )}
        </div>
      </div>
      {/* 地址簿弹窗：发件人 */}
      {showSenderAddressBook && (
        <AddressBook
          addressList={addressList}
          onSelect={(contact: any) => {
            setFormData(prev => ({ ...prev, senderName: contact.receiverName }));
            setShowSenderAddressBook(false);
          }}
          trigger={null}
        />
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{t('recipientInfo')}</h2>
      </div>
      <div className="mb-2 flex gap-4 relative items-center">
        <input type="text" placeholder={t('enterKFCode')} value={formData.kfCode} onChange={e => setFormData(prev => ({ ...prev, kfCode: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded-md" />
        <button
          type="button"
          className="ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={() => setShowKfTooltip(v => !v)}
          tabIndex={0}
          aria-label="KF代码说明"
        >
          <span className="font-bold text-lg">?</span>
        </button>
        {showKfTooltip && (
          <div className="absolute left-0 top-full mt-2 w-max max-w-xs bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded p-3 shadow-lg z-30"
            style={{minWidth: '220px'}}>
            KF代码是由系统根据你填写的信息自动生成的唯一编号。它可以保存并快速填充收/发件人信息，方便下次使用。
            <button className="absolute top-1 right-2 text-yellow-500 hover:text-yellow-700" onClick={() => setShowKfTooltip(false)} aria-label="关闭">×</button>
          </div>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
          <div className="flex">
            <input
              type="text"
              value={formData.recipientName}
              onChange={(e) => handleInputChange('recipientName', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {canUseAddressBook ? (
            <AddressBook
              addressList={addressList}
              onSelect={(contact: any) => {
                setFormData(prev => ({ ...prev, recipientName: contact.receiverName }));
              }}
              trigger={
                <button
                  type="button"
                  className="border border-l-0 border-gray-300 rounded-r-md bg-white hover:bg-gray-100 flex items-center justify-center w-10"
                  tabIndex={0}
                  aria-label={t('addressBook')}
                  style={{boxShadow: 'none'}}
                >
                  <AddressBookIcon className="h-7 w-7" />
                </button>
              }
            />
            ) : (
              <button
                type="button"
                className="border border-l-0 border-gray-300 rounded-r-md bg-gray-100 flex items-center justify-center w-10 cursor-not-allowed"
                title="需要登录才能使用地址簿"
                disabled
              >
                <AddressBookIcon className="h-7 w-7 text-gray-400" />
              </button>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
          <input
            type="email"
            value={formData.recipientEmail}
            onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
          <input
            type="tel"
            value={formData.recipientPhone}
            onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('country')}</label>
          <select
            value={formData.recipientCountry}
            onChange={(e) => handleInputChange('recipientCountry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('selectCountry')}</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            {t('address')}
            <button
              type="button"
              onClick={() => setShowAddressValidationInfo(!showAddressValidationInfo)}
              className="ml-2 w-5 h-5 bg-orange-500 text-white rounded-full text-xs font-bold hover:bg-orange-600 transition-colors flex items-center justify-center shadow-md"
              title="地址验证功能说明"
            >
              !
            </button>
          </label>
          <div className="relative">
          <input
            type="text"
            value={formData.recipientAddress}
            onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            
            {/* 地址验证功能说明气泡 */}
            {showAddressValidationInfo && (
              <div className="address-validation-info absolute left-0 top-full mt-2 w-80 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg p-4 shadow-lg z-30">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-blue-900 mb-2">智能地址验证</h4>
                  <button
                    onClick={() => setShowAddressValidationInfo(false)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <p><strong>实时验证：</strong>输入时自动验证地址有效性</p>
                  <p><strong>智能补全：</strong>提供地址建议和自动填充</p>
                  <p><strong>字段联动：</strong>邮编→城市→区域自动关联</p>
                  <p><strong>错误提示：</strong>实时显示格式和匹配错误</p>
                  <p><strong>API集成：</strong>UPS/FedEx/TNT地址验证API</p>
                  <p className="text-blue-600 font-medium">提升用户体验，减少错误输入</p>
                </div>
              </div>
            )}
            
            {/* ===== 收件人实时地址验证UI - API接入后取消注释 ===== */}
            {/*
            // 实时验证状态显示
            {addressValidation.recipient.isChecking && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center text-blue-600 text-xs">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                验证中...
              </div>
            )}
            
            // 实时验证结果显示
            {addressValidation.recipient.isValid === true && !addressValidation.recipient.isChecking && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  地址验证通过
                </div>
              </div>
            )}
            
            {addressValidation.recipient.isValid === false && !addressValidation.recipient.isChecking && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {addressValidation.recipient.message}
                </div>
                
                // 智能建议地址列表
                {addressValidation.recipient.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">智能建议：</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {addressValidation.recipient.suggestions.map((suggestion: any, index: number) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              recipientAddress: suggestion.street,
                              recipientCity: suggestion.city,
                              recipientPostalCode: suggestion.postalCode
                            }))
                            // 标记已自动填充
                            setAddressValidation(prev => ({
                              ...prev,
                              recipient: { ...prev.recipient, autoFilled: true }
                            }))
                          }}
                          className="block w-full text-left p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-sm transition-colors"
                        >
                          <div className="font-medium">{suggestion.street}</div>
                          <div className="text-gray-600">{suggestion.city} {suggestion.postalCode}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            // 字段联动提示
            {addressValidation.recipient.autoFilled && (
              <div className="mt-1 text-xs text-green-600">
                ✓ 已自动填充相关字段
              </div>
            )}
            */}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}</label>
          <input
            type="text"
            value={formData.recipientCity}
            onChange={(e) => handleInputChange('recipientCity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              {t('postalCode')}
              <button
                type="button"
                onClick={() => setShowAddressValidationInfo(!showAddressValidationInfo)}
                className="ml-2 w-5 h-5 bg-orange-500 text-white rounded-full text-xs font-bold hover:bg-orange-600 transition-colors flex items-center justify-center shadow-md"
                title="邮编字段联动功能"
              >
                !
              </button>
            </label>
            <input
              type="text"
              value={formData.recipientPostalCode}
              onChange={(e) => handleInputChange('recipientPostalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* 邮编字段联动说明气泡 */}
            {showAddressValidationInfo && (
              <div className="address-validation-info absolute left-0 top-full mt-2 w-80 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg p-4 shadow-lg z-30">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-green-900 mb-2">邮编字段联动</h4>
                  <button
                    onClick={() => setShowAddressValidationInfo(false)}
                    className="text-green-500 hover:text-green-700"
                  >
                    ×
                  </button>
          </div>
                <div className="space-y-2 text-xs">
                  <p><strong>自动补全：</strong>输入邮编后自动填充城市和区域</p>
                  <p><strong>格式验证：</strong>实时检查邮编格式是否正确</p>
                  <p><strong>地址匹配：</strong>验证邮编与城市是否匹配</p>
                  <p><strong>智能建议：</strong>提供相似邮编和对应地址</p>
                  <p className="text-green-600 font-medium">减少手动输入，提高准确性</p>
                </div>
              </div>
            )}
          </div>
          {canUseAddressBook ? (
          <label className="flex items-center ml-2 mt-6">
            <input
              type="checkbox"
              checked={saveToAddressBook}
              onChange={e => setSaveToAddressBook(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-black">{t('saveToAddressBook')}</span>
          </label>
          ) : (
            <label className="flex items-center ml-2 mt-6 cursor-not-allowed">
              <input
                type="checkbox"
                disabled
                className="h-4 w-4 text-gray-400"
              />
              <span className="ml-2 text-sm text-gray-500">{t('saveToAddressBook')} (需要登录)</span>
            </label>
          )}
        </div>
      </div>
      {/* 地址簿弹窗：收件人 */}
      {showRecipientAddressBook && (
        <AddressBook
          addressList={addressList}
          onSelect={(contact: any) => {
            setFormData(prev => ({ ...prev, recipientName: contact.receiverName }));
            setShowRecipientAddressBook(false);
          }}
          trigger={null}
        />
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      {formData.packages.map((pkg, idx) => (
        <div key={idx} className="mb-4">
          <div className={`flex items-center justify-between cursor-pointer rounded p-2 ${activePackageIdx === idx ? 'bg-blue-600 text-white font-bold' : 'bg-blue-600 text-white'}`} onClick={() => setActivePackageIdx(idx)}>
            <div className="flex items-center gap-2">
              {activePackageIdx === idx ? <span>▼</span> : <span>▶</span>}
              <span>{t('package')} {idx + 1}</span>
              {formData.packages.length > 1 && idx > 0 && (
                <button
                  type="button"
                  className="ml-2 text-white hover:text-red-400 flex items-center"
                  onClick={e => {
                    e.stopPropagation();
                    if (window.confirm(t('areYouSureDeletePackage'))) {
                      setFormData(prev => ({
                        ...prev,
                        packages: prev.packages.filter((_, i) => i !== idx)
                      }))
                      if (activePackageIdx === idx && idx > 0) setActivePackageIdx(idx - 1)
                    }
                  }}
                  aria-label={t('deleteThisPackage')}
                >
                  <DeleteIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          {activePackageIdx === idx && (
            <div className="space-y-4 bg-white border rounded-b p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('packageType')}</label>
                  <select value={pkg.packageType} onChange={e => {
                    const v = e.target.value
                    setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, packageType: v } : p) }))
                  }} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="package">{t('package')}</option>
                    <option value="document">{t('document')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('weight')}</label>
                  <input type="text" value={pkg.weight} onChange={e => {
                    const v = e.target.value
                    setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, weight: v } : p) }))
                  }} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('length')}</label>
                    <input type="text" value={pkg.length} onChange={e => {
                      const v = e.target.value
                      setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, length: v } : p) }))
                    }} className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('width')}</label>
                    <input type="text" value={pkg.width} onChange={e => {
                      const v = e.target.value
                      setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, width: v } : p) }))
                    }} className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('height')}</label>
                    <input type="text" value={pkg.height} onChange={e => {
                      const v = e.target.value
                      setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, height: v } : p) }))
                    }} className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={pkg.fragile || false}
                      onChange={e => {
                        const v = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          packages: prev.packages.map((p, i) =>
                            i === idx
                              ? { ...p, fragile: v }
                              : { ...p, fragile: typeof p.fragile === 'boolean' ? p.fragile : false }
                          )
                        }));
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      id={`fragile-${idx}`}
                    />
                    <label htmlFor={`fragile-${idx}`} className="ml-2 text-sm text-gray-700">{t('fragile')}</label>
                  </div>
                </div>
                {/* 新增描述栏 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
                  <input
                    type="text"
                    value={pkg.description}
                    onChange={e => {
                      const v = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        packages: prev.packages.map((p, i) => i === idx ? { ...p, description: v } : p)
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* 仅最后一个包裹显示添加包裹按钮 */}
              {idx === formData.packages.length - 1 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        packages: [
                          ...prev.packages,
                          { packageType: 'package', weight: '', length: '', width: '', height: '', description: '', serviceType: 'standard', insurance: false, fragile: false }
                        ]
                      }));
                      setActivePackageIdx(formData.packages.length); // 新包裹索引
                    }}
                  >
                    + {t('addPackage')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {/* 服务选项和添加保险统一放在底部，对所有包裹生效 */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('serviceOptions')}</h3>
        <div className="space-y-4">
          {serviceTypes.map((service) => (
            <label key={service.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer bg-blue-50">
              <input type="radio" name="serviceTypeAll" value={service.id} checked={formData.packages[0]?.serviceType === service.id} onChange={e => {
                const v = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  packages: prev.packages.map((p) => ({ ...p, serviceType: v }))
                }));
              }} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{service.name}</span>
                  <span className="text-lg font-bold text-blue-600">{service.price}</span>
                </div>
                <p className="text-sm text-gray-500">{service.time}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input type="checkbox" checked={formData.packages[0]?.insurance} onChange={e => {
                const v = e.target.checked;
                setFormData(prev => ({
                  ...prev,
                  packages: prev.packages.map((p) => ({ ...p, insurance: v }))
                }));
              }} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-700">{t('addInsuranceCoverage')}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('reviewOrder')}</h2>
    
    {/* Sender & Recipient Information */}
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sender Information */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            {t('sender')}
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">{t('name')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderName || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('email')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderEmail || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('phone')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderPhone || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('country')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderCountry || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('address')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderAddress || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('city')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderCity || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('postalCode')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderPostalCode || t('notProvided')}</span>
            </div>
          </div>
        </div>

        {/* Recipient Information */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-600" />
            {t('recipient')}
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">{t('name')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientName || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('email')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientEmail || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('phone')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientPhone || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('country')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientCountry || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('address')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientAddress || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('city')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientCity || t('notProvided')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('postalCode')}:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientPostalCode || t('notProvided')}</span>
            </div>
            {formData.kfCode && (
              <div>
                <span className="text-gray-600">{t('kfCode')}:</span>
                <span className="ml-2 font-medium text-gray-900">{formData.kfCode}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Package Information */}
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
        <Package className="h-5 w-5 mr-2 text-orange-600" />
        {t('packageInformation')} ({formData.packages.length} {t('package')}{formData.packages.length > 1 ? 's' : ''})
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formData.packages.map((pkg, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="font-medium text-gray-900 mb-3">{t('package')} {idx + 1}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">{t('type')}:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">{t(pkg.packageType) || pkg.packageType}</span>
              </div>
              <div>
                <span className="text-gray-600">{t('weight')}:</span>
                <span className="ml-2 font-medium text-gray-900">{pkg.weight || t('notProvided')} kg</span>
              </div>
              <div>
                <span className="text-gray-600">{t('length')}:</span>
                <span className="ml-2 font-medium text-gray-900">{pkg.length || t('notProvided')} cm</span>
              </div>
              <div>
                <span className="text-gray-600">{t('width')}:</span>
                <span className="ml-2 font-medium text-gray-900">{pkg.width || t('notProvided')} cm</span>
              </div>
              <div>
                <span className="text-gray-600">{t('height')}:</span>
                <span className="ml-2 font-medium text-gray-900">{pkg.height || t('notProvided')} cm</span>
              </div>
              <div>
                <span className="text-gray-600">{t('service')}:</span>
                <span className="ml-2 font-medium text-gray-900">{serviceTypes.find(s => s.id === pkg.serviceType)?.name || t('notProvided')}</span>
              </div>
              <div>
                <span className="text-gray-600">{t('insurance')}:</span>
                <span className="ml-2 font-medium text-gray-900">{pkg.insurance ? t('yes') + ' (+€5.99)' : t('no')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Payment Method Selection */}
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
        <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
        支付方式
      </h3>
      
      <div className="space-y-4">
        {/* WeChat Pay Option */}
        <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="wechat_pay"
            checked={formData.paymentMethod === 'wechat_pay'}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
            className="mr-3"
          />
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">W</span>
            </div>
        <div>
              <div className="font-medium text-gray-900">WeChat Pay</div>
              <div className="text-sm text-gray-500">微信支付</div>
        </div>
      </div>
        </label>

        {/* Monthly Billing Option */}
        <div className={`p-4 border rounded-lg ${hasMonthlyBilling ? 'border-gray-200 cursor-pointer hover:bg-gray-50' : 'border-gray-300 bg-gray-50 cursor-not-allowed'}`}>
          <label className={`flex items-center ${hasMonthlyBilling ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="monthly_billing"
              checked={formData.paymentMethod === 'monthly_billing'}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              disabled={!hasMonthlyBilling}
              className="mr-3"
            />
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${hasMonthlyBilling ? 'bg-blue-500' : 'bg-gray-400'}`}>
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className={`font-medium ${hasMonthlyBilling ? 'text-gray-900' : 'text-gray-500'}`}>
                  月结支付
                  {hasMonthlyBilling && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">已授权</span>}
                </div>
                <div className="text-sm text-gray-500">
                  {monthlyBillingAuthorized ? '企业月结，月底统一结算' : '仅对企业客户开放'}
                </div>
              </div>
            </div>
          </label>
          
          {canApplyMonthlyBilling && (
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                请先提交企业认证，审核通过后方可使用
              </div>
              <button
                type="button"
                onClick={() => setShowMonthlyBillingModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                提交企业认证 →
              </button>
            </div>
          )}
          
          {!canApplyMonthlyBilling && !hasMonthlyBilling && isLoggedIn && (
            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>企业认证状态</strong>
                <p className="text-gray-500 mt-1">您的企业认证正在审核中，请耐心等待</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">支付方式：</span>
          <span className="font-medium text-gray-900">
            {formData.paymentMethod === 'wechat_pay' ? 'WeChat Pay' : '月结支付'}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">订单总额：</span>
          <span className="text-lg font-bold text-gray-900">
            €{formData.packages.reduce((total, pkg) => {
              const basePrice = pkg.serviceType === 'express' ? 29.99 : 15.99;
              const insuranceCost = pkg.insurance ? 5.99 : 0;
              return total + basePrice + insuranceCost;
            }, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </div>
)

  const steps = [
    { number: 1, title: t('senderInfo'), icon: SenderIcon },
    { number: 2, title: t('recipientInfo'), icon: MapPin },
    { number: 3, title: t('packageService'), icon: Package },
    { number: 4, title: t('review'), icon: CreditCard }
  ]

  function isStepValid(step: number, formData: any): boolean {
    if (step === 1) {
      // 发件人信息必填项
      const senderValid = !!(formData.senderName && formData.senderEmail && formData.senderPhone && formData.senderAddress && formData.senderCity && formData.senderPostalCode && formData.senderCountry);
      
      // ===== 地址验证检查 - API接入后取消注释 =====
      // if (senderValid && addressValidation.sender.isValid === false) {
      //   return false; // 如果地址验证失败，不允许进入下一步
      // }
      
      return senderValid;
    }
    if (step === 2) {
      // 收件人信息必填项
      const recipientValid = !!(formData.recipientName && formData.recipientEmail && formData.recipientPhone && formData.recipientAddress && formData.recipientCity && formData.recipientPostalCode && formData.recipientCountry);
      
      // ===== 地址验证检查 - API接入后取消注释 =====
      // if (recipientValid && addressValidation.recipient.isValid === false) {
      //   return false; // 如果地址验证失败，不允许进入下一步
      // }
      
      return recipientValid;
    }
    if (step === 3) {
      // 至少有一个包裹，且每个包裹的必填项填写
      return formData.packages.length > 0 && formData.packages.every((pkg: any) => pkg.packageType && pkg.weight && pkg.length && pkg.width && pkg.height && pkg.serviceType);
    }
    if (step === 4) {
      // 必须选择支付方式
      return !!(formData.paymentMethod && (
        formData.paymentMethod === 'wechat_pay' || 
        (formData.paymentMethod === 'monthly_billing' && hasMonthlyBilling)
      ));
    }
    return true;
  }

  // ===== 实时地址验证完整实现说明 =====
  /*
  实时地址验证功能完整实现指南：
  
  1. 核心优势：
     - 提升用户体验：无需手动点击验证按钮
     - 减少错误输入：实时反馈和智能建议
     - 提高下单成功率：准确对接物流系统要求
     - 降低客服成本：减少地址错误导致的退件
  
  2. 技术实现要点：
     - 防抖处理：避免频繁API调用（500ms延迟）
     - 多API验证：UPS + Google Maps + 本地数据库
     - 智能缓存：相同地址缓存验证结果
     - 异步处理：不阻塞用户输入流程
  
  3. 用户体验设计：
     - 实时状态显示：验证中、成功、失败状态
     - 智能建议列表：可点击的地址建议
     - 字段自动填充：点击建议后自动完成表单
     - 错误引导：明确的错误原因和修正建议
  
  4. 触发时机优化：
     - 邮编输入：3位以上触发验证
     - 街道名称：5个字符以上触发
     - 城市名称：2个字符以上触发
     - 防抖机制：停止输入后延迟触发
  
  5. 错误处理策略：
     - 网络超时：显示重试选项
     - 地址模糊：提供多个选择
     - 格式错误：实时提示修正
     - 服务异常：降级到本地验证
  
  6. 性能优化：
     - 防抖处理：减少API调用频率
     - 缓存机制：避免重复验证
     - 异步加载：不阻塞UI响应
     - 状态管理：优化组件重渲染
  
  7. 集成步骤：
     - 配置API密钥：UPS、Google Maps等
     - 实现防抖逻辑：useMemo + debounce
     - 添加状态管理：验证状态和结果
     - 集成UI组件：实时反馈和建议列表
     - 测试验证：各种输入场景测试
  
  8. 取消注释步骤：
     - 取消注释状态管理代码
     - 取消注释API调用函数
     - 取消注释防抖处理逻辑
     - 取消注释UI组件代码
     - 取消注释表单验证集成
     - 配置API密钥和端点
  */

  return (
    <>
      <SystemModal
        open={showOrderSuccess}
        onClose={() => setShowOrderSuccess(false)}
        title={t('orderSuccessTitle')}
        message={t('orderSubmittedSuccessfully')}
      />
      
      {/* 月结申请弹窗 */}
      {showMonthlyBillingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">申请企业月结权限</h2>
              <button
                onClick={() => setShowMonthlyBillingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4 text-sm text-gray-600">
              请填写企业信息，我们将在2-3个工作日内完成审核。
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const monthlyRequest = {
                companyName: formData.get('companyName'),
                vatNumber: formData.get('vatNumber'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                contactName: formData.get('contactName'),
                email: user?.email || 'user@example.com',
                status: 'approved',
                id: Date.now()
              };
              
              const requests = JSON.parse(localStorage.getItem('kaifa-monthly-requests') || '[]');
              requests.push(monthlyRequest);
              localStorage.setItem('kaifa-monthly-requests', JSON.stringify(requests));
              
              // 立即更新用户的认证状态
              updateUser({ monthlyBillingAuthorized: true });
              
              setShowMonthlyBillingModal(false);
              alert('企业认证已完成！');
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商户名
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    企业税号 (VAT/P.IVA)
                  </label>
                  {/* TODO: 后端需验证P.IVA必须为11位数字 */}
                  <input
                    type="text"
                    name="vatNumber"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    联系手机号
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    企业注册地址
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    企业联系人姓名
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowMonthlyBillingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  提交申请
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('backToHome')}
              </Link>
              <h1 className="ml-6 text-xl font-semibold text-gray-900">{t('createShipment')}</h1>
              </div>
              
              {/* 用户状态显示 */}
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{user?.name}</span>
                      {hasMonthlyBilling && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">月结已授权</span>
                      )}
                    </div>
                    <Link 
                      href="/profile" 
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      个人中心
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">未登录</span>
                    <Link 
                      href="/login" 
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      登录
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* 用户权限提示 */}
          {!isLoggedIn && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">需要登录才能下单</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    您可以查看运费报价和地址验证功能，但需要登录后才能创建发货订单。
                  </p>
                  <Link 
                    href="/login" 
                    className="inline-flex items-center mt-2 px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    立即登录
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {/* Progress Steps */}
          <div className="mb-8 relative">
            {/* Progress Bar: blue bar ends at the center of the current step's icon */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-0 h-2 w-full">
              {/* Gray bar (full width) */}
              <div className="absolute left-0 top-0 h-2 w-full bg-gray-300 rounded-full"></div>
              {/* Blue bar (width depends on step) */}
              <div
                className="absolute left-0 top-0 h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{
                  width:
                    step === 1 ? '12.5%' :
                    step === 2 ? '37.5%' :
                    step === 3 ? '62.5%' :
                    '100%'
                }}
              ></div>
            </div>
            {/* 四等分ICON+文字 */}
            <div className="grid grid-cols-4 relative z-10">
              {steps.map((stepItem, index) => (
                <div key={stepItem.number} className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full border-2 text-2xl mb-2 ${
                    step >= stepItem.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    <stepItem.icon className="h-8 w-8" />
                  </div>
                  <span className={`text-center font-bold ${step >= stepItem.number ? 'text-blue-700' : 'text-gray-500'} text-base`}>
                    {index === 0 && (<><span>{t('sender')}</span><br/><span>{t('info')}</span></>)}
                    {index === 1 && (<><span>{t('recipient')}</span><br/><span>{t('info')}</span></>)}
                    {index === 2 && (<span>{t('packageService')}</span>)}
                    {index === 3 && (<span>{t('review')}</span>)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('previous')}
                </button>
                
                <button
                  type="submit"
                  disabled={!canCreateOrder}
                  className={
                    !canCreateOrder
                      ? "px-6 py-2 bg-gray-300 text-gray-400 border border-gray-200 rounded-md cursor-not-allowed opacity-60"
                      : (step !== 4 && !isStepValid(step, formData))
                      ? "px-6 py-2 bg-gray-300 text-gray-400 border border-gray-200 rounded-md cursor-not-allowed opacity-60"
                      : "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }
                >
                  {!canCreateOrder ? '请先登录' : (step === 4 ? t('placeOrder') : t('next'))}
                </button>
              </div>
            </form>
          </div>


        </main>
      </div>
    </>
  )
}