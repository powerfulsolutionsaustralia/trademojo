'use client';

interface MojoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

export default function MojoLogo({ size = 'md', showText = true, className = '' }: MojoLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizes[size]} shrink-0`}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Body */}
          <ellipse cx="100" cy="115" rx="55" ry="60" fill="#8B7355" />
          <ellipse cx="100" cy="115" rx="45" ry="50" fill="#A8956B" />

          {/* Belly */}
          <ellipse cx="100" cy="125" rx="30" ry="32" fill="#D4C5A9" />

          {/* Head */}
          <circle cx="100" cy="70" r="42" fill="#8B7355" />
          <circle cx="100" cy="72" r="36" fill="#A8956B" />

          {/* Ears */}
          <circle cx="62" cy="42" r="18" fill="#8B7355" />
          <circle cx="62" cy="42" r="12" fill="#C4A882" />
          <circle cx="138" cy="42" r="18" fill="#8B7355" />
          <circle cx="138" cy="42" r="12" fill="#C4A882" />

          {/* Eyes */}
          <circle cx="85" cy="65" r="6" fill="#2D1B0E" />
          <circle cx="115" cy="65" r="6" fill="#2D1B0E" />
          <circle cx="87" cy="63" r="2" fill="white" />
          <circle cx="117" cy="63" r="2" fill="white" />

          {/* Nose */}
          <ellipse cx="100" cy="78" rx="8" ry="5" fill="#2D1B0E" />
          <ellipse cx="98" cy="77" rx="2" ry="1.5" fill="#5B3D24" />

          {/* Mouth */}
          <path d="M92 84 Q100 92 108 84" stroke="#2D1B0E" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Hard hat */}
          <path d="M60 55 Q60 30 100 28 Q140 30 140 55" fill="#F97316" />
          <rect x="55" y="52" width="90" height="8" rx="4" fill="#F97316" />
          <rect x="55" y="52" width="90" height="3" rx="1.5" fill="#FB923C" />
          <rect x="92" y="30" width="16" height="26" rx="2" fill="#FDBA74" opacity="0.6" />
        </svg>
      </div>
      {showText && (
        <span className="font-[family-name:var(--font-outfit)] font-bold text-lg">
          Trade<span className="text-primary">Mojo</span>
        </span>
      )}
    </div>
  );
}
