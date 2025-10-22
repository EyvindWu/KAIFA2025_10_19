'use client'

import React, { useEffect, useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building, 
  Phone, 
  Mail, 
  FileText,
  AlertCircle,
  Search,
  Filter,
  Eye,
  X
} from 'lucide-react';

interface MonthlyRequest {
  id: number;
  name: string; // 企业名称
  piva: string; // 登记税号 (P.IVA) - 11位数字
  phone: string; // 联系电话
  email: string; // 邮箱地址
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectReason?: string;
}

export default function MonthlyBillingRequests() {
  const [requests, setRequests] = useState<MonthlyRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MonthlyRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<MonthlyRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [requestToReject, setRequestToReject] = useState<number | null>(null);

  useEffect(() => {
    // 示例数据：包含待审核、已通过、已拒绝的申请
    const demoRequests: MonthlyRequest[] = [
      {
        id: 1001,
        name: 'Andy Liu Import Export',
        piva: 'DE987654321',
        phone: '+49 40 87654321',
        email: 'andy.liu@example.com',
        status: 'pending',
        createdAt: '2025-01-20 14:20:00'
      },
      {
        id: 1002,
        name: 'Chen Global Logistics',
        piva: 'DE456789123',
        phone: '+49 89 98765432',
        email: 'lisa.chen@example.com',
        status: 'pending',
        createdAt: '2025-01-22 09:15:00'
      },
      {
        id: 1003,
        name: 'Tony Leung Trading Co.',
        piva: 'DE123456789',
        phone: '+49 30 12345678',
        email: 'tony.leung@example.com',
        status: 'approved',
        createdAt: '2025-01-15 10:30:00',
        approvedAt: '2025-01-15 15:45:00'
      },
      {
        id: 1004,
        name: 'Zhang Wei Industries',
        piva: 'DE555666777',
        phone: '+49 69 11223344',
        email: 'zhang.wei@example.com',
        status: 'approved',
        createdAt: '2025-01-10 08:20:00',
        approvedAt: '2025-01-11 10:00:00'
      },
      {
        id: 1005,
        name: 'Wang Fang Export',
        piva: 'DE999888777',
        phone: '+49 211 55667788',
        email: 'wang.fang@example.com',
        status: 'rejected',
        createdAt: '2025-01-18 16:30:00',
        rejectedAt: '2025-01-19 09:20:00',
        rejectReason: '提供的税号信息无法验证，请重新提交正确的企业税号'
      }
    ];
    
    setRequests(demoRequests);
    setFilteredRequests(demoRequests);
  }, []);

  // 筛选逻辑
  useEffect(() => {
    let filtered = requests;

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(req =>
        req.name.toLowerCase().includes(term) ||
        req.email.toLowerCase().includes(term) ||
        req.phone.includes(term) ||
        req.piva.includes(term)
      );
    }

    setFilteredRequests(filtered);
  }, [statusFilter, searchTerm, requests]);

  const handleApprove = (id: number) => {
    const reqs = requests.map(r => 
      r.id === id 
        ? { ...r, status: 'approved' as const, approvedAt: new Date().toISOString() } 
        : r
    );
    setRequests(reqs);
    localStorage.setItem('kaifa-monthly-requests', JSON.stringify(reqs));
    setSelectedRequest(null);
  };

  const handleRejectClick = (id: number) => {
    setRequestToReject(id);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (requestToReject === null) return;
    
    const reqs = requests.map(r => 
      r.id === requestToReject 
        ? { 
            ...r, 
            status: 'rejected' as const, 
            rejectedAt: new Date().toISOString(),
            rejectReason: rejectReason || '未填写原因'
          } 
        : r
    );
    setRequests(reqs);
    localStorage.setItem('kaifa-monthly-requests', JSON.stringify(reqs));
    setShowRejectModal(false);
    setRejectReason('');
    setRequestToReject(null);
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
            <Clock className="h-3 w-3" />
            待审核
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
            <CheckCircle className="h-3 w-3" />
            已开通
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
            <XCircle className="h-3 w-3" />
            已拒绝
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-blue-600" />
            月结审核管理
          </h1>
          <p className="text-sm text-gray-600 mt-1">审核企业客户的月结账单申请</p>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400" />
          
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)} 
            className="border border-gray-300 px-3 py-2 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全部状态</option>
            <option value="pending">待审核</option>
            <option value="approved">已开通</option>
            <option value="rejected">已拒绝</option>
          </select>
          
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索客户名称、邮箱、电话或税号" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          </div>
        </div>
      </div>

      {/* 申请列表 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申请人信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  企业税号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  联系方式
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <ClipboardCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">暂无申请记录</p>
                  </td>
                </tr>
              )}
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{req.name}</div>
                        <div className="text-xs text-gray-500">{req.createdAt || '申请时间未记录'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">{req.piva}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      {req.phone}
                    </div>
                    <div className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3 text-blue-400" />
                      {req.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      查看详情
                    </button>
                    <div className="inline-flex gap-2 mt-2">
                      <button 
                        className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                          req.status === 'pending' 
                            ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50' 
                            : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                        }`}
                        onClick={() => req.status === 'pending' && handleApprove(req.id)}
                        disabled={req.status !== 'pending'}
                      >
                        <CheckCircle className="h-3 w-3" />
                        通过
                      </button>
                      <button 
                        className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                          req.status === 'pending' 
                            ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50' 
                            : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                        }`}
                        onClick={() => req.status === 'pending' && handleRejectClick(req.id)}
                        disabled={req.status !== 'pending'}
                      >
                        <XCircle className="h-3 w-3" />
                        拒绝
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-blue-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                月结申请详情
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* 弹窗内容 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">企业名称</label>
                  <p className="text-gray-900 mt-1 text-lg font-semibold">{selectedRequest.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">企业税号 (P.IVA)</label>
                  <p className="text-gray-900 mt-1 font-mono bg-gray-50 px-3 py-2 rounded-lg">{selectedRequest.piva}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">联系电话</label>
                  <p className="text-gray-900 mt-1">{selectedRequest.phone}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">邮箱地址</label>
                  <p className="text-blue-600 mt-1">{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">申请状态</label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">申请时间</label>
                  <p className="text-gray-900 mt-1">{selectedRequest.createdAt || '未记录'}</p>
                </div>
                {selectedRequest.approvedAt && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-green-600">审批通过时间</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.approvedAt}</p>
                  </div>
                )}
                {selectedRequest.rejectedAt && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-red-600">拒绝时间</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.rejectedAt}</p>
                  </div>
                )}
                {selectedRequest.rejectReason && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-red-600">拒绝原因</label>
                    <p className="text-gray-900 mt-1 bg-red-50 p-3 rounded-lg border border-red-200">{selectedRequest.rejectReason}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* 弹窗底部操作 */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              {selectedRequest.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleRejectClick(selectedRequest.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    拒绝申请
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    通过申请
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  关闭
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 拒绝原因弹窗 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                拒绝申请
              </h3>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                请填写拒绝原因（选填）
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="例如：税号信息不符、资料不完整等..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setRequestToReject(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                取消
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                确认拒绝
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

