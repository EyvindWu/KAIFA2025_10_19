'use client'
import React from 'react';
import { useTranslation } from '../../utils/translations';

export default function Guide() {
  const { t } = useTranslation();
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4 text-black">{t('userGuide')}</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-black">{t('howToUse')}</h2>
        <ol className="list-decimal pl-6 text-black space-y-1">
          <li>{t('registerOrLogin')}</li>
          <li>{t('fillSenderRecipient')}</li>
          <li>{t('chooseServiceAndPackage')}</li>
          <li>{t('submitOrderAndPay')}</li>
          <li>{t('trackShipment')}</li>
        </ol>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2 text-black">{t('faq')}</h2>
        <ul className="list-disc pl-6 text-black space-y-1">
          <li>{t('faqTrackOrder')}</li>
          <li>{t('faqShippingOptions')}</li>
          <li>{t('faqContactCustomerService')}</li>
          <li>{t('faqChangeAddress')}</li>
        </ul>
      </div>
    </div>
  );
} 