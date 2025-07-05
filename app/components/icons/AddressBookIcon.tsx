import React from 'react';

export default function AddressBookIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} width="200" height="200" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M64 64C64 46.3269 78.3269 32 96 32H416C433.673 32 448 46.3269 448 64V448C448 465.673 433.673 480 416 480H96C78.3269 480 64 465.673 64 448V64Z" stroke="#23245B" strokeWidth="24"/>
      <path d="M160 224C160 188.654 188.654 160 224 160C259.346 160 288 188.654 288 224C288 259.346 259.346 288 224 288C188.654 288 160 259.346 160 224Z" stroke="#23245B" strokeWidth="16"/>
      <path d="M320 352C320 316.654 259.346 288 224 288C188.654 288 128 316.654 128 352" stroke="#23245B" strokeWidth="16"/>
      <path d="M96 96H80C71.1634 96 64 103.163 64 112V400C64 408.837 71.1634 416 80 416H96" stroke="#23245B" strokeWidth="24"/>
    </svg>
  );
} 