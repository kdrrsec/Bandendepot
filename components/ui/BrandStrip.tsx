'use client';

import React, { useEffect, useRef } from 'react';
import BrandLogo from './BrandLogo';
import { brands } from '@/config/brands';

interface BrandStripProps {
  brandsToShow?: typeof brands;
  className?: string;
}

export default function BrandStrip({ brandsToShow = brands, className = '' }: BrandStripProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scrollPositionRef = useRef(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const scrollContent = scrollContentRef.current;

    if (!scrollContainer || !scrollContent) return;

    const scrollSpeed = 0.5; // pixels per frame
    const singleSetWidth = scrollContent.scrollWidth / 2; // Since we duplicate, each set is half

    const animate = () => {
      if (isPausedRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      scrollPositionRef.current += scrollSpeed;

      // Reset to beginning when we've scrolled one full set
      if (scrollPositionRef.current >= singleSetWidth) {
        scrollPositionRef.current = 0;
      }

      scrollContainer.scrollLeft = scrollPositionRef.current;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Pause on hover
    const handleMouseEnter = () => {
      isPausedRef.current = true;
    };

    const handleMouseLeave = () => {
      isPausedRef.current = false;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className={`bg-white py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-hidden scrollbar-hide"
          style={{ scrollBehavior: 'auto' }}
        >
          <div 
            ref={scrollContentRef}
            className="flex items-center justify-start gap-8 min-w-max px-4 py-2"
          >
            {brandsToShow.map((brand) => (
              <BrandLogo
                key={brand.slug}
                name={brand.name}
                slug={brand.slug}
                logoSrc={brand.logo}
                className="flex-shrink-0"
              />
            ))}
            {/* Duplicate logos for seamless infinite loop */}
            {brandsToShow.map((brand) => (
              <BrandLogo
                key={`${brand.slug}-duplicate`}
                name={brand.name}
                slug={brand.slug}
                logoSrc={brand.logo}
                className="flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-t border-gray-200"></div>
      </div>
    </div>
  );
}

