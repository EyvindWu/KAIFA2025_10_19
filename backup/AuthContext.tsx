'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'super_admin'
  avatar?: string
  permissions: string[]
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 模拟用户数据
const mockUsers = [
  {
    id: '1',
    email: 'admin@kaifa.com',
    password: 'admin123',
    name: 'System Administrator',
    role: 'super_admin' as const,
    permissions: ['system_settings', 'user_management', 'system_logs', 'database_admin', 'backup_restore'],
    avatar: '/avatars/admin.jpg'
  },
  {
    id: '2',
    email: 'manager@kaifa.com',
    password: 'manager123',
    name: 'Customer Service Manager',
    role: 'admin' as const,
    permissions: ['orders', 'customers', 'shipments', 'reports', 'billing', 'customer_service'],
    avatar: '/avatars/manager.jpg'
  },
  {
    id: '3',
    email: 'user@example.com',
    password: 'user123',
    name: 'Andy Liu',
    role: 'user' as const,
    permissions: ['own_orders', 'own_shipments'],
    avatar: '/avatars/user.jpg'
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 检查本地存储的登录状态
  useEffect(() => {
    const savedUser = localStorage.getItem('kaifa-auth-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
        localStorage.removeItem('kaifa-auth-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        avatar: foundUser.avatar,
        permissions: foundUser.permissions,
        lastLogin: new Date().toISOString()
      }
      
      setUser(userData)
      localStorage.setItem('kaifa-auth-user', JSON.stringify(userData))
      
      setIsLoading(false)
      return { success: true, message: 'Login successful', user: userData }
    } else {
      setIsLoading(false)
      return { success: false, message: 'Invalid email or password' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('kaifa-auth-user')
  }

  const checkAuth = () => {
    const savedUser = localStorage.getItem('kaifa-auth-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
        localStorage.removeItem('kaifa-auth-user')
        setUser(null)
      }
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 