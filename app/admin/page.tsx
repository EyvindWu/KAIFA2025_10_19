'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function AdminRootRedirect() {
  const router = useRouter()
  const { user } = useAuth()
  useEffect(() => {
    if (user?.email === 'admin@kaifa.com') {
      router.replace('/system_admin/dashboard')
    } else {
      router.replace('/')
    }
  }, [router, user])
  return null
} 