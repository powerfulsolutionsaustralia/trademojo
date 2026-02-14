'use client';

import Image from 'next/image';

interface MojoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

const pixelSizes = {
  sm: 32,
  md: 40,
  lg: 56,
};

export default function MojoLogo({ size = 'md', showText = true, className = '' }: MojoLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} shrink-0`}>
        <Image
          src="/mojo.png"
          alt="TradeMojo"
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className="w-full h-full object-contain"
        />
      </div>
      {showText && (
        <span className="font-[family-name:var(--font-outfit)] font-bold text-lg">
          Trade<span className="text-primary">Mojo</span>
        </span>
      )}
    </div>
  );
}
