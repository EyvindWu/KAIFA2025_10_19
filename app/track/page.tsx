'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Search, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle,
  Truck,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  Share2
} from 'lucide-react'

const sampleTimeline = [
  { time: '2024-05-01 14:32', location: 'Frankfurt, Germany', status: 'In Transit', desc: 'Departed from facility' },
  { time: '2024-04-30 09:10', location: 'Berlin, Germany', status: 'Picked Up', desc: 'Package picked up by carrier' },
  { time: '2024-04-29 18:00', location: 'Berlin, Germany', status: 'Label Created', desc: 'Shipping label created' },
];

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [result, setResult] = useState<null | typeof sampleTimeline>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // 监听点击气泡外部关闭分享弹窗
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

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)
    setStatus('')
    setLoading(true)
    setTimeout(() => {
      setResult(sampleTimeline)
      setStatus('In Transit')
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'in transit':
        return 'text-blue-600 bg-blue-100'
      case 'out for delivery':
        return 'text-orange-600 bg-orange-100'
      case 'exception':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Track Your Shipment</h1>
        <form onSubmit={handleTrack} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter Package Number (e.g. 1Z999... or 123456...)"
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Track
          </button>
        </form>
        {loading && (
          <div className="flex flex-col items-center mt-8 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
            <div className="text-blue-600 font-semibold">查询中...</div>
          </div>
        )}
        {result && (
          <div className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-gray-500 text-sm">Tracking #: <span className="font-mono">{trackingNumber}</span></span>
              {/* Teal色系分享按钮 */}
              <button
                className="flex items-center px-2 py-1 border-2 border-teal-400 text-teal-700 bg-teal-50 rounded-full text-xs share-btn hover:bg-teal-100 focus:outline-none transition-colors"
                onClick={() => setShowShare(true)}
                type="button"
              >
                <Share2 className="h-3 w-3 mr-1" /> 分享
              </button>
              {/* 分享气泡 */}
              {showShare && (
                <div className="share-popover absolute right-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[180px] flex flex-col gap-2 animate-fade-in">
                  <div className="font-bold text-gray-700 mb-2">分享到</div>
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
            </div>
            <div className="border-l-2 border-blue-200 pl-4">
              {result.map((item, idx) => (
                <div key={idx} className="mb-6 relative">
                  <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                  <div className="text-sm text-gray-700 font-semibold">{item.status}</div>
                  <div className="text-xs text-gray-500">{item.time} — {item.location}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href={`/track/detail/${trackingNumber}`} className="inline-block px-4 py-2 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 transition">
                查看完整物流详情
              </Link>
            </div>
          </div>
        )}
        <div className="mt-8 text-center">
          <span className="text-gray-500 mr-2">样例单号：</span>
          <span
            className="font-mono text-blue-600 underline hover:text-blue-800 cursor-pointer"
            onClick={() => setTrackingNumber('1Z999AA10123456784')}
          >
            1Z999AA10123456784
          </span>
        </div>
      </div>
    </div>
  )
} 