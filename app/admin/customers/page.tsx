'use client'

import React, { useState } from 'react'
import { 
  Users,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Save,
  Building2,
  Phone,
  Mail,
  CreditCard,
  UserCheck,
  UserX,
  X
} from 'lucide-react'
import { useTranslation } from '../../utils/translations'

export default function CustomersPage() {
  const { t } = useTranslation();
  
  // 用户管理状态
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserGroup, setSelectedUserGroup] = useState('all');
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // 价格组/费率组定义
  const priceGroups = [
    { id: 'group40', name: '40%组', discount: 40, description: '享受40%折扣' },
    { id: 'group50', name: '50%组', discount: 50, description: '享受50%折扣' }
  ];

  // 用户数据
  const [users, setUsers] = useState([
    {
      id: 'U001',
      username: 'andy.liu',
      fullName: 'Andy Liu',
      email: 'andy.liu@example.com',
      phone: '+49 176 12345678',
      company: 'Liu Trading GmbH',
      priceGroup: 'group40',
      status: 'active',
      registeredDate: '2023-05-10',
      totalOrders: 45,
      totalSpent: 2350.50,
      address: 'Musterstraße 123, 10115 Berlin'
    },
    {
      id: 'U002',
      username: 'maria.schneider',
      fullName: 'Maria Schneider',
      email: 'maria@schneider-logistics.de',
      phone: '+49 30 98765432',
      company: 'Schneider Logistics',
      priceGroup: 'group50',
      status: 'active',
      registeredDate: '2023-03-15',
      totalOrders: 128,
      totalSpent: 8920.30,
      address: 'Hauptstraße 45, 20095 Hamburg'
    },
    {
      id: 'U003',
      username: 'john.doe',
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+49 89 11223344',
      company: '',
      priceGroup: 'group40',
      status: 'active',
      registeredDate: '2024-01-05',
      totalOrders: 12,
      totalSpent: 560.00,
      address: 'Bahnhofstraße 78, 80335 München'
    },
    {
      id: 'U004',
      username: 'lisa.mueller',
      fullName: 'Lisa Müller',
      email: 'lisa.mueller@premium-shop.de',
      phone: '+49 221 55667788',
      company: 'Premium Shop',
      priceGroup: 'group50',
      status: 'active',
      registeredDate: '2022-11-20',
      totalOrders: 256,
      totalSpent: 15680.75,
      address: 'Kölner Straße 12, 50667 Köln'
    },
    {
      id: 'U005',
      username: 'thomas.weber',
      fullName: 'Thomas Weber',
      email: 'thomas@weber-import.de',
      phone: '+49 711 99887766',
      company: 'Weber Import GmbH',
      priceGroup: 'group50',
      status: 'active',
      registeredDate: '2023-07-18',
      totalOrders: 89,
      totalSpent: 4520.20,
      address: 'Stuttgarter Platz 5, 70173 Stuttgart'
    },
    {
      id: 'U006',
      username: 'sarah.klein',
      fullName: 'Sarah Klein',
      email: 'sarah.klein@gmail.com',
      phone: '+49 69 33445566',
      company: '',
      priceGroup: 'group40',
      status: 'inactive',
      registeredDate: '2023-09-10',
      totalOrders: 3,
      totalSpent: 125.50,
      address: 'Mainzer Landstraße 200, 60326 Frankfurt'
    }
  ]);

  // 用户筛选逻辑
  const filteredUsers = users.filter(user => {
    // 搜索筛选
    if (userSearch) {
      const searchLower = userSearch.toLowerCase();
      const matchSearch = 
        user.fullName.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower) ||
        (user.company && user.company.toLowerCase().includes(searchLower));
      if (!matchSearch) return false;
    }
    
    // 分组筛选
    if (selectedUserGroup !== 'all' && user.priceGroup !== selectedUserGroup) {
      return false;
    }
    
    return true;
  });

  // 更改用户分组
  const handleChangeUserGroup = (userId: string, newGroup: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, priceGroup: newGroup } : u
    ));
  };

  // 编辑用户
  const handleEditUser = (user: any) => {
    setEditingUser({ ...user });
    setIsEditUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? editingUser : u
      ));
      setIsEditUserModalOpen(false);
      setEditingUser(null);
    }
  };

  // 新建用户
  const handleCreateUser = (newUser: any) => {
    const userId = `U${String(users.length + 1).padStart(3, '0')}`;
    setUsers([...users, { 
      ...newUser, 
      id: userId,
      totalOrders: 0,
      totalSpent: 0,
      registeredDate: new Date().toISOString().split('T')[0]
    }]);
    setIsCreateUserModalOpen(false);
  };

  // 删除用户
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('确定要删除此用户吗？此操作不可撤销。')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <section className="space-y-6">
      {/* 用户管理模块 */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              用户管理
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                {filteredUsers.length} 用户
              </span>
            </h3>
            
            {/* 新建用户按钮 */}
            <button
              onClick={() => setIsCreateUserModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <UserPlus className="h-4 w-4" />
              新建用户
            </button>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 搜索框 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Search className="h-4 w-4 inline mr-1" />
                搜索用户
              </label>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="请输入用户名、邮箱、公司名或用户ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* 价格组筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CreditCard className="h-4 w-4 inline mr-1" />
                价格组筛选
              </label>
              <select
                value={selectedUserGroup}
                onChange={(e) => setSelectedUserGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">全部分组</option>
                {priceGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.discount}% 折扣)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">用户ID</th>
                <th className="px-6 py-3">用户信息</th>
                <th className="px-6 py-3">联系方式</th>
                <th className="px-6 py-3">价格组</th>
                <th className="px-6 py-3">订单统计</th>
                <th className="px-6 py-3">状态</th>
                <th className="px-6 py-3">注册日期</th>
                <th className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const group = priceGroups.find(g => g.id === user.priceGroup);
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    {/* 用户ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{user.id}</div>
                    </td>
                    
                    {/* 用户信息 */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-xs text-gray-500">@{user.username}</div>
                      {user.company && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Building2 className="h-3 w-3" />
                          {user.company}
                        </div>
                      )}
                    </td>
                    
                    {/* 联系方式 */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-900 flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {user.phone}
                      </div>
                    </td>
                    
                    {/* 价格组（可调整） */}
                    <td className="px-6 py-4">
                      <select
                        value={user.priceGroup}
                        onChange={(e) => handleChangeUserGroup(user.id, e.target.value)}
                        className="text-sm px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {priceGroups.map(g => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                      <div className="text-xs text-gray-500 mt-1">
                        {group?.discount}% 折扣
                      </div>
                    </td>
                    
                    {/* 订单统计 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.totalOrders} 单</div>
                      <div className="text-xs text-gray-500">€{user.totalSpent.toFixed(2)}</div>
                    </td>
                    
                    {/* 状态 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status === 'active' ? (
                          <>
                            <UserCheck className="h-3 w-3" />
                            活跃
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3" />
                            停用
                          </>
                        )}
                      </span>
                    </td>
                    
                    {/* 注册日期 */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.registeredDate}
                    </td>
                    
                    {/* 操作按钮 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {/* 删除用户 */}
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="删除用户"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">未找到符合条件的用户</p>
            </div>
          )}
        </div>
      </div>

      {/* 编辑用户弹窗 */}
      {isEditUserModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                编辑用户信息
              </h3>
              <button 
                onClick={() => {
                  setIsEditUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* 弹窗内容 */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 用户名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* 全名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    全名
                  </label>
                  <input
                    type="text"
                    value={editingUser.fullName}
                    onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* 邮箱 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* 电话 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    电话
                  </label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* 公司 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    公司名称
                  </label>
                  <input
                    type="text"
                    value={editingUser.company}
                    onChange={(e) => setEditingUser({...editingUser, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* 价格组 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    价格组
                  </label>
                  <select
                    value={editingUser.priceGroup}
                    onChange={(e) => setEditingUser({...editingUser, priceGroup: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {priceGroups.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name} - {g.description}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 状态 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    账号状态
                  </label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">活跃</option>
                    <option value="inactive">停用</option>
                  </select>
                </div>
                
                {/* 地址 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    地址
                  </label>
                  <input
                    type="text"
                    value={editingUser.address}
                    onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* 弹窗底部 */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                取消
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新建用户弹窗 */}
      {isCreateUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-purple-600" />
                新建用户账号
              </h3>
              <button
                onClick={() => setIsCreateUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* 弹窗内容 */}
            <div className="px-6 py-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateUser({
                  username: formData.get('username'),
                  fullName: formData.get('fullName'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  company: formData.get('company'),
                  priceGroup: formData.get('priceGroup'),
                  status: 'active',
                  address: formData.get('address')
                });
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 用户名 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      用户名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      required
                      placeholder="例如: john.doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  {/* 全名 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      全名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="例如: John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  {/* 邮箱 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      邮箱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="例如: john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  {/* 电话 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      电话 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="例如: +49 176 12345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  {/* 公司 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      公司名称
                    </label>
                    <input
                      type="text"
                      name="company"
                      placeholder="选填"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  {/* 价格组 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      价格组 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="priceGroup"
                      defaultValue="standard"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {priceGroups.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.name} - {g.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 地址 */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      地址 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="例如: Musterstraße 123, 10115 Berlin"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                {/* 弹窗底部 */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateUserModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    创建用户
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

