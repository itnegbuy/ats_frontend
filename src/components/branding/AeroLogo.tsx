'use client';

interface AeroLogoProps {
  size?: number;
  showText?: boolean;
  animated?: boolean;
  variant?: 'icon' | 'full' | 'minimal' | 'white';
  src?: string | null;
  alt?: string;
  onImgError?: () => void;
}

const bladeColors = ['#4F46E5', '#6366F1', '#818CF8', '#7C3AED', '#6D28D9', '#4F46E5'];

const f6 = (n: number) => n.toFixed(6);

function TurbineIcon({ size, animated }: { size: number; animated: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={animated ? 'turbine-spin' : ''}
    >
      <defs>
        <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#7C3AED" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="innerRingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="hubGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="hubGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer ambient glow */}
      {animated && (
        <circle cx="32" cy="32" r="32" fill="url(#outerGlow)" className="pulse-opacity" />
      )}

      {/* Expanding pulse ring */}
      {animated && (
        <circle cx="32" cy="32" r="29" stroke="#4F46E5" strokeWidth="1" fill="none" className="pulse-ring" />
      )}

      {/* Outer ring - turbine casing */}
      <circle cx="32" cy="32" r="29" stroke="#1E293B" strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="32" r="29" stroke="url(#ringGrad)" strokeWidth="2.5" fill="none" opacity="0.9" />

      {/* Casing notches */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 32 + 28.5 * Math.cos(rad);
        const cy = 32 + 28.5 * Math.sin(rad);
        return (
          <rect
            key={i}
            x={f6(cx - 1.5)} y={f6(cy - 1.5)}
            width="3" height="3" rx="0.5"
            fill="#4F46E5"
            className={animated ? 'notch-pulse' : ''}
            style={{ animationDelay: `${i * 0.15}s` }}
            transform={`rotate(${deg + 45} ${f6(cx)} ${f6(cy)})`}
          />
        );
      })}

      {/* Inner ring accent */}
      <circle cx="32" cy="32" r="24" stroke="url(#innerRingGrad)" strokeWidth="1.5" fill="none" opacity={0.25} />

      {/* Turbine blades */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const innerR = 8;
        const outerR = 22;
        const bladeW = 5;
        const ax = 32 + innerR * Math.cos(rad) - bladeW * Math.sin(rad);
        const ay = 32 + innerR * Math.sin(rad) + bladeW * Math.cos(rad);
        const bx = 32 + outerR * Math.cos(rad) - bladeW * Math.sin(rad);
        const by = 32 + outerR * Math.sin(rad) + bladeW * Math.cos(rad);
        const cx = 32 + outerR * Math.cos(rad) + bladeW * Math.sin(rad);
        const cy = 32 + outerR * Math.sin(rad) - bladeW * Math.cos(rad);
        const dx = 32 + innerR * Math.cos(rad) + bladeW * Math.sin(rad);
        const dy = 32 + innerR * Math.sin(rad) - bladeW * Math.cos(rad);
        const midX = 32 + (innerR + outerR) * 0.65 * Math.cos(rad);
        const midY = 32 + (innerR + outerR) * 0.65 * Math.sin(rad);

        return (
          <g key={i}>
            <path d={`M ${f6(ax)} ${f6(ay)} L ${f6(bx)} ${f6(by)} Q ${f6(midX)} ${f6(midY)} ${f6(cx)} ${f6(cy)} L ${f6(dx)} ${f6(dy)} Z`}
              fill={bladeColors[i]} opacity={0.9} filter="url(#logoGlow)" />
            <path d={`M ${f6(ax)} ${f6(ay)} L ${f6(bx)} ${f6(by)}`} stroke="white" strokeWidth="0.4" opacity={0.2} />
            <path d={`M ${f6(dx)} ${f6(dy)} L ${f6(cx)} ${f6(cy)}`} stroke="white" strokeWidth="0.3" opacity={0.1} />
          </g>
        );
      })}

      {/* Center hub - outer ring */}
      <circle cx="32" cy="32" r="9" fill="#0F172A" stroke="#334155" strokeWidth="1" />

      {/* Center hub - inner */}
      <circle cx="32" cy="32" r="6" fill="url(#hubGrad)" opacity={0.95} filter="url(#hubGlow)" />

      {/* Center dot */}
      <circle cx="32" cy="32" r="2.5" fill="white" className={animated ? 'pulse-opacity-fast' : ''} />

      {/* Ring highlight segments */}
      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={f6(32 + 26 * Math.cos(rad))} y1={f6(32 + 26 * Math.sin(rad))}
            x2={f6(32 + 28 * Math.cos(rad))} y2={f6(32 + 28 * Math.sin(rad))}
            stroke="#A78BFA" strokeWidth="1.5"
            className={animated ? 'notch-pulse' : ''}
            style={{ animationDelay: `${deg * 0.002}s` }}
          />
        );
      })}

      {/* Orbital dots */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle
            key={`orbit-${i}`}
            cx={f6(32 + 27 * Math.cos(rad))} cy={f6(32 + 27 * Math.sin(rad))}
            r="1.2" fill="#A78BFA"
            className={animated ? 'notch-pulse' : ''}
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        );
      })}

      {/* Outer ring glow segments */}
      {animated && [0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <path
            key={`glow-seg-${i}`}
            d={`M ${f6(32 + 28.5 * Math.cos(rad - 0.15))} ${f6(32 + 28.5 * Math.sin(rad - 0.15))} A 28.5 28.5 0 0 1 ${f6(32 + 28.5 * Math.cos(rad + 0.15))} ${f6(32 + 28.5 * Math.sin(rad + 0.15))}`}
            stroke="#818CF8" strokeWidth="1" fill="none"
            className="notch-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        );
      })}
    </svg>
  );
}

