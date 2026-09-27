'use client';

import React, { useState } from 'react';

interface BrandLogoProps {
  name: string;
  slug: string;
  logoSrc: string;
  className?: string;
}

export default function BrandLogo({ name, slug, logoSrc, className = '' }: BrandLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Ensure the path starts with /
  const imagePath = logoSrc.startsWith('/') ? logoSrc : `/${logoSrc}`;

  return (
    <div 
      className={`flex items-center justify-center h-12 min-w-[100px] flex-shrink-0 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageError ? (
        <span className="text-gray-400 text-sm font-semibold">{name}</span>
      ) : (
        <img
          src={imagePath}
          alt={`${name} banden`}
          title={`${name} banden`}
          className="h-10 w-auto object-contain transition-all duration-300 max-w-[120px] min-h-[30px]"
          style={{ 
            filter: isHovered ? 'brightness(1.1)' : 'none',
            opacity: 1,
            display: 'block'
          }}
          onError={(e) => {
            console.error(`Failed to load logo: ${imagePath}`, e);
            setImageError(true);
          }}
          onLoad={() => {
            console.log(`Successfully loaded logo: ${imagePath}`);
          }}
        />
      )}
    </div>
  );
}

