'use client'
import React from 'react';
import { FaWhatsapp, FaWeixin, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useTranslation } from '../../utils/translations';

export default function ContactCustomerService() {
  const { t } = useTranslation();
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4 text-black">{t('contactCustomerService')}</h1>
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2">
          <FaWhatsapp className="text-green-500 w-5 h-5" />
          <a href="https://wa.me/391234567890" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">+39 1234567890</a>
        </div>
        <div className="flex items-center gap-2">
          <FaWeixin className="text-green-600 w-5 h-5" />
          <a href="https://weixin.qq.com/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">+39 1234567890</a>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone className="text-blue-500 w-5 h-5" />
          <a href="tel:+391234567890" className="text-blue-600 underline">+39 1234567890</a>
        </div>
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-gray-500 w-5 h-5" />
          <a href="mailto:kaifa-express@example.com" className="text-blue-600 underline">kaifa-express@example.com</a>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-black">{t('howCanWeHelp')}</h2>
        <ul className="list-disc pl-6 text-black space-y-1">
          <li>{t('orderStatusAndTracking')}</li>
          <li>{t('shippingAndDelivery')}</li>
          <li>{t('accountAndBilling')}</li>
          <li>{t('feedbackAndSuggestions')}</li>
        </ul>
      </div>
    </div>
  );
} 