function LogoText({ logoText, logoSubText, variant }: { logoText?: string; logoSubText?: string; variant?: 'default' | 'white' }) {
  const isWhite = variant === 'white';

  return (
    <div className="flex flex-col">
      <span className={`font-extrabold text-[20px] leading-tight tracking-[-0.03em] ${isWhite ? 'text-white' : 'text-[#0A1628]'}`}>
        {logoText || 'AeroTurbine'}
        <span className={`${isWhite ? 'text-[#A78BFA]' : 'text-[#4F46E5]'}`}>Spare</span>
      </span>
      <span className={`text-[9px] leading-tight tracking-[0.2em] uppercase font-semibold ${isWhite ? 'text-white/60' : 'text-[#6B7280]'}`}>
        {logoSubText || 'Precision Aerospace Sourcing'}
      </span>
    </div>
  );
}

export default function AeroLogo({
  size = 40,
  showText = true,
  animated = true,
  variant = 'full',
  src,
  alt,
  onImgError,
}: AeroLogoProps) {
  if (src) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={src}
          alt={alt || 'Logo'}
          className="flex-shrink-0 object-contain"
          style={{ height: size, width: 'auto' }}
          onError={onImgError}
        />
        {showText && variant === 'white' && <LogoText variant="white" />}
        {showText && variant !== 'white' && <LogoText />}
      </div>
    );
  }

  if (variant === 'icon') {
    return <TurbineIcon size={size} animated={animated} />;
  }

  if (variant === 'white') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <TurbineIcon size={size} animated={animated} />
        </div>
        {showText && <LogoText variant="white" />}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2.5">
        <div className="flex-shrink-0">
          <TurbineIcon size={size} animated={animated} />
        </div>
        {showText && (
          <span className="text-[#0A1628] font-bold text-base tracking-tight">
            AeroTurbineSpare
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 select-none logo-hover-group">
      <div className="relative flex-shrink-0 logo-icon-wrap">
        <div className="absolute inset-0 rounded-full blur-xl logo-glow" />
        <TurbineIcon size={size} animated={animated} />
      </div>
      {showText && (
        <div className="logo-text-shift">
          <LogoText />
        </div>
      )}
    </div>
  );
}
