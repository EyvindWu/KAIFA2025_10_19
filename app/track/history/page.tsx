'use client'

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

const orderList = [
  {
    id: '1Z999AA10123456795',
    status: 'Pending Pickup',
    summary: 'Andy Liu → Xavier, 1.8kg, Standard',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456794',
    status: 'Pending Pickup',
    summary: 'Andy Liu → Victor, 2.1kg, Express',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456793',
    status: 'In Transit',
    summary: 'Andy Liu → Tina, 3.5kg, Standard',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456792',
    status: 'In Transit',
    summary: 'Andy Liu → Rose, 0.6kg, Express',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456791',
    status: 'Delivered',
    summary: 'Andy Liu → Paul, 1.9kg, Standard',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456790',
    status: 'Delivered',
    summary: 'Andy Liu → Noah, 2.8kg, Express',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456789',
    status: 'Delivered',
    summary: 'Andy Liu → Leo, 1.5kg, Standard',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456788',
    status: 'Delivered',
    summary: 'Andy Liu → Jack, 4.2kg, Express',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456787',
    status: 'Delivered',
    summary: 'Andy Liu → Henry, 0.8kg, Standard',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456786',
    status: 'Delivered',
    summary: 'Andy Liu → Frank, 3.1kg, Express',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456785',
    status: 'Delivered',
    summary: 'Andy Liu → Dave, 1.2kg, Standard',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456784',
    status: 'Delivered',
    summary: 'Andy Liu → Bob, 2.5kg, Express',
    href: '/track/detail'
  },
  {
    id: '1Z999AA10123456783',
    status: 'Cancelled',
    summary: 'Andy Liu → Lily, 2.0kg, Standard',
    href: '/track/detail',
    recipient: 'Lily',
    createdAt: '2024-05-01',
  },
];

const statusOptions = [
  { value: 'All', label: 'All', color: 'bg-gray-100 text-gray-700' },
  { value: 'Pending Pickup', label: 'Pending Pickup', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'In Transit', label: 'In Transit', color: 'bg-blue-100 text-blue-700' },
  { value: 'Delivered', label: 'Delivered', color: 'bg-green-100 text-green-700' },
  { value: 'Cancelled', label: 'Cancelled', color: 'bg-gray-300 text-gray-600' },
];

