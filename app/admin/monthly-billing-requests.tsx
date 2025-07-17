import React, { useEffect, useState } from 'react';

export default function MonthlyBillingRequests() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const reqs = JSON.parse(localStorage.getItem('kaifa-monthly-requests') || '[]');
    setRequests(reqs);
  }, []);

  const handleApprove = (id: number) => {
    const reqs = requests.map(r => r.id === id ? { ...r, status: 'approved' } : r);
    setRequests(reqs);
    localStorage.setItem('kaifa-monthly-requests', JSON.stringify(reqs));
  };
  const handleReject = (id: number) => {
    const reqs = requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r);
    setRequests(reqs);
    localStorage.setItem('kaifa-monthly-requests', JSON.stringify(reqs));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">月结申请管理</h1>
        <table className="min-w-full border text-sm mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">姓名</th>
              <th className="border px-2 py-1">P.IVA</th>
              <th className="border px-2 py-1">电话号</th>
              <th className="border px-2 py-1">邮箱号</th>
              <th className="border px-2 py-1">状态</th>
              <th className="border px-2 py-1">操作</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr><td colSpan={6} className="text-center text-gray-400 py-4">暂无申请</td></tr>
            )}
            {requests.map(req => (
              <tr key={req.id}>
                <td className="border px-2 py-1">{req.name}</td>
                <td className="border px-2 py-1">{req.piva}</td>
                <td className="border px-2 py-1">{req.phone}</td>
                <td className="border px-2 py-1">{req.email}</td>
                <td className="border px-2 py-1">
                  {req.status === 'pending' && <span className="text-yellow-600">待审核</span>}
                  {req.status === 'approved' && <span className="text-green-600">已开通</span>}
                  {req.status === 'rejected' && <span className="text-red-600">已拒绝</span>}
                </td>
                <td className="border px-2 py-1">
                  {req.status === 'pending' && (
                    <>
                      <button className="px-2 py-1 bg-green-600 text-white rounded mr-2" onClick={()=>handleApprove(req.id)}>通过</button>
                      <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={()=>handleReject(req.id)}>拒绝</button>
                    </>
                  )}
                  {req.status !== 'pending' && <span className="text-gray-400">--</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 