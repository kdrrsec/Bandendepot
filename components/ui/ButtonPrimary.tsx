import React from 'react';

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'yellow' | 'dark';
}

export default function ButtonPrimary({ 
  children, 
  variant = 'yellow',
  className = '',
  ...props 
}: ButtonPrimaryProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = variant === 'yellow' 
    ? 'bg-accent text-white hover:bg-accent-dark' 
    : 'bg-primary text-white hover:bg-primary-dark';
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}







