'use client';

import Image from 'next/image';

interface MojoMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  animate?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-32 h-32',
  hero: 'w-48 h-48 md:w-64 md:h-64',
};

const pixelSizes = {
  sm: 32,
  md: 48,
  lg: 80,
  xl: 128,
  hero: 256,
};

export default function MojoMascot({ size = 'md', className = '', animate = true }: MojoMascotProps) {
  return (
    <div className={`${sizeClasses[size]} ${className} ${animate ? 'animate-bounce-gentle' : ''} relative`}>
      <Image
        src="/mojo.png"
        alt="Mojo - AI Trade Assistant"
        width={pixelSizes[size]}
        height={pixelSizes[size]}
        className="w-full h-full object-contain drop-shadow-lg"
        priority={size === 'hero' || size === 'xl'}
      />

      {/* Animated sparkles */}
      {animate && (
        <>
          <div className="absolute -top-1 -right-1 w-3 h-3 animate-ping">
            <svg viewBox="0 0 12 12" className="w-full h-full">
              <polygon points="6,0 7.5,4.5 12,6 7.5,7.5 6,12 4.5,7.5 0,6 4.5,4.5" fill="#F97316" />
            </svg>
          </div>
          <div className="absolute top-1/4 -left-2 w-2 h-2 animate-ping" style={{ animationDelay: '0.5s' }}>
            <svg viewBox="0 0 12 12" className="w-full h-full">
              <polygon points="6,0 7.5,4.5 12,6 7.5,7.5 6,12 4.5,7.5 0,6 4.5,4.5" fill="#8B5CF6" />
            </svg>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
