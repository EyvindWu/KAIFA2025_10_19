"use client";

import React, { useState } from 'react';
import { Clock, Share2, X, ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslation } from '../../../utils/translations';
import Link from 'next/link';
import { personInfoMap, buildTimeline } from './utils';
import { orderList } from '../../history/orderList';

// 统一sender/recipient类型，兼容mock和自动生成
interface Person {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const orders: {
  trackingNumber: string;
  status: string;
  sender: Person;
  recipient: Person;
  timeline: any[];
  package: any;
}[] = [
  {
    trackingNumber: '1Z999AA10123456784',
    status: 'In Transit',
    sender: {
      name: 'Alice Smith',
      email: 'alice.smith@email.com',
      phone: '+49 111222333',
      address: 'Aliceweg 10',
      city: 'Hamburg',
      postalCode: '20095',
      country: 'Germany',
    },
    recipient: {
      name: 'Bob Lee',
      email: 'bob.lee@email.com',
      phone: '+49 444555666',
      address: 'Bobstrasse 22',
      city: 'Frankfurt',
      postalCode: '60311',
      country: 'Germany',
    },
    timeline: [
      { time: '2024-05-01 14:32', location: 'Frankfurt, Germany', status: 'In Transit', desc: 'Departed from facility' },
      { time: '2024-04-30 09:10', location: 'Berlin, Germany', status: 'Picked Up', desc: 'Package picked up by carrier' },
      { time: '2024-04-29 18:00', location: 'Berlin, Germany', status: 'Label Created', desc: 'Shipping label created' },
    ],
    package: {
      packageType: 'Electronics',
      weight: '2.5',
      length: '30',
      width: '20',
      height: '15',
      description: 'Bluetooth Speaker',
      serviceType: 'Next Day Air',
      insurance: 'Yes (insured up to €200)',
      needsPallet: 'No',
      palletSize: '',
      trackingUrl: 'https://www.ups.com/track?loc=en_US&tracknum=1Z999AA10123456784',
    }
  },
  {
    trackingNumber: '1Z999AA10123456785',
    status: 'Delivered',
    sender: {
      name: 'Carol Wang',
      email: 'carol.wang@email.com',
      phone: '+49 777888999',
      address: 'Carolplatz 5',
      city: 'Stuttgart',
      postalCode: '70173',
      country: 'Germany',
    },
    recipient: {
      name: 'Dave Miller',
      email: 'dave.miller@email.com',
      phone: '+49 222333444',
      address: 'Davestreet 5',
      city: 'Cologne',
      postalCode: '50667',
      country: 'Germany',
    },
    timeline: [
      { time: '2024-05-02 10:00', location: 'Cologne, Germany', status: 'Delivered', desc: 'Package delivered to recipient' },
      { time: '2024-05-01 16:00', location: 'Frankfurt, Germany', status: 'In Transit', desc: 'Departed from facility' },
      { time: '2024-04-30 12:00', location: 'Munich, Germany', status: 'Picked Up', desc: 'Package picked up by carrier' },
    ],
    package: {
      packageType: 'Books',
      weight: '1.2',
      length: '20',
      width: '15',
      height: '10',
      description: '3 x Programming Books',
      serviceType: 'Standard',
      insurance: 'No',
      needsPallet: 'No',
      palletSize: '',
      trackingUrl: 'https://www.ups.com/track?loc=en_US&tracknum=1Z999AA10123456785',
    }
  }
];

// 订单状态和服务类型英文→key映射表
const statusKeyMap: { [key: string]: string } = {
  "Pending Pickup": "pendingPickup",
  "In Transit": "inTransit",
  "Picked Up": "pickedUp",
  "Delivered": "delivered",
  "Cancelled": "cancelled",
  "Exception": "exception",
};
const serviceTypeKeyMap: { [key: string]: string } = {
  "Standard": "standardDelivery",
  "Express": "expressDelivery",
  "Next Day Air": "nextDayAir",
};
const yesNoKeyMap: { [key: string]: string } = {
  "Yes": "yes",
  "No": "no",
};

// 时间线状态和描述英文→key映射表
const timelineStatusKeyMap: { [key: string]: string } = {
  "Pending Pickup": "pendingPickup",
  "In Transit": "inTransit",
  "Picked Up": "pickedUp",
  "Delivered": "delivered",
  "Out for Delivery": "outForDelivery",
  "Exception": "exception",
  "Cancelled": "cancelled",
  "Label Created": "labelCreated",
  "Order Placed": "orderPlaced",
};
const timelineDescKeyMap: { [key: string]: string } = {
  "Departed from facility": "departedFromFacility",
  "Package picked up by carrier": "packagePickedUpByCarrier",
  "Shipping label created": "shippingLabelCreated",
  "Package delivered to recipient": "packageDeliveredToRecipient",
  "Package delivered to recipient.": "packageDeliveredToRecipient",
  "Order has been placed and is awaiting processing.": "orderPlacedDesc",
  "Order is ready for pickup by the carrier.": "readyForPickup",
  "Package is in transit to destination.": "inTransitToDestination",
  "Package is out for delivery to recipient.": "outForDelivery",
};
timelineDescKeyMap["Package picked up by carrier."] = "packagePickedUpByCarrier";

export default function TrackOrderDetail() {
  const params = useParams();
  const trackingNo = params?.trackingNo as string;
  const { t } = useTranslation();
  // 直接用orderList.find(o => o.id === trackingNo)获取详细结构
  const order = orderList.find(o => o.id === trackingNo);
  let senderName = '', recipientName = '', weight = '', service = '';
  if (order && order.summary) {
    const match = order.summary.match(/^(.*?) → (.*?)(,|，)\s*([\d.]+kg),\s*(.*)$/);
    if (match) {
      senderName = match[1].trim();
      recipientName = match[2].trim();
      weight = match[4].trim();
      service = match[5].trim();
    }
  }
  // 优先查找详细信息
  const senderInfo = personInfoMap[senderName] || { name: senderName, email: '-', phone: '-', address: '-', city: '-', postalCode: '-', country: '-' };
  const recipientInfo = personInfoMap[recipientName] || { name: recipientName, email: '-', phone: '-', address: '-', city: '-', postalCode: '-', country: '-' };
  const orderDetails = {
    trackingNumber: trackingNo,
    status: order?.status || 'Pending Pickup',
    sender: senderInfo,
    recipient: recipientInfo,
    timeline: buildTimeline(order?.status || 'Pending Pickup'),
    package: {
      packageType: service !== '' ? service : 'Standard',
      weight: weight !== '' ? weight : '2.0',
      length: '30',
      width: '20',
      height: '15',
      description: order?.summary || 'No description available',
      serviceType: service !== '' ? service : 'Express',
      insurance: 'Yes (insured up to €200)',
      needsPallet: 'No',
      palletSize: '',
      trackingUrl: 'https://www.ups.com/track?loc=en_US&tracknum=' + trackingNo,
    }
  };
  const [showAll, setShowAll] = useState(false);
  const [showShare, setShowShare] = useState(false);

  React.useEffect(() => {
    if (!showShare) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.closest('.share-popover') || target.closest('.share-btn'))) return;
      setShowShare(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showShare]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 w-full max-w-xl md:max-w-2xl relative">
        <Link href="/track/history" className="flex items-center text-blue-600 hover:underline mb-4">
          <ArrowLeft className="h-5 w-5 mr-1" />
          {t('backToOrderHistory')}
        </Link>
        {/* 删除最上方的“订单详情”标题 */}
        <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-gray-500 text-sm">{t('orderNumber')}</div>
            <div className="font-mono text-lg font-bold text-gray-900 truncate">{orderDetails.trackingNumber}</div>
          </div>
          <div className="flex-shrink-0 mt-2 md:mt-0 flex items-center gap-2">
            <span
              className={
                `inline-block px-3 py-1 rounded-full font-semibold text-base ` +
                (order.status === 'Delivered'
                  ? 'bg-green-100 text-green-700'
                  : order.status === 'In Transit'
                  ? 'bg-blue-100 text-blue-700'
                  : order.status === 'Pending Pickup'
                  ? 'bg-yellow-100 text-yellow-700'
                  : order.status === 'Exception'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700')
              }
            >
              {t(statusKeyMap[order.status] || order.status)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-bold text-gray-700 mb-1">{t('sender')}</div>
            <div className="text-sm text-gray-800">{orderDetails.sender.name}</div>
            <div className="text-xs text-gray-500">{t('email')}: {orderDetails.sender.email}</div>
            <div className="text-xs text-gray-500">{t('phone')}: {orderDetails.sender.phone}</div>
            <div className="text-xs text-gray-500">{t('address')}: {orderDetails.sender.address}</div>
            <div className="text-xs text-gray-500">{t('city')}: {orderDetails.sender.city}</div>
            <div className="text-xs text-gray-500">{t('postalCode')}: {orderDetails.sender.postalCode}</div>
            <div className="text-xs text-gray-500">{t('country')}: {t(orderDetails.sender.country.toLowerCase())}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-bold text-gray-700 mb-1">{t('recipient')}</div>
            <div className="text-sm text-gray-800">{orderDetails.recipient.name}</div>
            <div className="text-xs text-gray-500">{t('email')}: {orderDetails.recipient.email}</div>
            <div className="text-xs text-gray-500">{t('phone')}: {orderDetails.recipient.phone}</div>
            <div className="text-xs text-gray-500">{t('address')}: {orderDetails.recipient.address}</div>
            <div className="text-xs text-gray-500">{t('city')}: {orderDetails.recipient.city}</div>
            <div className="text-xs text-gray-500">{t('postalCode')}: {orderDetails.recipient.postalCode}</div>
            <div className="text-xs text-gray-500">{t('country')}: {t(orderDetails.recipient.country.toLowerCase())}</div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center">
              <span className="block w-1.5 h-6 bg-blue-600 rounded mr-2"></span>
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-bold text-2xl text-blue-700">{t('orderDetails')}</span>
            </div>
            <div className="flex gap-2">
              {(() => {
                const now = new Date();
                const orderDate = order.createdAt ? new Date(order.createdAt) : null;
                let isShareDisabled = false;
                let disableReason = '';
                
                // 已取消或失败的订单
                if (['Cancelled', 'Exception'].includes(order.status)) {
                  isShareDisabled = true;
                  disableReason = '已取消或失败的订单不提供分享功能';
                }
                // Delivered状态：检查是否超过30天
                else if (order.status === 'Delivered' && orderDate) {
                  const daysSinceDelivery = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
                  if (daysSinceDelivery > 30) {
                    isShareDisabled = true;
                    disableReason = '包裹签收超过30天，分享链接已失效';
                  }
                }
                // Pending Pickup 和 In Transit 状态：允许分享
                else if (['Pending Pickup', 'In Transit'].includes(order.status)) {
                  isShareDisabled = false;
                }
                // 其他状态：不允许分享
                else {
                  isShareDisabled = true;
                  disableReason = '当前订单状态不允许分享';
                }
                
                return (
                  <div className="flex items-center gap-1">
              <button
                      className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-0 outline-none font-semibold share-btn ${isShareDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                onClick={() => setShowShare(true)}
                type="button"
                      disabled={isShareDisabled}
              >
                <Share2 className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">{t('share')}</span>
              </button>
                    {isShareDisabled && (
                      <button
                        className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors text-xs font-bold"
                        title="分享功能限制说明"
                        onClick={() => alert(disableReason)}
                      >
                        !
                      </button>
                    )}
                  </div>
                );
              })()}
              {/* 打印按钮 */}
              <div className="flex items-center gap-1">
                {order.status === 'Pending Pickup' ? (
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-0 outline-none font-semibold"
                    onClick={() => window.print()}
                    type="button"
                  >
                    {/* Print icon */}
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 14h12v7H6z" /></svg>
                    <span className="hidden sm:inline">{t('print')}</span>
                  </button>
                ) : (
                  <>
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg transition-all duration-200 shadow-xl border-0 outline-none font-semibold opacity-50 cursor-not-allowed"
                      onClick={() => alert('运单已生成且包裹在途，此阶段不支持重新打印标签')}
                      type="button"
                      disabled
                      title="运单已生成且包裹在途，此阶段不支持重新打印标签"
                    >
                      {/* Print icon */}
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 14h12v7H6z" /></svg>
                      <span className="hidden sm:inline">{t('print')}</span>
                    </button>
                    <button
                      className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors text-xs font-bold"
                      title="打印功能限制说明"
                      onClick={() => alert('运单已生成且包裹在途，此阶段不支持重新打印标签')}
                    >
                      !
                    </button>
                  </>
                )}
              </div>
              
              {/* 催单按钮 */}
              <div className="flex items-center gap-1">
                {order.status === 'Pending Pickup' ? (
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-0 outline-none font-semibold"
                    onClick={() => alert(t('remindSent'))}
                    type="button"
                  >
                    {/* Bell icon */}
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12.001v2.157c0 .538-.214 1.055-.595 1.438L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span className="hidden sm:inline">{t('remind')}</span>
                  </button>
                ) : (
                  <>
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-lg transition-all duration-200 shadow-xl border-0 outline-none font-semibold opacity-50 cursor-not-allowed"
                      onClick={() => alert('运单已生成且包裹在途，此阶段不支持催单功能')}
                      type="button"
                      disabled
                      title="运单已生成且包裹在途，此阶段不支持催单功能"
                    >
                      {/* Bell icon */}
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12.001v2.157c0 .538-.214 1.055-.595 1.438L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      <span className="hidden sm:inline">{t('remind')}</span>
                    </button>
                    <button
                      className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors text-xs font-bold"
                      title="催单功能限制说明"
                      onClick={() => alert('运单已生成且包裹在途，此阶段不支持催单功能')}
                    >
                      !
                  </button>
                </>
              )}
              </div>
            </div>
          </div>
            {/* 分享气泡 */}
            {showShare && (
            <div className="share-popover absolute right-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[180px] flex flex-col gap-2 animate-fade-in">
                <div className="font-bold text-gray-700 mb-2">{t('shareTo')}</div>
                <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50 text-green-700 font-semibold text-sm" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`)}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-5 w-5" /> WhatsApp
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50 text-green-700 font-semibold text-sm" onClick={() => alert('请在微信中手动粘贴链接') }>
                  <span className="h-5 w-5 flex items-center justify-center">
                    <svg className="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M331.429 263.429q0-23.429-14.286-37.715t-37.714-14.285q-24.572 0-43.429 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.429 14.571q23.428 0 37.714-14t14.286-37.428zM756 553.143q0-16-14.571-28.572T704 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T704 594.857q22.857 0 37.429-12.571T756 553.143zM621.143 263.429q0-23.429-14-37.715t-37.429-14.285q-24.571 0-43.428 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.428 14.571q23.429 0 37.429-14t14-37.428zM984 553.143q0-16-14.857-28.572T932 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T932 594.857q22.286 0 37.143-12.571T984 553.143zM832 326.286Q814.286 324 792 324q-96.571 0-177.714 44T486.57 487.143 440 651.429q0 44.571 13.143 86.857-20 1.714-38.857 1.714-14.857 0-28.572-0.857t-31.428-3.714-25.429-4-31.143-6-28.571-6L124.57 792l41.143-124.571Q0 551.429 0 387.429q0-96.572 55.714-177.715T206.571 82t207.715-46.571q100.571 0 190 37.714T754 177.429t78 148.857z m338.286 320.571q0 66.857-39.143 127.714t-106 110.572l31.428 103.428-113.714-62.285q-85.714 21.143-124.571 21.143-96.572 0-177.715-40.286T512.857 797.714t-46.571-150.857T512.857 496t127.714-109.429 177.715-40.285q92 0 173.143 40.285t130 109.715 48.857 150.571z" fill="#0e932e"></path></svg>
                  </span>
                  WeChat
                </button>
                {/* 欧洲主流社交软件 */}
                <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-semibold text-sm" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-5 w-5" /> Facebook
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-semibold text-sm" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`)}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" className="h-5 w-5" /> Telegram
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-semibold text-sm" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`)}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" alt="Twitter/X" className="h-5 w-5" /> X (Twitter)
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-gray-700 font-semibold text-sm" onClick={() => window.open(`mailto:?subject=Order%20Tracking&body=${encodeURIComponent(window.location.href)}`)}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6" /></svg>
                  Email
                </button>
              </div>
            )}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="border-l-2 border-blue-400 pl-4">
              {orderDetails.timeline.map((item, idx) => (
                <div key={idx} className="mb-8 relative">
                  <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                  <div className="text-sm text-gray-700 font-semibold">{t(timelineStatusKeyMap[item.status] || item.status)}</div>
                  <div className="text-base text-gray-500">{item.time} — {item.location}</div>
                  <div className="text-xs text-gray-400">{t(timelineDescKeyMap[item.desc] || item.desc)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
                      <div className="font-bold text-gray-700 mb-2">{t('packageInformation')}</div>
                      <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
              <div><span className="text-gray-500">{t('packageType')}:</span> <span className="text-gray-800">{t(serviceTypeKeyMap[orderDetails.package.packageType] || orderDetails.package.packageType)}</span></div>
              <div><span className="text-gray-500">{t('weight')}:</span> <span className="text-gray-800">{orderDetails.package.weight}</span></div>
              <div><span className="text-gray-500">{t('length')}:</span> <span className="text-gray-800">{orderDetails.package.length}</span></div>
              <div><span className="text-gray-500">{t('width')}:</span> <span className="text-gray-800">{orderDetails.package.width}</span></div>
              <div><span className="text-gray-500">{t('height')}:</span> <span className="text-gray-800">{orderDetails.package.height}</span></div>
              <div><span className="text-gray-500">{t('description')}:</span> <span className="text-gray-800">{(() => {
  // 例："Andy Liu → Noah, 2.8kg, Express"
  const parts = orderDetails.package.description.split(',');
  if (parts.length === 3) {
    const [names, weight, service] = parts;
    return `${names},${weight},${t(serviceTypeKeyMap[service.trim()] || service.trim())}`;
  }
  return orderDetails.package.description;
})()}</span></div>
              <div><span className="text-gray-500">{t('serviceType')}:</span> <span className="text-gray-800">{t(serviceTypeKeyMap[orderDetails.package.serviceType] || orderDetails.package.serviceType)}</span></div>
              <div><span className="text-gray-500">{t('insurance')}:</span> <span className="text-gray-800">{t(yesNoKeyMap[orderDetails.package.insurance.split(' ')[0].replace(/\W+$/, '').toLowerCase().replace(/^./, (s: string) => s.toUpperCase())] || orderDetails.package.insurance)}</span></div>
              <div><span className="text-gray-500">{t('needsPallet')}:</span> <span className="text-gray-800">{t(yesNoKeyMap[orderDetails.package.needsPallet] || orderDetails.package.needsPallet)}</span></div>
                <div><span className="text-gray-500">{t('palletSize')}:</span> <span className="text-gray-800">{orderDetails.package.palletSize}</span></div>
              <div><span className="text-gray-500">{t('trackingUrl')}:</span> <a href={orderDetails.package.trackingUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{t('viewLogistics')}</a></div>
            </div>
        </div>
      </div>
    </div>
  );
} 