'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  CreditCard,
  Download,
  Eye,
  Plus,
  Calendar,
  Euro,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Shield,
  UserCheck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Bell,
  Settings
} from 'lucide-react'
import { useTranslation } from '../utils/translations';

export default function BillingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)

  // Mock data
  const merchantStatus = {
    isVerified: false,
    verificationStatus: 'pending', // pending, approved, rejected
    businessName: 'Sample Business Ltd.',
    registrationDate: '2024-01-10',
    monthlyBillingEligible: false
  }

  const monthlyBills = [
    {
      id: 'BILL-2024-01',
      period: 'January 2024',
      date: '2024-01-31',
      dueDate: '2024-02-15',
      amount: 1250.75,
      status: 'paid',
      shipments: 45,
      description: 'Monthly shipping services - January 2024'
    },
    {
      id: 'BILL-2024-02',
      period: 'February 2024',
      date: '2024-02-29',
      dueDate: '2024-03-15',
      amount: 1899.50,
      status: 'pending',
      shipments: 67,
      description: 'Monthly shipping services - February 2024'
    }
  ]

  const recentInvoices = [
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 125.50,
      status: 'paid',
      description: 'Express Delivery Services - January 2024'
    },
    {
      id: 'INV-2024-002',
      date: '2024-01-10',
      dueDate: '2024-02-10',
      amount: 89.99,
      status: 'pending',
      description: 'Standard Delivery Services - January 2024'
    },
    {
      id: 'INV-2024-003',
      date: '2024-01-05',
      dueDate: '2024-02-05',
      amount: 245.75,
      status: 'overdue',
      description: 'Overnight Delivery Services - January 2024'
    }
  ]

  const paymentMethods = [
    {
      id: 1,
      type: 'credit_card',
      name: 'Visa ending in 4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'paypal',
      name: 'PayPal Account',
      email: 'user@example.com',
      isDefault: false
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE')
  }

  // 假数据，仿照发票样例
  const invoice = {
    company: {
      name: 'KAIFA EXPRESS SRL',
      address: 'Viale Montegrappa 246, 59100 Prato',
      tel: '344/6772783',
      email: 'kaifaexpress@gmail.com',
      piva: 'IT02595340973',
      iban: 'IT43V0339912500CC0030206640',
      bic: 'EXRRITM2',
    },
    client: {
      name: 'BELLA STORE SRO',
      address: 'VODICKOVA 704/36, 11000 NOVE MESTO',
      codiceFiscale: '000174',
      partitaIVA: '17333211',
    },
    invoice: {
      number: '000147/25',
      date: '18-01-2025',
      page: 1,
      agent: '',
      payment: 'CONTANTI',
      reference: '',
      bank: '',
    },
    items: [
      { ref: 'KAIL03659/24', desc: 'BELLA STORE SRO', city: 'NOVE MESTO', colli: 1, peso: '20,00', volume: '0,096', qta: 1, prezzo: '26,00', importo: '26,00', iva: 'A07' },
      { ref: 'KAIL03660/24', desc: 'BELLA STORE SRO', city: 'NOVE MESTO', colli: 3, peso: '39,00', volume: '0,525', qta: 1, prezzo: '87,00', importo: '87,00', iva: 'A07' },
      { ref: 'KAIL04163/24', desc: 'BELLA STORE SRO', city: 'NOVE MESTO', colli: 3, peso: '75,00', volume: '0,432', qta: 1, prezzo: '87,00', importo: '87,00', iva: 'A07' },
      { ref: 'KAIL04466/24', desc: 'BELLA STORE SRO', city: 'NOVE MESTO', colli: 3, peso: '75,00', volume: '0,432', qta: 1, prezzo: '87,00', importo: '87,00', iva: 'A07' },
    ],
    totals: {
      imponibile: '287,00',
      iva: '0,00',
      totaleNetto: '287,00',
      dirittoFisso: '0,00',
      speseBancarie: '0,00',
      totaleDocumento: '287,00',
      scadenza: '18-01-2025',
      esenzioni: 'NON IMPONIBILE ART. 7',
      bolli: '0,00',
      totaleImposta: '0,00',
    },
    note: '',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回首页
            </Link>
            <h1 className="ml-6 text-xl font-semibold text-gray-900">账单与发票</h1>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8 text-black">
        <div className="bg-white rounded-lg shadow-md p-8 relative text-black">
          {/* 公司信息 */}
          <div className="flex flex-col md:flex-row md:justify-between mb-4 text-black">
            <div>
              <div className="font-bold text-lg">{invoice.company.name}</div>
              <div>{invoice.company.address}</div>
              <div>Tel. {invoice.company.tel}</div>
              <div>{invoice.company.email}</div>
              <div>P.IVA {invoice.company.piva}</div>
              <div>IBAN {invoice.company.iban}</div>
              <div>BIC: {invoice.company.bic}</div>
            </div>
            <div className="mt-4 md:mt-0 text-right text-black">
              <div>Spett.le</div>
              <div>{invoice.client.name}</div>
              <div>{invoice.client.address}</div>
            </div>
          </div>
          {/* 发票基本信息 */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-black">
            <div><span className="font-semibold">N.E DATA DOCUMENTO:</span> {invoice.invoice.number}</div>
            <div><span className="font-semibold">DATA:</span> {invoice.invoice.date}</div>
            <div><span className="font-semibold">CLIENTE:</span> {invoice.client.codiceFiscale}</div>
            <div><span className="font-semibold">PARTITA IVA:</span> {invoice.client.partitaIVA}</div>
            <div><span className="font-semibold">N.PAG.:</span> {invoice.invoice.page}</div>
            <div><span className="font-semibold">MODALITÀ DI PAGAMENTO:</span> {invoice.invoice.payment}</div>
              </div>
          {/* 明细表格 */}
          <div className="overflow-x-auto mb-4 text-black">
            <table className="min-w-full border text-xs text-black">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">NS.RIF.</th>
                  <th className="border px-2 py-1">DESCRIZIONE</th>
                  <th className="border px-2 py-1">COLLI</th>
                  <th className="border px-2 py-1">PESO</th>
                  <th className="border px-2 py-1">VOLUME</th>
                  <th className="border px-2 py-1">Q.TA'</th>
                  <th className="border px-2 py-1">PREZZO</th>
                  <th className="border px-2 py-1">IMPORTO</th>
                  <th className="border px-2 py-1">IVA</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1 whitespace-nowrap">{item.ref}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{item.desc} <br /> {item.city}</td>
                    <td className="border px-2 py-1 text-center">{item.colli}</td>
                    <td className="border px-2 py-1 text-center">{item.peso}</td>
                    <td className="border px-2 py-1 text-center">{item.volume}</td>
                    <td className="border px-2 py-1 text-center">{item.qta}</td>
                    <td className="border px-2 py-1 text-right">{item.prezzo}</td>
                    <td className="border px-2 py-1 text-right">{item.importo}</td>
                    <td className="border px-2 py-1 text-center">{item.iva}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 金额汇总区 */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4 text-black">
              <div>
              <div><span className="font-semibold">TOTALE:</span> {invoice.totals.totaleDocumento}</div>
              <div><span className="font-semibold">SC. %:</span> 0,0</div>
              <div><span className="font-semibold">TOTALE NETTO:</span> {invoice.totals.totaleNetto}</div>
              <div><span className="font-semibold">DIRITTO FISSO:</span> {invoice.totals.dirittoFisso}</div>
              </div>
              <div>
              <div><span className="font-semibold">SP. BANCARIE:</span> {invoice.totals.speseBancarie}</div>
              <div><span className="font-semibold">ESENZIONI:</span> {invoice.totals.esenzioni}</div>
              <div><span className="font-semibold">BOLLI:</span> {invoice.totals.bolli}</div>
              <div><span className="font-semibold">TOTALE DOCUMENTO EUR:</span> <span className="font-bold text-lg">{invoice.totals.totaleDocumento}</span></div>
            </div>
          </div>
          {/* 付款与到期日 */}
          <div className="flex flex-wrap gap-4 text-sm mb-2 text-black">
            <div><span className="font-semibold">SCADENZE:</span> {invoice.totals.scadenza}</div>
            <div><span className="font-semibold">IMPORTO:</span> {invoice.totals.totaleDocumento}</div>
          </div>
          {/* 备注区 */}
          <div className="text-xs text-black mt-2">Vi preghiamo di verificare l'esattezza dei Vostri dati anagrafici e fiscali, le cui eventuali modifiche dovranno essere tempestivamente comunicate in ottemperanza al D.L.223/06</div>
          {/* 下载PDF按钮（占位） */}
          <button className="absolute top-4 right-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            <Download className="h-5 w-5" /> Scarica PDF
                      </button>
        </div>
      </main>

      {/* Verification Modal */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('businessVerification')}</h3>
            <p className="text-gray-600 mb-6">
              {t('businessVerificationDescModal')}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('businessName')}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  placeholder={t('yourBusinessName')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('businessRegistrationNumber')}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  placeholder={t('vatNumberOrBusinessId')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('businessAddress')}</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  rows={3}
                  placeholder={t('fullBusinessAddress')}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button className="flex-1 px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors">
                {t('submitForReview')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 