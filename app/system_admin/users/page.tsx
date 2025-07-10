"use client"

import React, { useState } from "react";
import { useTranslation } from "../../utils/translations";
import { useEffect } from "react";

// 模拟客服账号数据
const initialServiceAccounts = [
  { id: 1, name: "客服A", email: "service1@kaifa.com" },
  { id: 2, name: "客服B", email: "service2@kaifa.com" },
];

export default function SystemAdminUsersPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // customer | service
  });
  const [message, setMessage] = useState("");
  const [serviceAccounts, setServiceAccounts] = useState(initialServiceAccounts);
  const [editId, setEditId] = useState<number|null>(null);
  const [editName, setEditName] = useState("");
  const [editPwdId, setEditPwdId] = useState<number|null>(null);
  const [newPwd, setNewPwd] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里应调用后端API添加账号
    setMessage(
      form.role === "service"
        ? t("customerServiceAccountCreated")
        : t("customerAccountCreated")
    );
    setForm({ name: "", email: "", password: "", role: "customer" });
  };

  // 删除客服账号
  const handleDelete = (id: number) => {
    setServiceAccounts(serviceAccounts.filter(acc => acc.id !== id));
  };

  // 编辑名称
  const handleEditName = (id: number, name: string) => {
    setEditId(id);
    setEditName(name);
  };
  const handleSaveName = (id: number) => {
    setServiceAccounts(serviceAccounts.map(acc => acc.id === id ? { ...acc, name: editName } : acc));
    setEditId(null);
    setEditName("");
  };

  // 修改密码
  const handleEditPwd = (id: number) => {
    setEditPwdId(id);
    setNewPwd("");
  };
  const handleSavePwd = (id: number) => {
    // 实际应调用后端API
    setEditPwdId(null);
    setNewPwd("");
    setMessage(t("passwordUpdated"));
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">{t("userManagement")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("name")}</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")}</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("password")}</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("accountType")}</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="customer">{t("customerAccount")}</option>
            <option value="service">{t("customerServiceAccount")}</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          {t("addAccount")}
        </button>
      </form>
      <hr className="my-8" />
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{t("customerServiceAccounts")}</h2>
      <ul className="divide-y divide-gray-200">
        {serviceAccounts.map(acc => (
          <li key={acc.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <span className="font-medium text-gray-900">{editId === acc.id ? (
                <input value={editName} onChange={e => setEditName(e.target.value)} className="border rounded px-2 py-1 text-sm" />
              ) : acc.name}</span>
              <span className="ml-4 text-gray-500 text-sm">{acc.email}</span>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              {editId === acc.id ? (
                <>
                  <button onClick={() => handleSaveName(acc.id)} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">{t("save")}</button>
                  <button onClick={() => setEditId(null)} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">{t("cancel")}</button>
                </>
              ) : (
                <button onClick={() => handleEditName(acc.id, acc.name)} className="px-2 py-1 bg-gray-100 text-blue-700 rounded text-xs">{t("editName")}</button>
              )}
              {editPwdId === acc.id ? (
                <>
                  <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} className="border rounded px-2 py-1 text-sm" placeholder={t("newPassword")} />
                  <button onClick={() => handleSavePwd(acc.id)} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">{t("save")}</button>
                  <button onClick={() => setEditPwdId(null)} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">{t("cancel")}</button>
                </>
              ) : (
                <button onClick={() => handleEditPwd(acc.id)} className="px-2 py-1 bg-gray-100 text-purple-700 rounded text-xs">{t("editPassword")}</button>
              )}
              <button onClick={() => handleDelete(acc.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">{t("delete")}</button>
            </div>
          </li>
        ))}
      </ul>
      {message && <div className="mt-4 text-green-600 font-medium">{message}</div>}
    </div>
  );
} 