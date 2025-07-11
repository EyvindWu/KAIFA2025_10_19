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
  Settings
} from 'lucide-react'
import AddressBookIcon from '../components/icons/AddressBookIcon'
import DeleteIcon from '../components/icons/DeleteIcon'
import dynamic from 'next/dynamic'
import { useTranslation } from '../utils/translations'
import { SystemModal } from '../components/ClientProviders';
import AddressBook from '../components/AddressBook/AddressBook';
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
    paymentMethod: 'credit_card',
    
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

  // 简单的发件人地址簿
  const senderAddressBook = [
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

  const [selectedSenderIndex, setSelectedSenderIndex] = useState(-1);
  const [saveToAddressBook, setSaveToAddressBook] = useState(false);
  const [showKfTooltip, setShowKfTooltip] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

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
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
          <input
            type="text"
            value={formData.senderAddress}
            onChange={(e) => handleInputChange('senderAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('postalCode')}</label>
            <input
              type="text"
              value={formData.senderPostalCode}
              onChange={(e) => handleInputChange('senderPostalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center ml-2 mt-6">
            <input
              type="checkbox"
              checked={saveToAddressBook}
              onChange={e => setSaveToAddressBook(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-black">{t('saveToAddressBook')}</span>
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
          <input
            type="text"
            value={formData.recipientAddress}
            onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('postalCode')}</label>
            <input
              type="text"
              value={formData.recipientPostalCode}
              onChange={(e) => handleInputChange('recipientPostalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center ml-2 mt-6">
            <input
              type="checkbox"
              checked={saveToAddressBook}
              onChange={e => setSaveToAddressBook(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-black">{t('saveToAddressBook')}</span>
          </label>
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
              </div>
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('serviceOptions')}</h3>
                <div className="space-y-4">
                  {serviceTypes.map((service) => (
                    <label key={service.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer bg-blue-50">
                      <input type="radio" name={`serviceType${idx}`} value={service.id} checked={pkg.serviceType === service.id} onChange={e => {
                        const v = e.target.value
                        setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, serviceType: v } : p) }))
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
                      <input type="checkbox" checked={pkg.insurance} onChange={e => {
                        const v = e.target.checked
                        setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, insurance: v } : p) }))
                      }} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">{t('addInsuranceCoverage')}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
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

    {/* Payment Information */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start">
        <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
        <div>
          <h4 className="font-medium text-blue-900">{t('paymentMethod')}</h4>
          <p className="text-sm text-blue-700 mt-1">
            {t('monthlyBillingDescription')}
          </p>
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
      return !!(formData.senderName && formData.senderEmail && formData.senderPhone && formData.senderAddress && formData.senderCity && formData.senderPostalCode && formData.senderCountry);
    }
    if (step === 2) {
      // 收件人信息必填项
      return !!(formData.recipientName && formData.recipientEmail && formData.recipientPhone && formData.recipientAddress && formData.recipientCity && formData.recipientPostalCode && formData.recipientCountry);
    }
    if (step === 3) {
      // 至少有一个包裹，且每个包裹的必填项填写
      return formData.packages.length > 0 && formData.packages.every((pkg: any) => pkg.packageType && pkg.weight && pkg.length && pkg.width && pkg.height && pkg.serviceType);
    }
    return true;
  }

  return (
    <>
      <SystemModal
        open={showOrderSuccess}
        onClose={() => setShowOrderSuccess(false)}
        title={t('orderSuccessTitle')}
        message={t('orderSubmittedSuccessfully')}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center h-16">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('backToHome')}
              </Link>
              <h1 className="ml-6 text-xl font-semibold text-gray-900">{t('createShipment')}</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
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
                  className={
                    (step !== 4 && !isStepValid(step, formData))
                      ? "px-6 py-2 bg-gray-300 text-gray-400 border border-gray-200 rounded-md cursor-not-allowed opacity-60"
                      : "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }
                >
                  {step === 4 ? t('placeOrder') : t('next')}
                </button>
              </div>
            </form>
          </div>


        </main>
      </div>
    </>
  )
}