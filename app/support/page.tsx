import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow mt-8">
      <Link href="/" className="flex items-center text-blue-600 hover:underline mb-4">
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back to Home
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-black">Support Center</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/support/contact" className="text-blue-600 underline text-lg">Contact Customer Service</Link>
        </li>
        <li>
          <Link href="/support/guide" className="text-blue-600 underline text-lg">User Guide</Link>
        </li>
      </ul>
      <div className="mt-8 text-black text-sm">Select a support topic above.</div>
    </div>
  );
} 