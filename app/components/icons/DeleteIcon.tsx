import React from 'react';

export default function DeleteIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4804"
      width="1em"
      height="1em"
      fill="none"
      {...props}
    >
      <path d="M511.8 65.8c245.8-0.5 445.5 198.8 446 444.6v1.4c0.5 245.8-198.8 445.5-444.6 446h-1.4C265.9 957.8 66.2 759 66.2 513.2v-1.4C65.8 265.9 264.5 66.2 510.3 66.2c0.5-0.4 1-0.4 1.5-0.4z m0 0" fill="#EB5454" p-id="4805"></path>
      <path d="M333.5 482.3h356.6c18.1 0 29.5 11.9 29.5 29.5s-11.9 29.5-29.5 29.5H333.5c-18.1 0-29.5-11.9-29.5-29.5s11.4-29.5 29.5-29.5z m0 0" fill="#FFFFFF" p-id="4806"></path>
    </svg>
  );
} 