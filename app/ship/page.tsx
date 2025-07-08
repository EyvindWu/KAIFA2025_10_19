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

const SenderIcon = dynamic(() => import('../components/icons/SenderIcon'), { ssr: false })



export default function ShipPage() {
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
      needsPallet: false, palletSize: '', sameDayPickup: false
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

  const contactList = [
    { key: 'alice', label: 'Alice (Berlin)' },
    { key: 'bob', label: 'Bob (Munich)' },
    { key: 'charlie', label: 'Charlie (Paris)' }
  ];

  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const contactInputRef = useRef<HTMLInputElement>(null);

  // 简单的发件人地址簿
  const senderAddressBook = [
    {
      name: 'Alice Smith',
      email: 'alice.smith@email.com',
      phone: '+49 111222333',
      address: 'Aliceweg 10',
      city: 'Hamburg',
      postalCode: '20095',
      country: 'Germany'
    },
    {
      name: 'Bob Lee',
      email: 'bob.lee@email.com',
      phone: '+49 444555666',
      address: 'Bobstrasse 22',
      city: 'Frankfurt',
      postalCode: '60311',
      country: 'Germany'
    },
    {
      name: 'Carol Wang',
      email: 'carol.wang@email.com',
      phone: '+49 777888999',
      address: 'Carolplatz 5',
      city: 'Stuttgart',
      postalCode: '70173',
      country: 'Germany'
    }
  ];

  const [selectedSenderIndex, setSelectedSenderIndex] = useState(-1);
  const [saveToAddressBook, setSaveToAddressBook] = useState(false);

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
      alert('Order submitted successfully!')
    }
  }

  const serviceTypes = [
    { id: 'standard', name: 'Standard Delivery', price: '€15.99', time: '3-5 business days' },
    { id: 'express', name: 'Express Delivery', price: '€29.99', time: '1-2 business days' }
  ]

  const countries = [
    'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Switzerland'
  ]

  // 3. Recipient Info顶部添加KF代码和通讯录
  const addressBookData: { [key: string]: { recipientName: string; recipientEmail: string; recipientPhone: string; recipientAddress: string; recipientCity: string; recipientPostalCode: string; recipientCountry: string } } = {
    alice: { recipientName: 'Alice', recipientEmail: 'alice@email.com', recipientPhone: '+49 111111', recipientAddress: 'Alice St 2', recipientCity: 'Berlin', recipientPostalCode: '10115', recipientCountry: 'Germany' },
    bob: { recipientName: 'Bob', recipientEmail: 'bob@email.com', recipientPhone: '+49 222222', recipientAddress: 'Bob Ave 3', recipientCity: 'Munich', recipientPostalCode: '80331', recipientCountry: 'Germany' },
    charlie: { recipientName: 'Charlie', recipientEmail: 'charlie@email.com', recipientPhone: '+33 333333', recipientAddress: 'Charlie Rd 5', recipientCity: 'Paris', recipientPostalCode: '75001', recipientCountry: 'France' }
  }

  const handleContactSelect = (key: string) => {
    setFormData(prev => ({ ...prev, addressBook: key, ...addressBookData[key] }));
    setShowContactDropdown(false);
    // 失去焦点
    contactInputRef.current?.blur();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Sender Information</h2>
      </div>
      
      {/* 地址簿选择 */}
      <div className="mb-4 flex gap-4 items-center">
        <div className="relative w-full flex items-center gap-2">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AddressBookIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={senderContactInputRef}
              type="text"
              placeholder="Search sender"
              value={senderAddressBookInput}
              onFocus={() => setShowSenderContactDropdown(true)}
              onBlur={() => setTimeout(() => setShowSenderContactDropdown(false), 150)}
              onChange={e => {
                const value = e.target.value;
                setSenderAddressBookInput(value);
                const sender = senderAddressBook.find(s => s.name === value);
                if (sender) {
                  setFormData(prev => ({
                    ...prev,
                    senderName: sender.name,
                    senderEmail: sender.email,
                    senderPhone: sender.phone,
                    senderAddress: sender.address,
                    senderCity: sender.city,
                    senderPostalCode: sender.postalCode,
                    senderCountry: sender.country
                  }));
                  setUseSenderAddressBook(true);
                } else {
                  setUseSenderAddressBook(false);
                }
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSenderContactDropdown && (
              <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg">
                {senderAddressBook.map((sender, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-900"
                    onMouseDown={() => {
                      setSenderAddressBookInput(sender.name);
                      setFormData(prev => ({
                        ...prev,
                        senderName: sender.name,
                        senderEmail: sender.email,
                        senderPhone: sender.phone,
                        senderAddress: sender.address,
                        senderCity: sender.city,
                        senderPostalCode: sender.postalCode,
                        senderCountry: sender.country
                      }));
                      setUseSenderAddressBook(true);
                    }}
                  >
                    {sender.name} ({sender.city})
                  </div>
                ))}
              </div>
            )}
          </div>
          <label className="flex items-center ml-2 select-none">
            <button
              type="button"
              className={`text-sm border rounded px-3 py-1 ml-2 ${useSenderAddressBook ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-gray-400 border-gray-100 cursor-not-allowed'}`}
              disabled={!useSenderAddressBook}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  senderName: '',
                  senderEmail: '',
                  senderPhone: '',
                  senderAddress: '',
                  senderCity: '',
                  senderPostalCode: '',
                  senderCountry: ''
                }));
                setSenderAddressBookInput('');
                setUseSenderAddressBook(false);
              }}
            >
              Clear
            </button>
          </label>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={formData.senderName}
            onChange={(e) => handleInputChange('senderName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={formData.senderEmail}
            onChange={(e) => handleInputChange('senderEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="tel"
            value={formData.senderPhone}
            onChange={(e) => handleInputChange('senderPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <select
            value={formData.senderCountry}
            onChange={(e) => handleInputChange('senderCountry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input
            type="text"
            value={formData.senderAddress}
            onChange={(e) => handleInputChange('senderAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            value={formData.senderCity}
            onChange={(e) => handleInputChange('senderCity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
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
            <span className="ml-2 text-sm text-black">Save to address book</span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Recipient Information</h2>
      </div>
      <div className="mb-2 flex gap-4 relative items-center">
        <input type="text" placeholder="Enter KF Code" value={formData.kfCode} onChange={e => setFormData(prev => ({ ...prev, kfCode: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded-md" />
        <div className="flex-1 relative flex items-center gap-2">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AddressBookIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={contactInputRef}
              type="text"
              placeholder="Search recipient"
              value={formData.addressBook}
              onFocus={() => setShowContactDropdown(true)}
              onBlur={() => setTimeout(() => setShowContactDropdown(false), 150)}
              onChange={e => {
                const value = e.target.value;
                setFormData(prev => ({ ...prev, addressBook: value }));
                if (addressBookData[value]) {
                  setFormData(prev => ({ ...prev, ...addressBookData[value] }));
                  setUseAddressBook(true);
                } else {
                  setUseAddressBook(false);
                }
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showContactDropdown && (
              <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg">
                {contactList.map(contact => (
                  <div
                    key={contact.key}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-900"
                    onMouseDown={() => {
                      handleContactSelect(contact.key);
                      setUseAddressBook(true);
                    }}
                  >
                    {contact.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <label className="flex items-center ml-2 select-none">
            <button
              type="button"
              className={`text-sm border rounded px-3 py-1 ml-2 ${useAddressBook ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-gray-400 border-gray-100 cursor-not-allowed'}`}
              disabled={!useAddressBook}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  recipientName: '',
                  recipientEmail: '',
                  recipientPhone: '',
                  recipientAddress: '',
                  recipientCity: '',
                  recipientPostalCode: '',
                  recipientCountry: '',
                  addressBook: ''
                }));
                setUseAddressBook(false);
              }}
            >
              Clear
            </button>
          </label>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleInputChange('recipientName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={formData.recipientEmail}
            onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="tel"
            value={formData.recipientPhone}
            onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <select
            value={formData.recipientCountry}
            onChange={(e) => handleInputChange('recipientCountry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input
            type="text"
            value={formData.recipientAddress}
            onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            value={formData.recipientCity}
            onChange={(e) => handleInputChange('recipientCity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
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
            <span className="ml-2 text-sm text-black">Save to address book</span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Package & Service Details</h2>
      {formData.packages.map((pkg, idx) => (
        <div key={idx} className="mb-4">
          <div className={`flex items-center justify-between cursor-pointer rounded p-2 ${activePackageIdx === idx ? 'bg-blue-600 text-white font-bold' : 'bg-blue-600 text-white'}`} onClick={() => setActivePackageIdx(idx)}>
            <div className="flex items-center gap-2">
              {activePackageIdx === idx ? <span>▼</span> : <span>▶</span>}
              <span>Package {idx + 1}</span>
              {formData.packages.length > 1 && idx > 0 && (
                <button
                  type="button"
                  className="ml-2 text-white hover:text-red-400 flex items-center"
                  onClick={e => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
                      setFormData(prev => ({
                        ...prev,
                        packages: prev.packages.filter((_, i) => i !== idx)
                      }))
                      if (activePackageIdx === idx && idx > 0) setActivePackageIdx(idx - 1)
                    }
                  }}
                  aria-label="Delete this package"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Type</label>
                  <select value={pkg.packageType} onChange={e => {
                    const v = e.target.value
                    setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, packageType: v } : p) }))
                  }} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="package">Package</option>
                    <option value="document">Document</option>
                    <option value="fragile">Fragile</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input type="text" value={pkg.weight} onChange={e => {
                    const v = e.target.value
                    setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, weight: v } : p) }))
                  }} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                    <input type="text" value={pkg.length} onChange={e => {
                      const v = e.target.value
                      setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, length: v } : p) }))
                    }} className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                    <input type="text" value={pkg.width} onChange={e => {
                      const v = e.target.value
                      setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, width: v } : p) }))
                    }} className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                    <input type="text" value={pkg.height} onChange={e => {
                      const v = e.target.value
                      setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, height: v } : p) }))
                    }} className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={pkg.description} onChange={e => {
                    const v = e.target.value
                    setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, description: v } : p) }))
                  }} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Service Options</h3>
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
                      <span className="ml-2 text-sm text-gray-700">Add insurance coverage (+€5.99)</span>
                    </label>
                  </div>
                  
                  {/* 板架选项 */}
                  <div className="border-t pt-4">
                    <div className="mb-3 font-medium text-gray-700">Need pallet?<span className="text-red-500 ml-1">*</span></div>
                    <div className="flex gap-6 mb-2">
                      <label className="flex items-center">
                        <input type="radio" name={`needsPallet${idx}`} value="yes" checked={pkg.needsPallet === true} onChange={() => {
                          setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, needsPallet: true } : p) }))
                        }} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-black">YES</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name={`needsPallet${idx}`} value="no" checked={pkg.needsPallet === false} onChange={() => {
                          setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, needsPallet: false, palletSize: '' } : p) }))
                        }} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-black">NO</span>
                      </label>
                    </div>
                    {pkg.needsPallet === true && (
                      <div className="ml-6 space-y-2">
                        <div className="mb-1 text-sm text-gray-700">Please select pallet size <span className="text-red-500">*</span></div>
                        <label className="flex items-center">
                          <input type="radio" name={`palletSize${idx}`} value="100x50" checked={pkg.palletSize === '100x50'} onChange={e => {
                            const v = e.target.value
                            setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, palletSize: v } : p) }))
                          }} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-2 text-sm text-gray-700">1. 100cm × 50cm</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name={`palletSize${idx}`} value="140x80" checked={pkg.palletSize === '140x80'} onChange={e => {
                            const v = e.target.value
                            setFormData(prev => ({ ...prev, packages: prev.packages.map((p, i) => i === idx ? { ...p, palletSize: v } : p) }))
                          }} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-2 text-sm text-gray-700">2. 140cm × 80cm</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {formData.packages.length < 5 && (
        <div className="flex items-center justify-center mt-6">
          <button type="button" className="flex items-center px-5 py-2 bg-green-500 text-white text-lg rounded-full shadow-lg hover:bg-green-600 focus:outline-none" onClick={() => {
            setFormData(prev => ({ ...prev, packages: [...prev.packages, { packageType: 'package', weight: '', length: '', width: '', height: '', description: '', serviceType: 'standard', insurance: false, needsPallet: false, palletSize: '', sameDayPickup: false }] }))
            setActivePackageIdx(formData.packages.length)
          }}>
            <span className="text-2xl mr-2">+</span>
            <span className="font-medium text-base">Add Package {formData.packages.length + 1}</span>
          </button>
        </div>
      )}
      <div className="mt-8 flex items-start bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <input
          type="checkbox"
          checked={formData.delayedPickup}
          onChange={e => setFormData(prev => ({ ...prev, delayedPickup: e.target.checked }))}
          className="h-5 w-5 mt-0.5 mr-3"
        />
        <div className="text-sm text-yellow-900">
          <span className="font-bold">Delayed pickup</span><br />
          FastExpress supports pickup after 16:00 for same-day orders. To ensure timely shipping, please prepare your package and label in advance. We will contact you.
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Order</h2>
    
    {/* Sender & Recipient Information */}
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sender Information */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Sender
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderName || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderEmail || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderPhone || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Country:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderCountry || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Address:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderAddress || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">City:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderCity || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Postal Code:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.senderPostalCode || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Recipient Information */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-600" />
            Recipient
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientName || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientEmail || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientPhone || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Country:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientCountry || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Address:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientAddress || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">City:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientCity || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Postal Code:</span>
              <span className="ml-2 font-medium text-gray-900">{formData.recipientPostalCode || 'Not provided'}</span>
            </div>
            {formData.kfCode && (
              <div>
                <span className="text-gray-600">KF Code:</span>
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
        Package Information ({formData.packages.length} package{formData.packages.length > 1 ? 's' : ''})
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formData.packages.map((pkg, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="font-medium text-gray-900 mb-3">Package {idx + 1}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">{pkg.packageType}</span>
              </div>
              <div>
                <span className="text-gray-600">Weight:</span>
                <span className="ml-2 font-medium text-gray-900">{pkg.weight || 'Not provided'} kg</span>
              </div>
              <div>
                <span className="text-gray-600">Length:</span>
                <span className="ml-2 font-medium text-gray-900">{pkg.length || 'Not provided'} cm</span>
              </div>
              <div>
                <span className="text-gray-600">Width:</span>
                <span className="ml-2 font-medium text-gray-900">{pkg.width || 'Not provided'} cm</span>
              </div>
              <div>
                <span className="text-gray-600">Height:</span>
                <span className="ml-2 font-medium text-gray-900">{pkg.height || 'Not provided'} cm</span>
              </div>
              <div>
                <span className="text-gray-600">Service:</span>
                <span className="ml-2 font-medium text-gray-900">{serviceTypes.find(s => s.id === pkg.serviceType)?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Insurance:</span>
                <span className="ml-2 font-medium text-gray-900">{pkg.insurance ? 'Yes (+€5.99)' : 'No'}</span>
              </div>
              {pkg.needsPallet && (
                <div>
                  <span className="text-gray-600">Pallet:</span>
                  <span className="ml-2 font-medium text-gray-900">{pkg.palletSize === '100x50' ? '100cm × 50cm' : '140cm × 80cm'}</span>
                </div>
              )}
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
          <h4 className="font-medium text-blue-900">Payment Method</h4>
          <p className="text-sm text-blue-700 mt-1">
            Monthly billing via bank transfer. Invoice will be sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  </div>
)

  const steps = [
    { number: 1, title: 'Sender Info', icon: SenderIcon },
    { number: 2, title: 'Recipient Info', icon: MapPin },
    { number: 3, title: 'Package & Service', icon: Package },
    { number: 4, title: 'Review', icon: CreditCard }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="ml-6 text-xl font-semibold text-gray-900">Create Shipment</h1>
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
                  {index === 0 && (<><span>Sender</span><br/><span>Info</span></>)}
                  {index === 1 && (<><span>Recipient</span><br/><span>Info</span></>)}
                  {index === 2 && (<><span>Package &</span><br/><span>Service</span></>)}
                  {index === 3 && (<span>Review</span>)}
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
                Previous
              </button>
              
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {step === 4 ? 'Place Order' : 'Next'}
              </button>
            </div>
          </form>
        </div>


      </main>
    </div>
  )
}