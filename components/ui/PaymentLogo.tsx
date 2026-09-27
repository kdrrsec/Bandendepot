'use client';

import React, { useState } from 'react';

interface PaymentLogoProps {
  name: string;
  slug: string;
  logoSrc: string;
  className?: string;
}

export default function PaymentLogo({ name, slug, logoSrc, className = '' }: PaymentLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Ensure the path starts with /
  const imagePath = logoSrc.startsWith('/') ? logoSrc : `/${logoSrc}`;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {imageError ? (
        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded text-white">{name}</span>
      ) : (
        <img
          src={imagePath}
          alt={name}
          title={name}
          className="h-6 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          onError={() => {
            console.error(`Failed to load payment logo: ${imagePath}`);
            setImageError(true);
          }}
          onLoad={() => {
            console.log(`Successfully loaded payment logo: ${imagePath}`);
          }}
        />
      )}
    </div>
  );
}