export { orderList };
export default function OrderHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('');
  const [senderFilter, setSenderFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const recipientInputRef = useRef(null);
  const itemsPerPage = 5;
  let filteredOrders = orderList;
  if (statusFilter !== 'All') {
    filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
  }
  if (dateStart) {
    filteredOrders = filteredOrders.filter(order => order.createdAt && order.createdAt >= dateStart);
  }
  if (dateEnd) {
    filteredOrders = filteredOrders.filter(order => order.createdAt && order.createdAt <= dateEnd);
  }
  if (recipientFilter.trim()) {
    filteredOrders = filteredOrders.filter(order => order.summary && order.summary.toLowerCase().includes(recipientFilter.trim().toLowerCase()));
  }
  if (senderFilter.trim()) {
    filteredOrders = filteredOrders.filter(order => order.summary && order.summary.toLowerCase().includes(senderFilter.trim().toLowerCase()));
  }
  if (countryFilter.trim()) {
    filteredOrders = filteredOrders.filter(order => order.summary && order.summary.toLowerCase().includes(countryFilter.trim().toLowerCase()));
  }
  if (cityFilter.trim()) {
    filteredOrders = filteredOrders.filter(order => order.summary && order.summary.toLowerCase().includes(cityFilter.trim().toLowerCase()));
  }
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (statusDropdownRef.current && !(statusDropdownRef.current as any).contains(e.target)) {
        setStatusDropdownOpen(false);
      }
    }
    if (statusDropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [statusDropdownOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'In Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Pending Pickup':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full max-w-2xl">
        <Link href="/track" className="flex items-center text-blue-600 hover:underline mb-4">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Track
        </Link>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Shipment History</h1>
        <div className="flex flex-col gap-2 md:gap-3 mb-4">
          <button
            className="flex items-center gap-1 px-4 py-2 font-semibold text-base text-blue-700 bg-white border border-blue-200 rounded-xl shadow-sm hover:bg-blue-50 transition-colors w-fit"
            onClick={() => setFiltersOpen(v => !v)}
            aria-expanded={filtersOpen}
            style={{ minWidth: 120 }}
          >
            <span>Filters</span>
            {filtersOpen ? (
              <ChevronUp className="w-5 h-5 transition-transform" />
            ) : (
              <ChevronDown className="w-5 h-5 transition-transform" />
            )}
          </button>
          {filtersOpen && (
            <div className="bg-gray-50 rounded-xl p-4 mt-2">
              <div className="bg-white rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="flex-1 min-w-[240px] md:max-w-xs">
                    <label className="block text-sm text-gray-600 mb-1">Date Range</label>
                    <div className="flex items-end gap-2">
                      <input
                        type="date"
                        className="border border-gray-300 rounded px-3 py-1 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        value={dateStart}
                        onChange={e => { setDateStart(e.target.value); setCurrentPage(1); }}
                        max={dateEnd || undefined}
                      />
                      <span className="mx-1 text-gray-400">-</span>
                      <input
                        type="date"
                        className="border border-gray-300 rounded px-3 py-1 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        value={dateEnd}
                        onChange={e => { setDateEnd(e.target.value); setCurrentPage(1); }}
                        min={dateStart || undefined}
                      />
                      {(dateStart || dateEnd) && (
                        <button className="text-gray-400 hover:text-red-500 px-2" onClick={() => { setDateStart(''); setDateEnd(''); setCurrentPage(1); }} title="清除">
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="w-40 min-w-[140px]">
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <div className="relative" ref={statusDropdownRef}>
                      <button
                        type="button"
                        className="w-full border border-gray-200 rounded h-7 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        onClick={() => setStatusDropdownOpen(v => !v)}
                      >
                        <span className={`h-7 w-full flex items-center justify-center text-xs font-semibold ${statusOptions.find(o => o.value === statusFilter)?.color}`}>{statusOptions.find(o => o.value === statusFilter)?.label}</span>
                      </button>
                      {statusDropdownOpen && (
                        <div className="absolute left-0 z-30 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg p-0">
                          {statusOptions.map(option => (
                            <button
                              key={option.value}
                              className={`w-full text-left px-0 py-2 flex items-center gap-2 hover:bg-blue-50 ${option.value === statusFilter ? 'font-bold' : ''}`}
                              onClick={() => { setStatusFilter(option.value); setCurrentPage(1); setStatusDropdownOpen(false); }}
                              type="button"
                              style={{ border: 'none', boxShadow: 'none' }}
                            >
                              <span className={`h-7 w-full flex items-center justify-center text-xs font-semibold ${option.color}`}>{option.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {statusFilter !== 'All' && (
                        <button className="absolute right-2 top-1.5 text-gray-400 hover:text-red-500 px-1" onClick={() => { setStatusFilter('All'); setCurrentPage(1); }} title="清除" type="button">
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-sm text-gray-600 mb-1">Recipient</label>
                    <div className="flex gap-1">
                      <input
                        ref={recipientInputRef}
                        type="text"
                        className="border border-gray-300 rounded px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white relative z-10"
                        placeholder="Enter recipient name"
                        value={recipientFilter}
                        onChange={e => { setRecipientFilter(e.target.value); setCurrentPage(1); }}
                      />
                      {recipientFilter && (
                        <button className="text-gray-400 hover:text-red-500 px-2" onClick={() => { setRecipientFilter(''); setCurrentPage(1); }} title="清除">
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-sm text-gray-600 mb-1">Sender</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white relative z-10"
                        placeholder="Enter sender name"
                        value={senderFilter}
                        onChange={e => { setSenderFilter(e.target.value); setCurrentPage(1); }}
                      />
                      {senderFilter && (
                        <button className="text-gray-400 hover:text-red-500 px-2" onClick={() => { setSenderFilter(''); setCurrentPage(1); }} title="清除">
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 min-w-[240px] gap-2 md:mt-0 mt-2 items-end">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Country</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white relative z-10"
                        placeholder="Enter country"
                        value={countryFilter}
                        onChange={e => { setCountryFilter(e.target.value); setCurrentPage(1); }}
                      />
                      {countryFilter && (
                        <button className="text-gray-400 hover:text-red-500 px-2" onClick={() => { setCountryFilter(''); setCurrentPage(1); }} title="清除">
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">City</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white relative z-10"
                        placeholder="Enter city"
                        value={cityFilter}
                        onChange={e => { setCityFilter(e.target.value); setCurrentPage(1); }}
                      />
                      {cityFilter && (
                        <button className="text-gray-400 hover:text-red-500 px-2" onClick={() => { setCityFilter(''); setCurrentPage(1); }} title="清除">
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-blue-50 rounded-xl mb-6">
          <div className="border-t border-gray-200"></div>
          <ul className="divide-y divide-gray-200 bg-white rounded-xl">
          {currentOrders.map(order => (
              <li key={order.id} className="relative">
              <Link
                href={`/track/detail/${order.id}`}
                className="block py-4 px-2 hover:bg-blue-50 transition-colors"
              >
                  <span className={`absolute top-0 right-4 h-7 w-24 flex items-center justify-center text-xs font-semibold ${getStatusColor(order.status)} z-10`}>{order.status}</span>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-base text-gray-800">{order.id}</span>
                </div>
                <div className="text-sm text-gray-500">{order.summary}</div>
              </Link>
            </li>
          ))}
        </ul>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} shipments
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-black"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-black"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 