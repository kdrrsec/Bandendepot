import React from 'react';

interface ButtonSecondaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function ButtonSecondary({ 
  children, 
  className = '',
  ...props 
}: ButtonSecondaryProps) {
  return (
    <button 
      className={`px-6 py-3 rounded-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}











