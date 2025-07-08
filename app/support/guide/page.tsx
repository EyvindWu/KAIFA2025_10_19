import React from 'react';

export default function Guide() {
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4 text-black">User Guide</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-black">How to Use KAIFA EXPRESS</h2>
        <ol className="list-decimal pl-6 text-black space-y-1">
          <li>Register or log in to your account</li>
          <li>Fill in sender and recipient information</li>
          <li>Choose your shipping service and package details</li>
          <li>Submit your order and make payment</li>
          <li>Track your shipment in real time</li>
        </ol>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2 text-black">Frequently Asked Questions</h2>
        <ul className="list-disc pl-6 text-black space-y-1">
          <li>How do I track my order?</li>
          <li>What shipping options are available?</li>
          <li>How do I contact customer service?</li>
          <li>How do I change my delivery address?</li>
        </ul>
      </div>
    </div>
  );
} 