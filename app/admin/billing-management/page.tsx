'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { 
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useTranslation } from '../../utils/translations'

export default function BillingManagementPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()

  // 检查权限 - 只允许管理员访问
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/login')
      return
    }
    if (!isLoading && user && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/dashboard')
      return
    }
  }, [isAuthenticated, user, isLoading, router])

  // ===== 付款管理相关状态和数据 =====
  type Bill = { id: string; customer: string; amount: number; dueDate: string; status: string; createdDate: string };
  const [paymentTab, setPaymentTab] = useState<string>('all');
  
  // 获取当前年月 (格式: 2024-10) - 默认显示最近期月份
  const getCurrentMonth = () => {
    // 返回最近期的月份 2025-10
    return '2025-10';
  };
  
  const [paymentMonth, setPaymentMonth] = useState<string>(getCurrentMonth()); // 月份筛选，默认当前月
  const [searchQuery, setSearchQuery] = useState<string>(''); // 搜索框
  const [currentPage, setCurrentPage] = useState<number>(1); // 当前页码
  const [itemsPerPage] = useState<number>(10); // 每页显示条数
  
  // 切换到上个月
  const gotoPreviousMonth = () => {
    // 可用的月份列表
    const availableMonths = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10'];
    const currentIndex = availableMonths.indexOf(paymentMonth);
    if (currentIndex > 0) {
      setPaymentMonth(availableMonths[currentIndex - 1]);
    }
  };
  
  // 切换到下个月
  const gotoNextMonth = () => {
    // 可用的月份列表
    const availableMonths = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10'];
    const currentIndex = availableMonths.indexOf(paymentMonth);
    if (currentIndex >= 0 && currentIndex < availableMonths.length - 1) {
      setPaymentMonth(availableMonths[currentIndex + 1]);
    }
  };
  
  const [adminBills, setAdminBills] = useState<Bill[]>([
    // 2025-01 账单 - 20条
    { id: 'B202501001', customer: 'Emma Wilson', amount: 125.5, dueDate: '2025-02-01', status: '已付', createdDate: '2025-01-01' },
    { id: 'B202501002', customer: 'Liam Chen', amount: 98.0, dueDate: '2025-02-03', status: '已付', createdDate: '2025-01-03' },
    { id: 'B202501003', customer: 'Sophia Lee', amount: 156.5, dueDate: '2025-02-05', status: '已付', createdDate: '2025-01-05' },
    { id: 'B202501004', customer: 'Noah Martinez', amount: 89.0, dueDate: '2025-02-07', status: '已付', createdDate: '2025-01-07' },
    { id: 'B202501005', customer: 'Olivia Garcia', amount: 178.5, dueDate: '2025-02-09', status: '已付', createdDate: '2025-01-09' },
    { id: 'B202501006', customer: 'James Anderson', amount: 112.0, dueDate: '2025-02-11', status: '已付', createdDate: '2025-01-11' },
    { id: 'B202501007', customer: 'Ava Thomas', amount: 145.5, dueDate: '2025-02-13', status: '已付', createdDate: '2025-01-13' },
    { id: 'B202501008', customer: 'William Taylor', amount: 92.0, dueDate: '2025-02-15', status: '已付', createdDate: '2025-01-15' },
    { id: 'B202501009', customer: 'Isabella Moore', amount: 167.5, dueDate: '2025-02-17', status: '已付', createdDate: '2025-01-17' },
    { id: 'B202501010', customer: 'Benjamin White', amount: 103.0, dueDate: '2025-02-19', status: '已付', createdDate: '2025-01-19' },
    { id: 'B202501011', customer: 'Mia Harris', amount: 134.5, dueDate: '2025-02-21', status: '已付', createdDate: '2025-01-21' },
    { id: 'B202501012', customer: 'Lucas Martin', amount: 88.0, dueDate: '2025-02-23', status: '已付', createdDate: '2025-01-23' },
    { id: 'B202501013', customer: 'Charlotte Thompson', amount: 199.5, dueDate: '2025-02-25', status: '已付', createdDate: '2025-01-25' },
    { id: 'B202501014', customer: 'Henry Jackson', amount: 76.0, dueDate: '2025-02-27', status: '已付', createdDate: '2025-01-27' },
    { id: 'B202501015', customer: 'Amelia White', amount: 158.5, dueDate: '2025-02-28', status: '已付', createdDate: '2025-01-28' },
    { id: 'B202501016', customer: 'Alexander Lewis', amount: 121.0, dueDate: '2025-02-02', status: '已付', createdDate: '2025-01-02' },
    { id: 'B202501017', customer: 'Harper Walker', amount: 93.5, dueDate: '2025-02-04', status: '已付', createdDate: '2025-01-04' },
    { id: 'B202501018', customer: 'Ethan Hall', amount: 175.0, dueDate: '2025-02-06', status: '已付', createdDate: '2025-01-06' },
    { id: 'B202501019', customer: 'Evelyn Allen', amount: 108.5, dueDate: '2025-02-08', status: '已付', createdDate: '2025-01-08' },
    { id: 'B202501020', customer: 'Michael Young', amount: 142.0, dueDate: '2025-02-10', status: '已付', createdDate: '2025-01-10' },
    
    // 2025-02 账单 - 20条
    { id: 'B202502001', customer: 'Sofia King', amount: 118.5, dueDate: '2025-03-01', status: '已付', createdDate: '2025-02-01' },
    { id: 'B202502002', customer: 'Daniel Wright', amount: 95.0, dueDate: '2025-03-03', status: '已付', createdDate: '2025-02-03' },
    { id: 'B202502003', customer: 'Emily Lopez', amount: 162.5, dueDate: '2025-03-05', status: '已付', createdDate: '2025-02-05' },
    { id: 'B202502004', customer: 'Matthew Hill', amount: 87.0, dueDate: '2025-03-07', status: '已付', createdDate: '2025-02-07' },
    { id: 'B202502005', customer: 'Elizabeth Scott', amount: 183.5, dueDate: '2025-03-09', status: '已付', createdDate: '2025-02-09' },
    { id: 'B202502006', customer: 'Joseph Green', amount: 109.0, dueDate: '2025-03-11', status: '已付', createdDate: '2025-02-11' },
    { id: 'B202502007', customer: 'Avery Adams', amount: 151.5, dueDate: '2025-03-13', status: '已付', createdDate: '2025-02-13' },
    { id: 'B202502008', customer: 'David Baker', amount: 89.0, dueDate: '2025-03-15', status: '已付', createdDate: '2025-02-15' },
    { id: 'B202502009', customer: 'Ella Nelson', amount: 172.5, dueDate: '2025-03-17', status: '已付', createdDate: '2025-02-17' },
    { id: 'B202502010', customer: 'Jackson Carter', amount: 98.0, dueDate: '2025-03-19', status: '已付', createdDate: '2025-02-19' },
    { id: 'B202502011', customer: 'Scarlett Mitchell', amount: 139.5, dueDate: '2025-03-21', status: '已付', createdDate: '2025-02-21' },
    { id: 'B202502012', customer: 'Sebastian Perez', amount: 82.0, dueDate: '2025-03-23', status: '已付', createdDate: '2025-02-23' },
    { id: 'B202502013', customer: 'Victoria Roberts', amount: 195.5, dueDate: '2025-03-25', status: '已付', createdDate: '2025-02-25' },
    { id: 'B202502014', customer: 'Jack Turner', amount: 73.0, dueDate: '2025-03-27', status: '已付', createdDate: '2025-02-27' },
    { id: 'B202502015', customer: 'Grace Phillips', amount: 164.5, dueDate: '2025-03-28', status: '已付', createdDate: '2025-02-28' },
    { id: 'B202502016', customer: 'Owen Campbell', amount: 126.0, dueDate: '2025-03-02', status: '已付', createdDate: '2025-02-02' },
    { id: 'B202502017', customer: 'Lily Parker', amount: 91.5, dueDate: '2025-03-04', status: '已付', createdDate: '2025-02-04' },
    { id: 'B202502018', customer: 'Luke Evans', amount: 179.0, dueDate: '2025-03-06', status: '已付', createdDate: '2025-02-06' },
    { id: 'B202502019', customer: 'Chloe Edwards', amount: 105.5, dueDate: '2025-03-08', status: '已付', createdDate: '2025-02-08' },
    { id: 'B202502020', customer: 'Ryan Collins', amount: 148.0, dueDate: '2025-03-10', status: '已付', createdDate: '2025-02-10' },
    
    // 2025-03 账单 - 20条
    { id: 'B202503001', customer: 'Aria Stewart', amount: 122.5, dueDate: '2025-04-01', status: '已付', createdDate: '2025-03-01' },
    { id: 'B202503002', customer: 'Aiden Morris', amount: 97.0, dueDate: '2025-04-03', status: '已付', createdDate: '2025-03-03' },
    { id: 'B202503003', customer: 'Madison Rogers', amount: 168.5, dueDate: '2025-04-05', status: '已付', createdDate: '2025-03-05' },
    { id: 'B202503004', customer: 'Grayson Reed', amount: 84.0, dueDate: '2025-04-07', status: '已付', createdDate: '2025-03-07' },
    { id: 'B202503005', customer: 'Layla Cook', amount: 189.5, dueDate: '2025-04-09', status: '已付', createdDate: '2025-03-09' },
    { id: 'B202503006', customer: 'Carter Morgan', amount: 115.0, dueDate: '2025-04-11', status: '已付', createdDate: '2025-03-11' },
    { id: 'B202503007', customer: 'Penelope Bell', amount: 147.5, dueDate: '2025-04-13', status: '已付', createdDate: '2025-03-13' },
    { id: 'B202503008', customer: 'Wyatt Murphy', amount: 86.0, dueDate: '2025-04-15', status: '已付', createdDate: '2025-03-15' },
    { id: 'B202503009', customer: 'Riley Bailey', amount: 176.5, dueDate: '2025-04-17', status: '已付', createdDate: '2025-03-17' },
    { id: 'B202503010', customer: 'Julian Rivera', amount: 99.0, dueDate: '2025-04-19', status: '已付', createdDate: '2025-03-19' },
    { id: 'B202503011', customer: 'Nora Cooper', amount: 143.5, dueDate: '2025-04-21', status: '已付', createdDate: '2025-03-21' },
    { id: 'B202503012', customer: 'Levi Richardson', amount: 79.0, dueDate: '2025-04-23', status: '已付', createdDate: '2025-03-23' },
    { id: 'B202503013', customer: 'Hannah Cox', amount: 192.5, dueDate: '2025-04-25', status: '已付', createdDate: '2025-03-25' },
    { id: 'B202503014', customer: 'Mason Howard', amount: 71.0, dueDate: '2025-04-27', status: '已付', createdDate: '2025-03-27' },
    { id: 'B202503015', customer: 'Zoe Ward', amount: 161.5, dueDate: '2025-04-30', status: '已付', createdDate: '2025-03-30' },
    { id: 'B202503016', customer: 'Isaac Torres', amount: 129.0, dueDate: '2025-04-02', status: '已付', createdDate: '2025-03-02' },
    { id: 'B202503017', customer: 'Aubrey Peterson', amount: 88.5, dueDate: '2025-04-04', status: '已付', createdDate: '2025-03-04' },
    { id: 'B202503018', customer: 'Nathan Gray', amount: 174.0, dueDate: '2025-04-06', status: '已付', createdDate: '2025-03-06' },
    { id: 'B202503019', customer: 'Bella Ramirez', amount: 102.5, dueDate: '2025-04-08', status: '已付', createdDate: '2025-03-08' },
    { id: 'B202503020', customer: 'Leo James', amount: 153.0, dueDate: '2025-04-10', status: '已付', createdDate: '2025-03-10' },
    
    // 2025-04 账单 - 20条
    { id: 'B202504001', customer: 'Lucy Watson', amount: 116.5, dueDate: '2025-05-01', status: '已付', createdDate: '2025-04-01' },
    { id: 'B202504002', customer: 'Elijah Brooks', amount: 94.0, dueDate: '2025-05-03', status: '已付', createdDate: '2025-04-03' },
    { id: 'B202504003', customer: 'Stella Kelly', amount: 171.5, dueDate: '2025-05-05', status: '已付', createdDate: '2025-04-05' },
    { id: 'B202504004', customer: 'Aaron Sanders', amount: 81.0, dueDate: '2025-05-07', status: '已付', createdDate: '2025-04-07' },
    { id: 'B202504005', customer: 'Hazel Price', amount: 186.5, dueDate: '2025-05-09', status: '已付', createdDate: '2025-04-09' },
    { id: 'B202504006', customer: 'Connor Bennett', amount: 117.0, dueDate: '2025-05-11', status: '已付', createdDate: '2025-04-11' },
    { id: 'B202504007', customer: 'Violet Wood', amount: 144.5, dueDate: '2025-05-13', status: '已付', createdDate: '2025-04-13' },
    { id: 'B202504008', customer: 'Lincoln Barnes', amount: 83.0, dueDate: '2025-05-15', status: '已付', createdDate: '2025-04-15' },
    { id: 'B202504009', customer: 'Aurora Ross', amount: 169.5, dueDate: '2025-05-17', status: '已付', createdDate: '2025-04-17' },
    { id: 'B202504010', customer: 'Hudson Henderson', amount: 96.0, dueDate: '2025-05-19', status: '已付', createdDate: '2025-04-19' },
    { id: 'B202504011', customer: 'Savannah Coleman', amount: 137.5, dueDate: '2025-05-21', status: '已付', createdDate: '2025-04-21' },
    { id: 'B202504012', customer: 'Easton Jenkins', amount: 77.0, dueDate: '2025-05-23', status: '已付', createdDate: '2025-04-23' },
    { id: 'B202504013', customer: 'Brooklyn Perry', amount: 198.5, dueDate: '2025-05-25', status: '已付', createdDate: '2025-04-25' },
    { id: 'B202504014', customer: 'Asher Powell', amount: 69.0, dueDate: '2025-05-27', status: '已付', createdDate: '2025-04-27' },
    { id: 'B202504015', customer: 'Claire Long', amount: 159.5, dueDate: '2025-05-30', status: '已付', createdDate: '2025-04-30' },
    { id: 'B202504016', customer: 'Cameron Patterson', amount: 131.0, dueDate: '2025-05-02', status: '已付', createdDate: '2025-04-02' },
    { id: 'B202504017', customer: 'Skylar Hughes', amount: 85.5, dueDate: '2025-05-04', status: '已付', createdDate: '2025-04-04' },
    { id: 'B202504018', customer: 'Colton Flores', amount: 177.0, dueDate: '2025-05-06', status: '已付', createdDate: '2025-04-06' },
    { id: 'B202504019', customer: 'Paisley Washington', amount: 107.5, dueDate: '2025-05-08', status: '已付', createdDate: '2025-04-08' },
    { id: 'B202504020', customer: 'Mateo Butler', amount: 149.0, dueDate: '2025-05-10', status: '已付', createdDate: '2025-04-10' },
    
    // 2025-05 账单 - 20条
    { id: 'B202505001', customer: 'Anna Simmons', amount: 113.5, dueDate: '2025-06-01', status: '已付', createdDate: '2025-05-01' },
    { id: 'B202505002', customer: 'Kai Foster', amount: 91.0, dueDate: '2025-06-03', status: '已付', createdDate: '2025-05-03' },
    { id: 'B202505003', customer: 'Natalie Gonzales', amount: 165.5, dueDate: '2025-06-05', status: '已付', createdDate: '2025-05-05' },
    { id: 'B202505004', customer: 'Carson Bryant', amount: 78.0, dueDate: '2025-06-07', status: '已付', createdDate: '2025-05-07' },
    { id: 'B202505005', customer: 'Samantha Alexander', amount: 191.5, dueDate: '2025-06-09', status: '已付', createdDate: '2025-05-09' },
    { id: 'B202505006', customer: 'Jaxon Russell', amount: 119.0, dueDate: '2025-06-11', status: '已付', createdDate: '2025-05-11' },
    { id: 'B202505007', customer: 'Eleanor Griffin', amount: 141.5, dueDate: '2025-06-13', status: '已付', createdDate: '2025-05-13' },
    { id: 'B202505008', customer: 'Declan Diaz', amount: 80.0, dueDate: '2025-06-15', status: '已付', createdDate: '2025-05-15' },
    { id: 'B202505009', customer: 'Caroline Hayes', amount: 173.5, dueDate: '2025-06-17', status: '已付', createdDate: '2025-05-17' },
    { id: 'B202505010', customer: 'Ezra Myers', amount: 93.0, dueDate: '2025-06-19', status: '已付', createdDate: '2025-05-19' },
    { id: 'B202505011', customer: 'Maya Ford', amount: 135.5, dueDate: '2025-06-21', status: '已付', createdDate: '2025-05-21' },
    { id: 'B202505012', customer: 'Sawyer Hamilton', amount: 74.0, dueDate: '2025-06-23', status: '已付', createdDate: '2025-05-23' },
    { id: 'B202505013', customer: 'Ruby Graham', amount: 196.5, dueDate: '2025-06-25', status: '已付', createdDate: '2025-05-25' },
    { id: 'B202505014', customer: 'Bentley Sullivan', amount: 66.0, dueDate: '2025-06-27', status: '已付', createdDate: '2025-05-27' },
    { id: 'B202505015', customer: 'Ellie Wallace', amount: 157.5, dueDate: '2025-06-30', status: '已付', createdDate: '2025-05-30' },
    { id: 'B202505016', customer: 'Theo West', amount: 133.0, dueDate: '2025-06-02', status: '已付', createdDate: '2025-05-02' },
    { id: 'B202505017', customer: 'Addison Jordan', amount: 83.5, dueDate: '2025-06-04', status: '已付', createdDate: '2025-05-04' },
    { id: 'B202505018', customer: 'Axel Owens', amount: 181.0, dueDate: '2025-06-06', status: '已付', createdDate: '2025-05-06' },
    { id: 'B202505019', customer: 'Kennedy Reynolds', amount: 104.5, dueDate: '2025-06-08', status: '已付', createdDate: '2025-05-08' },
    { id: 'B202505020', customer: 'Xavier Fisher', amount: 146.0, dueDate: '2025-06-10', status: '已付', createdDate: '2025-05-10' },
    
    // 2025-06 账单 - 20条
    { id: 'B202506001', customer: 'Genesis Ellis', amount: 110.5, dueDate: '2025-07-01', status: '已付', createdDate: '2025-06-01' },
    { id: 'B202506002', customer: 'Josiah Mason', amount: 88.0, dueDate: '2025-07-03', status: '已付', createdDate: '2025-06-03' },
    { id: 'B202506003', customer: 'Athena Dixon', amount: 163.5, dueDate: '2025-07-05', status: '已付', createdDate: '2025-06-05' },
    { id: 'B202506004', customer: 'Maverick Carr', amount: 75.0, dueDate: '2025-07-07', status: '已付', createdDate: '2025-06-07' },
    { id: 'B202506005', customer: 'Ivy Marshall', amount: 188.5, dueDate: '2025-07-09', status: '已付', createdDate: '2025-06-09' },
    { id: 'B202506006', customer: 'Roman Nichols', amount: 121.0, dueDate: '2025-07-11', status: '已付', createdDate: '2025-06-11' },
    { id: 'B202506007', customer: 'Piper Hunter', amount: 138.5, dueDate: '2025-07-13', status: '已付', createdDate: '2025-06-13' },
    { id: 'B202506008', customer: 'Silas Medina', amount: 77.0, dueDate: '2025-07-15', status: '已付', createdDate: '2025-06-15' },
    { id: 'B202506009', customer: 'Willow Romero', amount: 170.5, dueDate: '2025-07-17', status: '已付', createdDate: '2025-06-17' },
    { id: 'B202506010', customer: 'Miles Webb', amount: 90.0, dueDate: '2025-07-19', status: '已付', createdDate: '2025-06-19' },
    { id: 'B202506011', customer: 'Kinsley Tucker', amount: 132.5, dueDate: '2025-07-21', status: '已付', createdDate: '2025-06-21' },
    { id: 'B202506012', customer: 'Emmett Boyd', amount: 71.0, dueDate: '2025-07-23', status: '已付', createdDate: '2025-06-23' },
    { id: 'B202506013', customer: 'Nova Hart', amount: 194.5, dueDate: '2025-07-25', status: '已付', createdDate: '2025-06-25' },
    { id: 'B202506014', customer: 'Rhett Knight', amount: 63.0, dueDate: '2025-07-27', status: '已付', createdDate: '2025-06-27' },
    { id: 'B202506015', customer: 'Delilah Dean', amount: 154.5, dueDate: '2025-07-30', status: '已付', createdDate: '2025-06-30' },
    { id: 'B202506016', customer: 'Archer Castillo', amount: 135.0, dueDate: '2025-07-02', status: '已付', createdDate: '2025-06-02' },
    { id: 'B202506017', customer: 'Melanie Fields', amount: 80.5, dueDate: '2025-07-04', status: '已付', createdDate: '2025-06-04' },
    { id: 'B202506018', customer: 'Greyson Lynch', amount: 184.0, dueDate: '2025-07-06', status: '已付', createdDate: '2025-06-06' },
    { id: 'B202506019', customer: 'Naomi Stone', amount: 101.5, dueDate: '2025-07-08', status: '已付', createdDate: '2025-06-08' },
    { id: 'B202506020', customer: 'Weston Fuller', amount: 143.0, dueDate: '2025-07-10', status: '已付', createdDate: '2025-06-10' },
    
    // 2025-07 账单 - 20条
    { id: 'B202507001', customer: 'Quinn Howell', amount: 107.5, dueDate: '2025-08-01', status: '已付', createdDate: '2025-07-01' },
    { id: 'B202507002', customer: 'Beau Welch', amount: 85.0, dueDate: '2025-08-03', status: '已付', createdDate: '2025-07-03' },
    { id: 'B202507003', customer: 'Emilia Bates', amount: 160.5, dueDate: '2025-08-05', status: '已付', createdDate: '2025-07-05' },
    { id: 'B202507004', customer: 'Ryder Vargas', amount: 72.0, dueDate: '2025-08-07', status: '已付', createdDate: '2025-07-07' },
    { id: 'B202507005', customer: 'Iris Santiago', amount: 185.5, dueDate: '2025-08-09', status: '已付', createdDate: '2025-07-09' },
    { id: 'B202507006', customer: 'Barrett Stephens', amount: 123.0, dueDate: '2025-08-11', status: '已付', createdDate: '2025-07-11' },
    { id: 'B202507007', customer: 'Jasmine Watts', amount: 136.5, dueDate: '2025-08-13', status: '已付', createdDate: '2025-07-13' },
    { id: 'B202507008', customer: 'Felix Chandler', amount: 74.0, dueDate: '2025-08-15', status: '已付', createdDate: '2025-07-15' },
    { id: 'B202507009', customer: 'Luna Norman', amount: 167.5, dueDate: '2025-08-17', status: '已付', createdDate: '2025-07-17' },
    { id: 'B202507010', customer: 'Knox Burton', amount: 87.0, dueDate: '2025-08-19', status: '已付', createdDate: '2025-07-19' },
    { id: 'B202507011', customer: 'Vivian Holt', amount: 129.5, dueDate: '2025-08-21', status: '已付', createdDate: '2025-07-21' },
    { id: 'B202507012', customer: 'Colt Wong', amount: 68.0, dueDate: '2025-08-23', status: '已付', createdDate: '2025-07-23' },
    { id: 'B202507013', customer: 'Serenity Barker', amount: 192.5, dueDate: '2025-08-25', status: '已付', createdDate: '2025-07-25' },
    { id: 'B202507014', customer: 'Rowan Silva', amount: 60.0, dueDate: '2025-08-27', status: '已付', createdDate: '2025-07-27' },
    { id: 'B202507015', customer: 'Jade Moss', amount: 151.5, dueDate: '2025-08-31', status: '已付', createdDate: '2025-07-31' },
    { id: 'B202507016', customer: 'Beckett Holland', amount: 137.0, dueDate: '2025-08-02', status: '已付', createdDate: '2025-07-02' },
    { id: 'B202507017', customer: 'Eliana Gibbs', amount: 78.5, dueDate: '2025-08-04', status: '已付', createdDate: '2025-07-04' },
    { id: 'B202507018', customer: 'Maddox Ortega', amount: 187.0, dueDate: '2025-08-06', status: '已付', createdDate: '2025-07-06' },
    { id: 'B202507019', customer: 'Alice Lowe', amount: 98.5, dueDate: '2025-08-08', status: '已付', createdDate: '2025-07-08' },
    { id: 'B202507020', customer: 'Dawson Caldwell', amount: 140.0, dueDate: '2025-08-10', status: '已付', createdDate: '2025-07-10' },
    
    // 2025-08 账单 - 20条
    { id: 'B202508001', customer: 'Julia Nguyen', amount: 104.5, dueDate: '2025-09-01', status: '已付', createdDate: '2025-08-01' },
    { id: 'B202508002', customer: 'Tucker Manning', amount: 82.0, dueDate: '2025-09-03', status: '已付', createdDate: '2025-08-03' },
    { id: 'B202508003', customer: 'Lydia Patrick', amount: 157.5, dueDate: '2025-09-05', status: '已付', createdDate: '2025-08-05' },
    { id: 'B202508004', customer: 'Jonah Schneider', amount: 69.0, dueDate: '2025-09-07', status: '已付', createdDate: '2025-08-07' },
    { id: 'B202508005', customer: 'Valeria Dennis', amount: 182.5, dueDate: '2025-09-09', status: '已付', createdDate: '2025-08-09' },
    { id: 'B202508006', customer: 'Paxton Gregory', amount: 125.0, dueDate: '2025-09-11', status: '已付', createdDate: '2025-08-11' },
    { id: 'B202508007', customer: 'Brielle Parsons', amount: 133.5, dueDate: '2025-09-13', status: '已付', createdDate: '2025-08-13' },
    { id: 'B202508008', customer: 'Karter Klein', amount: 71.0, dueDate: '2025-09-15', status: '已付', createdDate: '2025-08-15' },
    { id: 'B202508009', customer: 'Aria Obrien', amount: 164.5, dueDate: '2025-09-17', status: '已付', createdDate: '2025-08-17' },
    { id: 'B202508010', customer: 'Cohen Mccarthy', amount: 84.0, dueDate: '2025-09-19', status: '已付', createdDate: '2025-08-19' },
    { id: 'B202508011', customer: 'Raelynn Guerrero', amount: 126.5, dueDate: '2025-09-21', status: '已付', createdDate: '2025-08-21' },
    { id: 'B202508012', customer: 'Blake Estrada', amount: 65.0, dueDate: '2025-09-23', status: '已付', createdDate: '2025-08-23' },
    { id: 'B202508013', customer: 'Peyton Cruz', amount: 189.5, dueDate: '2025-09-25', status: '已付', createdDate: '2025-08-25' },
    { id: 'B202508014', customer: 'Zane Reyes', amount: 57.0, dueDate: '2025-09-27', status: '已付', createdDate: '2025-08-27' },
    { id: 'B202508015', customer: 'Eden Harper', amount: 148.5, dueDate: '2025-09-30', status: '已付', createdDate: '2025-08-30' },
    { id: 'B202508016', customer: 'Cash Crawford', amount: 139.0, dueDate: '2025-09-02', status: '已付', createdDate: '2025-08-02' },
    { id: 'B202508017', customer: 'Gabriella Stevenson', amount: 75.5, dueDate: '2025-09-04', status: '已付', createdDate: '2025-08-04' },
    { id: 'B202508018', customer: 'Lane Olson', amount: 190.0, dueDate: '2025-09-06', status: '已付', createdDate: '2025-08-06' },
    { id: 'B202508019', customer: 'Emery Potter', amount: 95.5, dueDate: '2025-09-08', status: '已付', createdDate: '2025-08-08' },
    { id: 'B202508020', customer: 'Finley Walsh', amount: 137.0, dueDate: '2025-09-10', status: '已付', createdDate: '2025-08-10' },
    
    // 2025-09 账单 - 20条
    { id: 'B202509001', customer: 'Sage Pena', amount: 101.5, dueDate: '2025-10-01', status: '已付', createdDate: '2025-09-01' },
    { id: 'B202509002', customer: 'Kingston Francis', amount: 79.0, dueDate: '2025-10-03', status: '已付', createdDate: '2025-09-03' },
    { id: 'B202509003', customer: 'Daisy Buchanan', amount: 154.5, dueDate: '2025-10-05', status: '已付', createdDate: '2025-09-05' },
    { id: 'B202509004', customer: 'Jett Hanson', amount: 66.0, dueDate: '2025-10-07', status: '已付', createdDate: '2025-09-07' },
    { id: 'B202509005', customer: 'Harlow Dunn', amount: 179.5, dueDate: '2025-10-09', status: '已付', createdDate: '2025-09-09' },
    { id: 'B202509006', customer: 'Crew Hale', amount: 127.0, dueDate: '2025-10-11', status: '已付', createdDate: '2025-09-11' },
    { id: 'B202509007', customer: 'Gemma Bowen', amount: 130.5, dueDate: '2025-10-13', status: '已付', createdDate: '2025-09-13' },
    { id: 'B202509008', customer: 'Gunner Barton', amount: 68.0, dueDate: '2025-10-15', status: '已付', createdDate: '2025-09-15' },
    { id: 'B202509009', customer: 'Esther Singleton', amount: 161.5, dueDate: '2025-10-17', status: '已付', createdDate: '2025-09-17' },
    { id: 'B202509010', customer: 'Stetson Reid', amount: 81.0, dueDate: '2025-10-19', status: '已付', createdDate: '2025-09-19' },
    { id: 'B202509011', customer: 'Teagan Lamb', amount: 123.5, dueDate: '2025-10-21', status: '已付', createdDate: '2025-09-21' },
    { id: 'B202509012', customer: 'Ridge Crane', amount: 62.0, dueDate: '2025-10-23', status: '已付', createdDate: '2025-09-23' },
    { id: 'B202509013', customer: 'Juniper Henry', amount: 186.5, dueDate: '2025-10-25', status: '已付', createdDate: '2025-09-25' },
    { id: 'B202509014', customer: 'Dash Maxwell', amount: 54.0, dueDate: '2025-10-27', status: '已付', createdDate: '2025-09-27' },
    { id: 'B202509015', customer: 'Freya Erickson', amount: 145.5, dueDate: '2025-10-30', status: '已付', createdDate: '2025-09-30' },
    { id: 'B202509016', customer: 'Ledger Shannon', amount: 141.0, dueDate: '2025-10-02', status: '已付', createdDate: '2025-09-02' },
    { id: 'B202509017', customer: 'Oakley Wiggins', amount: 72.5, dueDate: '2025-10-04', status: '已付', createdDate: '2025-09-04' },
    { id: 'B202509018', customer: 'Remington Burns', amount: 193.0, dueDate: '2025-10-06', status: '已付', createdDate: '2025-09-06' },
    { id: 'B202509019', customer: 'Sloane Fitzgerald', amount: 92.5, dueDate: '2025-10-08', status: '已付', createdDate: '2025-09-08' },
    { id: 'B202509020', customer: 'Wilder Chang', amount: 134.0, dueDate: '2025-10-10', status: '已付', createdDate: '2025-09-10' },
    
    // 2025-10 账单 - 20条
    { id: 'B202510001', customer: 'Margot Barr', amount: 115.5, dueDate: '2025-11-01', status: '未出账', createdDate: '2025-10-01' },
    { id: 'B202510002', customer: 'Hendrix Knight', amount: 89.0, dueDate: '2025-11-03', status: '未出账', createdDate: '2025-10-03' },
    { id: 'B202510003', customer: 'Magnolia Webb', amount: 166.5, dueDate: '2025-11-05', status: '未出账', createdDate: '2025-10-05' },
    { id: 'B202510004', customer: 'Titan Frost', amount: 76.0, dueDate: '2025-11-07', status: '未出账', createdDate: '2025-10-07' },
    { id: 'B202510005', customer: 'Wren Hancock', amount: 194.5, dueDate: '2025-11-09', status: '未出账', createdDate: '2025-10-09' },
    { id: 'B202510006', customer: 'Arlo Glenn', amount: 128.0, dueDate: '2025-11-11', status: '未出账', createdDate: '2025-10-11' },
    { id: 'B202510007', customer: 'Maeve Cervantes', amount: 142.5, dueDate: '2025-11-13', status: '未出账', createdDate: '2025-10-13' },
    { id: 'B202510008', customer: 'Briggs Salazar', amount: 73.0, dueDate: '2025-11-15', status: '未出账', createdDate: '2025-10-15' },
    { id: 'B202510009', customer: 'Ophelia Strickland', amount: 175.5, dueDate: '2025-11-17', status: '未出账', createdDate: '2025-10-17' },
    { id: 'B202510010', customer: 'Bowen Morrow', amount: 91.0, dueDate: '2025-11-19', status: '未出账', createdDate: '2025-10-19' },
    { id: 'B202510011', customer: 'Thea Sweeney', amount: 131.5, dueDate: '2025-11-21', status: '未出账', createdDate: '2025-10-21' },
    { id: 'B202510012', customer: 'Cade Conley', amount: 67.0, dueDate: '2025-11-23', status: '未出账', createdDate: '2025-10-23' },
    { id: 'B202510013', customer: 'Cora Mckee', amount: 197.5, dueDate: '2025-11-25', status: '未出账', createdDate: '2025-10-25' },
    { id: 'B202510014', customer: 'Bear Vega', amount: 59.0, dueDate: '2025-11-27', status: '未出账', createdDate: '2025-10-27' },
    { id: 'B202510015', customer: 'Celeste Glover', amount: 152.5, dueDate: '2025-11-30', status: '未出账', createdDate: '2025-10-30' },
    { id: 'B202510016', customer: 'Jaxson Boyle', amount: 143.0, dueDate: '2025-11-02', status: '未出账', createdDate: '2025-10-02' },
    { id: 'B202510017', customer: 'Vera Harmon', amount: 77.5, dueDate: '2025-11-04', status: '未出账', createdDate: '2025-10-04' },
    { id: 'B202510018', customer: 'Corbin Bolton', amount: 196.0, dueDate: '2025-11-06', status: '未出账', createdDate: '2025-10-06' },
    { id: 'B202510019', customer: 'Daphne Koch', amount: 99.5, dueDate: '2025-11-08', status: '未出账', createdDate: '2025-10-08' },
    { id: 'B202510020', customer: 'Memphis Todd', amount: 138.0, dueDate: '2025-11-10', status: '未出账', createdDate: '2025-10-10' },
  ]);

  // 自动检测超期账单：账单生成后30天内若没有转为已付，则自动由"待付"转为"超期"
  useEffect(() => {
    const checkOverdueBills = () => {
      const now = new Date();
      const updatedBills = adminBills.map(bill => {
        if (bill.status === '待付') {
          const createdDate = new Date(bill.createdDate);
          const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceCreated > 30) {
            return { ...bill, status: '超期' };
          }
        }
        return bill;
      });
      
      // 只在有变化时更新状态
      const hasChanges = updatedBills.some((bill, index) => bill.status !== adminBills[index].status);
      if (hasChanges) {
        setAdminBills(updatedBills);
      }
    };

    // 初始检查
    checkOverdueBills();
    
    // 每天检查一次（可以根据需要调整频率）
    const interval = setInterval(checkOverdueBills, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [adminBills]);

  const filteredPayments = adminBills
    .filter((bill: Bill) => {
      // 状态筛选
      const statusMatch = paymentTab==='all' ? true : paymentTab==='paid' ? bill.status==='已付' : paymentTab==='unpaid' ? bill.status==='待付' : paymentTab==='overdue' ? bill.status==='超期' : true;
      
      // 月份筛选 - 只显示选中月份的账单
      const monthMatch = bill.createdDate.startsWith(paymentMonth);
      
      // 搜索筛选 - 搜索用户名或订单号
      const searchMatch = searchQuery.trim() === '' 
        ? true 
        : bill.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
          bill.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      return statusMatch && monthMatch && searchMatch;
    })
    .sort((a, b) => {
      // 默认排序：超期 > 待付 > 未出账 > 已付
      const statusPriority: Record<string, number> = {
        '超期': 1,
        '待付': 2,
        '未出账': 3,
        '已付': 4
      };
      return statusPriority[a.status] - statusPriority[b.status];
    });
  
  // 计算当前月份的统计数据
  const monthlyStats = {
    total: filteredPayments.length,
    paid: filteredPayments.filter(b => b.status === '已付').length,
    unpaid: filteredPayments.filter(b => b.status === '待付' || b.status === '超期').length
  };
  
  // 分页逻辑
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);
  
  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [paymentTab, paymentMonth, searchQuery]);
  
  const markAsPaid = (bill: Bill) => {
    setAdminBills(adminBills.map(b => b.id === bill.id ? {...b, status: '已付'} : b));
    alert(`${t('billMarkedAsPaid')||'Bill marked as paid for'} ${bill.customer}`);
  };
  
  const viewInvoice = (bill: Bill) => {
    // 查看发票功能
    alert(`查看发票: ${bill.id}\n客户: ${bill.customer}\n金额: €${bill.amount}\n到期日期: ${bill.dueDate}\n状态: ${bill.status}`);
    // 后续可以跳转到发票详情页面或打开模态框
    // router.push(`/admin/invoice/${bill.id}`);
  };
  
  const remindBill = (bill: Bill) => {
    alert(`${t('remindPaymentSent')||'Payment reminder sent to'} ${bill.customer}`);
  };

  // 账单管理区块批量操作
  const handleExportBills = () => alert('导出账单功能（占位）');
  const handleBatchRemind = () => alert('批量提醒功能（占位）');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{t('billingManagement') || '账单管理'}</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded text-xs font-semibold border bg-blue-50 border-blue-400 text-blue-700" onClick={handleExportBills}><Download className="h-4 w-4 inline" /> 导出账单</button>
              </div>
            </div>
      {/* 月份筛选器 */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="h-5 w-5 text-gray-500" />
          <label className="text-sm text-gray-700 font-medium">{t('filterByMonth') || '按月筛选'}:</label>
                  <button
            onClick={gotoPreviousMonth}
            disabled={paymentMonth === '2025-01'}
            className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            title="上个月"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </button>
          <select 
            value={paymentMonth} 
            onChange={(e) => setPaymentMonth(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2025-01">2025-01</option>
            <option value="2025-02">2025-02</option>
            <option value="2025-03">2025-03</option>
            <option value="2025-04">2025-04</option>
            <option value="2025-05">2025-05</option>
            <option value="2025-06">2025-06</option>
            <option value="2025-07">2025-07</option>
            <option value="2025-08">2025-08</option>
            <option value="2025-09">2025-09</option>
            <option value="2025-10">2025-10</option>
          </select>
                    <button
            onClick={gotoNextMonth}
            disabled={paymentMonth === '2025-10'}
            className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            title="下个月"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
          </div>

      {/* 月份统计信息 - 卡片样式 */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* 总账单数 */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm">
          <FileText className="h-5 w-5 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-xs text-blue-600 font-medium">{t('totalBills') || '总账单数'}</span>
            <span className="text-lg font-bold text-blue-900">
              {monthlyStats.total}
            </span>
              </div>
            </div>

        {/* 已付账单 */}
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-sm ${paymentMonth === '2025-10' ? 'bg-gray-100 border-gray-300 opacity-50' : 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'}`}>
          <CheckCircle className={`h-5 w-5 ${paymentMonth === '2025-10' ? 'text-gray-500' : 'text-green-600'}`} />
          <div className="flex flex-col">
            <span className={`text-xs font-medium ${paymentMonth === '2025-10' ? 'text-gray-500' : 'text-green-600'}`}>{t('paidBills') || '已付账单'}</span>
            <span className={`text-lg font-bold ${paymentMonth === '2025-10' ? 'text-gray-600' : 'text-green-900'}`}>
              {monthlyStats.paid}
            </span>
              </div>
            </div>

        {/* 未付账单 */}
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-sm ${paymentMonth === '2025-10' ? 'bg-gray-100 border-gray-300 opacity-50' : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'}`}>
          <AlertCircle className={`h-5 w-5 ${paymentMonth === '2025-10' ? 'text-gray-500' : 'text-red-600'}`} />
          <div className="flex flex-col">
            <span className={`text-xs font-medium ${paymentMonth === '2025-10' ? 'text-gray-500' : 'text-red-600'}`}>{t('unpaidBills') || '未付账单'}</span>
            <span className={`text-lg font-bold ${paymentMonth === '2025-10' ? 'text-gray-600' : 'text-red-900'}`}>
              {monthlyStats.unpaid}
            </span>
            </div>
          </div>

        {/* 一键催款按钮 */}
        <button 
          disabled={paymentMonth === '2025-10'}
          className={`px-4 py-3 rounded-lg text-sm font-semibold border shadow-sm flex items-center gap-2 transition-colors ${paymentMonth === '2025-10' ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed opacity-50' : 'bg-red-50 border-red-400 text-red-700 hover:bg-red-100'}`}
          onClick={handleBatchRemind}
        >
          <Bell className="h-5 w-5" /> 
          一键催款
        </button>
                    </div>

      {/* 搜索框 */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="输入用户或订单号搜索"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
            </div>
      <table className="min-w-full text-xs text-gray-900">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="py-2 text-left">{t('customer') || '客户'}</th>
            <th className="py-2 text-left">{t('billNo') || '账单号'}</th>
            <th className="py-2 text-left">{t('amount') || '金额'}</th>
            <th className="py-2 text-left">{t('dueDate') || '到期日期'}</th>
            <th className="py-2 text-left">{t('status') || '状态'}</th>
            <th className="py-2 text-left">{t('action') || '操作'}</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPayments.map(bill => (
            <tr key={bill.id} className="border-b last:border-0">
              <td className="py-2">{bill.customer}</td>
              <td className="py-2">{bill.id}</td>
              <td className="py-2">€{bill.amount}</td>
              <td className="py-2">{bill.dueDate}</td>
              <td className="py-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bill.status==='已付'?'bg-green-100 text-green-700':bill.status==='待付'?'bg-yellow-100 text-yellow-700':bill.status==='超期'?'bg-red-100 text-red-700':bill.status==='未出账'?'bg-gray-100 text-gray-700':'bg-gray-100 text-gray-700'}`}>{t(bill.status==='已付'?'paid':bill.status==='待付'?'unpaid':bill.status==='超期'?'overdue':bill.status) || bill.status}</span>
              </td>
              <td className="py-2">
                <div className="flex gap-2 items-center">
                  {(bill.status==='待付'||bill.status==='超期') && (
                    <button className="px-2 py-1 text-xs border border-green-500 bg-green-600 text-white rounded hover:bg-green-700" onClick={()=>markAsPaid(bill)}>{t('markAsPaid')||'标记已付'}</button>
                  )}
                  {bill.status !== '未出账' && (
                    <button 
                      className="px-2 py-1 text-xs border border-blue-500 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1" 
                      onClick={()=>viewInvoice(bill)}
                      title="查看发票"
                    >
                      <FileText className="h-3 w-3" />
                      查看发票
                    </button>
                  )}
                  {bill.status === '未出账' && <span className="px-2 py-1 text-xs text-gray-400">-</span>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-gray-600">
            显示 {startIndex + 1}-{Math.min(endIndex, filteredPayments.length)} / 共 {filteredPayments.length} 条
                      </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
                        <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // 只显示当前页附近的页码
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                          <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded text-sm transition ${
                        currentPage === page
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                          </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-1 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
                        <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
      )}
      </div>
  )
}

