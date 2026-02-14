'use client';

interface MojoMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  animate?: boolean;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-32 h-32',
  hero: 'w-48 h-48 md:w-64 md:h-64',
};

export default function MojoMascot({ size = 'md', className = '', animate = true }: MojoMascotProps) {
  return (
    <div className={`${sizes[size]} ${className} ${animate ? 'animate-bounce-gentle' : ''} relative`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
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

        {/* Face */}
        {/* Eyes */}
        <circle cx="85" cy="65" r="6" fill="#2D1B0E" />
        <circle cx="115" cy="65" r="6" fill="#2D1B0E" />
        <circle cx="87" cy="63" r="2" fill="white" />
        <circle cx="117" cy="63" r="2" fill="white" />

        {/* Nose */}
        <ellipse cx="100" cy="78" rx="8" ry="5" fill="#2D1B0E" />
        <ellipse cx="98" cy="77" rx="2" ry="1.5" fill="#5B3D24" />

        {/* Mouth / smile */}
        <path d="M92 84 Q100 92 108 84" stroke="#2D1B0E" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Hard hat */}
        <path d="M60 55 Q60 30 100 28 Q140 30 140 55" fill="#F97316" />
        <rect x="55" y="52" width="90" height="8" rx="4" fill="#F97316" />
        <rect x="55" y="52" width="90" height="3" rx="1.5" fill="#FB923C" />

        {/* Hard hat stripe */}
        <rect x="92" y="30" width="16" height="26" rx="2" fill="#FDBA74" opacity="0.6" />

        {/* Arms */}
        {/* Left arm holding wrench */}
        <path d="M50 105 Q30 110 28 130" stroke="#8B7355" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M50 105 Q30 110 28 130" stroke="#A8956B" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Wrench */}
        <rect x="18" y="125" width="24" height="5" rx="2" fill="#94A3B8" transform="rotate(-20 18 125)" />
        <circle cx="16" cy="126" r="6" fill="none" stroke="#94A3B8" strokeWidth="3" />
        <rect x="38" y="120" width="6" height="10" rx="1" fill="#94A3B8" transform="rotate(-20 38 120)" />

        {/* Right arm - thumbs up */}
        <path d="M150 105 Q170 100 172 85" stroke="#8B7355" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M150 105 Q170 100 172 85" stroke="#A8956B" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Thumb */}
        <rect x="167" y="72" width="8" height="18" rx="4" fill="#A8956B" />

        {/* Legs */}
        <ellipse cx="80" cy="168" rx="14" ry="10" fill="#8B7355" />
        <ellipse cx="120" cy="168" rx="14" ry="10" fill="#8B7355" />

        {/* Mojo text on hard hat (tiny) */}
        <text x="100" y="48" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">MOJO</text>
      </svg>

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
