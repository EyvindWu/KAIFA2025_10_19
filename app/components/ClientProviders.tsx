'use client'
import React, { useState } from 'react';
import { LanguageProvider } from '../context/LanguageContext'

export function SystemModal({ open, onClose, title, message }: { open: boolean; onClose: () => void; title?: string; message: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-xs w-full relative">
        {title && <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>}
        <div className="text-gray-700 mb-4 text-sm">{message}</div>
        <button
          onClick={onClose}
          className="w-full py-2 mt-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors focus:outline-none"
        >
          OK
        </button>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
          aria-label="Close"
        >×</button>
      </div>
    </div>
  );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>
} 