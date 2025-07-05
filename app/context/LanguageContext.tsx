'use client'

import React, { createContext, useState, useEffect } from 'react'

export const translations = {
  en: {
    // Header & Navigation
    shipping: 'Shipping',
    ship: 'Ship',
    tracking: 'Tracking',
    support: 'Support',
    signIn: 'Sign In',
    register: 'Register',
    signOut: 'Sign Out',
    settings: 'Settings',
    adminPanel: 'Admin Panel',
    dashboard: 'Dashboard',
    language: 'Language',
    
    // Homepage
    professionalLogistics: 'Smart Logistics Solutions for Your Business',
    connectWithLeading: 'Empowering your shipments with seamless, efficient, and reliable logistics services worldwide.',
    shipPackages: 'Ship Packages',
    createShipments: 'Create shipments with our partner logistics companies.',
    startShipping: 'Start Shipping',
    trackDeliveries: 'Track Deliveries',
    realTimeTracking: 'Real-time tracking for all your shipments.',
    trackNow: 'Track Now',
    billingPayments: 'Billing & Payments',
    manageInvoices: 'Manage your invoices and payment methods.',
    viewBilling: 'View Billing',
    monthlyBilling: 'Monthly Billing for Verified Merchants',
    monthlyBillingDesc: 'After verification of your business information, enjoy the convenience of monthly billing. All your shipping costs are consolidated into a single monthly invoice for easy management.',
    learnMore: 'Learn More',
    applyForMonthlyBilling: 'Apply for Monthly Billing',
    whyChoose: 'Why Choose KAIFA EXPRESS?',
    fastDelivery: 'Fast Delivery',
    quickReliable: 'Quick and reliable delivery across Europe',
    realTimeTrackingTitle: 'Real-time Tracking',
    trackPackages: 'Track your packages in real-time',
    support247: '24/7 Support',
    roundTheClock: 'Round-the-clock customer support',
    quickActions: 'Quick Actions',
    trackPackage: 'Track Package',
    createShipment: 'Create Shipment',
    viewBillingInfo: 'View Billing',
    printDocuments: 'Print Documents',
    
    // Tracking
    track: 'Track',
    trackYourPackage: 'Track Your Package',
    enterTrackingNumber: 'Enter tracking number',
    trackButton: 'Track',
    recentOrders: 'Recent Orders',
    orderHistory: 'Order History',
    orderDetail: 'Order Detail',
    trackingNumber: 'Tracking Number',
    status: 'Status',
    sender: 'Sender',
    recipient: 'Recipient',
    packageInformation: 'Package Information',
    trackingTimeline: 'Tracking Timeline',
    share: 'Share',
    shareTo: 'Share to',
    viewLogistics: 'View Logistics',
    
    // Package Status
    pendingPickup: 'Pending Pickup',
    inTransit: 'In Transit',
    outForDelivery: 'Out for Delivery',
    delivered: 'Delivered',
    attemptFailed: 'Attempt Failed',
    exception: 'Exception',
    cancelled: 'Cancelled',
    
    // Package Details
    packageType: 'Type',
    weight: 'Weight (kg)',
    length: 'Length (cm)',
    width: 'Width (cm)',
    height: 'Height (cm)',
    description: 'Description',
    serviceType: 'Service Type',
    insurance: 'Insurance',
    needsPallet: 'Needs Pallet',
    palletSize: 'Pallet Size',
    trackingUrl: 'Tracking URL',
    
    // Login
    email: 'Email',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    login: 'Login',
    welcomeBack: 'Welcome back',
    loginToYourAccount: 'Login to your account',
    savedAccounts: 'Saved Accounts',
    
    // Admin
    systemSettings: 'System Settings',
    userManagement: 'User Management',
    systemLogs: 'System Logs',
    orders: 'Orders',
    customers: 'Customers',
    shipments: 'Shipments',
    billing: 'Billing',
    reports: 'Reports',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    download: 'Download',
    upload: 'Upload',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    open: 'Open',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    
    // Additional keys for homepage
    printShare: 'Print/Share',
    printPdf: 'Print PDF',
    shareOrder: 'Share Order',
    shareButtonMessage: 'Please use the share button in Tracking for full functionality.',
    
    // Order detail keys
    orderDetails: 'Order Details',
    packageCount: 'Package Count',
    recipientInfo: 'Recipient Information',
    senderInfo: 'Sender Information',
    downloadPdf: 'Print',
    downloadConfirm: 'Do you want to print the order details?',
    selectOrderToView: 'Select an order to view details',
    view_all_info: 'View all info',
  },
  zh: {
    // Header & Navigation
    shipping: '发货',
    ship: '发货',
    tracking: '跟踪',
    support: '支持',
    signIn: '登录',
    register: '注册',
    signOut: '退出登录',
    settings: '设置',
    adminPanel: '管理面板',
    dashboard: '仪表板',
    language: '语言',
    
    // Homepage
    professionalLogistics: '为企业量身打造的智能物流解决方案',
    connectWithLeading: '为您的包裹提供高效、可靠、无缝衔接的全球物流服务。',
    shipPackages: '发货包裹',
    createShipments: '与我们的物流合作伙伴创建运单。',
    startShipping: '开始发货',
    trackDeliveries: '跟踪配送',
    realTimeTracking: '所有包裹的实时跟踪。',
    trackNow: '立即跟踪',
    billingPayments: '账单与支付',
    manageInvoices: '管理您的发票和支付方式。',
    viewBilling: '查看账单',
    monthlyBilling: '已验证商户的月账单',
    monthlyBillingDesc: '验证您的业务信息后，享受月账单的便利。所有运输费用都整合到一张月发票中，便于管理。',
    learnMore: '了解更多',
    applyForMonthlyBilling: '申请月账单',
    whyChoose: '为什么选择KAIFA EXPRESS？',
    fastDelivery: '快速配送',
    quickReliable: '在欧洲范围内快速可靠的配送',
    realTimeTrackingTitle: '实时跟踪',
    trackPackages: '实时跟踪您的包裹',
    support247: '24/7支持',
    roundTheClock: '全天候客户支持',
    quickActions: '快速操作',
    trackPackage: '跟踪包裹',
    createShipment: '创建运单',
    viewBillingInfo: '查看账单',
    printDocuments: '打印文档',
    
    // Tracking
    track: '跟踪',
    trackYourPackage: '跟踪您的包裹',
    enterTrackingNumber: '输入跟踪号',
    trackButton: '跟踪',
    recentOrders: '最近订单',
    orderHistory: '订单历史',
    orderDetail: '订单详情',
    trackingNumber: '跟踪号',
    status: '状态',
    sender: '发件人',
    recipient: '收件人',
    packageInformation: '包裹信息',
    trackingTimeline: '跟踪时间线',
    share: '分享',
    shareTo: '分享到',
    viewLogistics: '查看物流',
    
    // Package Status
    pendingPickup: '待取件',
    inTransit: '运输中',
    outForDelivery: '派送中',
    delivered: '已送达',
    attemptFailed: '派送失败',
    exception: '异常',
    cancelled: '已取消',
    
    // Package Details
    packageType: '类型',
    weight: '重量 (kg)',
    length: '长度 (cm)',
    width: '宽度 (cm)',
    height: '高度 (cm)',
    description: '描述',
    serviceType: '服务类型',
    insurance: '保险',
    needsPallet: '需要托盘',
    palletSize: '托盘尺寸',
    trackingUrl: '跟踪链接',
    
    // Login
    email: '邮箱',
    password: '密码',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
    login: '登录',
    welcomeBack: '欢迎回来',
    loginToYourAccount: '登录您的账户',
    savedAccounts: '已保存账户',
    
    // Admin
    systemSettings: '系统设置',
    userManagement: '用户管理',
    systemLogs: '系统日志',
    orders: '订单',
    customers: '客户',
    shipments: '运单',
    billing: '账单',
    reports: '报告',
    
    // Common
    save: '保存',
    cancel: '取消',
    edit: '编辑',
    delete: '删除',
    add: '添加',
    search: '搜索',
    filter: '筛选',
    export: '导出',
    import: '导入',
    download: '下载',
    upload: '上传',
    confirm: '确认',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '关闭',
    open: '打开',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    warning: '警告',
    info: '信息',
    
    // Additional keys for homepage
    printShare: '打印/分享',
    printPdf: '打印PDF',
    shareOrder: '分享订单',
    shareButtonMessage: '请在跟踪页面使用分享按钮获得完整功能。',
    
    // Order detail keys
    orderDetails: '订单详情',
    packageCount: '包裹数量',
    recipientInfo: '收件人信息',
    senderInfo: '发件人信息',
    downloadPdf: '打印',
    downloadConfirm: '是否要打印订单详情？',
    selectOrderToView: '选择一个订单查看详情',
    view_all_info: '查看全部信息',
  },
  it: {
    // Header & Navigation
    shipping: 'Spedizione',
    ship: 'Spedisci',
    tracking: 'Tracciamento',
    support: 'Supporto',
    signIn: 'Accedi',
    register: 'Registrati',
    signOut: 'Esci',
    settings: 'Impostazioni',
    adminPanel: 'Pannello Admin',
    dashboard: 'Dashboard',
    language: 'Lingua',
    
    // Homepage
    professionalLogistics: 'Soluzioni Logistiche Intelligenti per la Tua Azienda',
    connectWithLeading: 'Potenziamo le tue spedizioni con servizi logistici senza soluzione di continuità, efficienti e affidabili in tutto il mondo.',
    shipPackages: 'Spedisci Pacchi',
    createShipments: 'Crea spedizioni con le nostre aziende partner logistiche.',
    startShipping: 'Inizia a Spedire',
    trackDeliveries: 'Traccia Consegne',
    realTimeTracking: 'Tracciamento in tempo reale per tutte le tue spedizioni.',
    trackNow: 'Traccia Ora',
    billingPayments: 'Fatturazione e Pagamenti',
    manageInvoices: 'Gestisci le tue fatture e metodi di pagamento.',
    viewBilling: 'Visualizza Fatturazione',
    monthlyBilling: 'Fatturazione Mensile per Commercianti Verificati',
    monthlyBillingDesc: 'Dopo la verifica delle informazioni aziendali, goditi la comodità della fatturazione mensile. Tutti i costi di spedizione sono consolidati in una singola fattura mensile per una facile gestione.',
    learnMore: 'Scopri di Più',
    applyForMonthlyBilling: 'Richiedi Fatturazione Mensile',
    whyChoose: 'Perché Scegliere KAIFA EXPRESS?',
    fastDelivery: 'Consegna Rapida',
    quickReliable: 'Consegna rapida e affidabile in tutta Europa',
    realTimeTrackingTitle: 'Tracciamento in Tempo Reale',
    trackPackages: 'Traccia i tuoi pacchi in tempo reale',
    support247: 'Supporto 24/7',
    roundTheClock: 'Supporto clienti 24 ore su 24',
    quickActions: 'Azioni Rapide',
    trackPackage: 'Traccia Pacco',
    createShipment: 'Crea Spedizione',
    viewBillingInfo: 'Visualizza Fatturazione',
    printDocuments: 'Stampa Documenti',
    
    // Tracking
    track: 'Traccia',
    trackYourPackage: 'Traccia il Tuo Pacco',
    enterTrackingNumber: 'Inserisci numero di tracciamento',
    trackButton: 'Traccia',
    recentOrders: 'Ordini Recenti',
    orderHistory: 'Cronologia Ordini',
    orderDetail: 'Dettaglio Ordine',
    trackingNumber: 'Numero di Tracciamento',
    status: 'Stato',
    sender: 'Mittente',
    recipient: 'Destinatario',
    packageInformation: 'Informazioni Pacco',
    trackingTimeline: 'Cronologia Tracciamento',
    share: 'Condividi',
    shareTo: 'Condividi su',
    viewLogistics: 'Visualizza Logistica',
    
    // Package Status
    pendingPickup: 'In Attesa di Ritiro',
    inTransit: 'In Transito',
    outForDelivery: 'In Consegna',
    delivered: 'Consegnato',
    attemptFailed: 'Tentativo Fallito',
    exception: 'Eccezione',
    cancelled: 'Annullato',
    
    // Package Details
    packageType: 'Tipo',
    weight: 'Peso (kg)',
    length: 'Lunghezza (cm)',
    width: 'Larghezza (cm)',
    height: 'Altezza (cm)',
    description: 'Descrizione',
    serviceType: 'Tipo di Servizio',
    insurance: 'Assicurazione',
    needsPallet: 'Richiede Pallet',
    palletSize: 'Dimensione Pallet',
    trackingUrl: 'URL Tracciamento',
    
    // Login
    email: 'Email',
    password: 'Password',
    rememberMe: 'Ricordami',
    forgotPassword: 'Password dimenticata?',
    login: 'Accedi',
    welcomeBack: 'Bentornato',
    loginToYourAccount: 'Accedi al tuo account',
    savedAccounts: 'Account Salvati',
    
    // Admin
    systemSettings: 'Impostazioni Sistema',
    userManagement: 'Gestione Utenti',
    systemLogs: 'Log di Sistema',
    orders: 'Ordini',
    customers: 'Clienti',
    shipments: 'Spedizioni',
    billing: 'Fatturazione',
    reports: 'Report',
    
    // Common
    save: 'Salva',
    cancel: 'Annulla',
    edit: 'Modifica',
    delete: 'Elimina',
    add: 'Aggiungi',
    search: 'Cerca',
    filter: 'Filtra',
    export: 'Esporta',
    import: 'Importa',
    download: 'Scarica',
    upload: 'Carica',
    confirm: 'Conferma',
    back: 'Indietro',
    next: 'Avanti',
    previous: 'Precedente',
    close: 'Chiudi',
    open: 'Apri',
    loading: 'Caricamento...',
    error: 'Errore',
    success: 'Successo',
    warning: 'Avviso',
    info: 'Informazioni',
    
    // Additional keys for homepage
    printShare: 'Stampa/Condividi',
    printPdf: 'Stampa PDF',
    shareOrder: 'Condividi Ordine',
    shareButtonMessage: 'Utilizza il pulsante di condivisione nella pagina di tracciamento per la funzionalità completa.',
    
    // Order detail keys
    orderDetails: 'Dettagli Ordine',
    packageCount: 'Numero Pacchi',
    recipientInfo: 'Informazioni Destinatario',
    senderInfo: 'Informazioni Mittente',
    downloadPdf: 'Stampa',
    downloadConfirm: 'Vuoi stampare i dettagli dell\'ordine?',
    selectOrderToView: 'Seleziona un ordine per visualizzare i dettagli',
    view_all_info: 'Visualizza tutte le info',
  }
}

export const LanguageContext = createContext<any>(null)

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false)

  useEffect(() => {
    const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('kaifa-express-language') : null
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    } else {
      const browserLang = typeof window !== 'undefined' ? (navigator.language || navigator.languages?.[0] || 'en') : 'en'
      const langCode = browserLang.split('-')[0].toLowerCase()
      setCurrentLanguage(['en', 'zh', 'it'].includes(langCode) ? langCode : 'en')
    }
    setIsLanguageLoaded(true)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kaifa-express-language', currentLanguage)
    }
  }, [currentLanguage])

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ]

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, languages, isLanguageLoaded, translations }}>
      {children}
    </LanguageContext.Provider>
  )
} 