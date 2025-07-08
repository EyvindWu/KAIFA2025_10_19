import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import ClientProviders from './components/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KAIFA EXPRESS - European Logistics Platform',
  description: 'Professional logistics services for European merchants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <AuthProvider>
            <LanguageProvider>
              <div className="min-h-screen bg-[#f6f8fa]">
                <Header />
                <main>
                  {children}
                </main>
              </div>
            </LanguageProvider>
          </AuthProvider>
        </ClientProviders>
      </body>
    </html>
  )
} 