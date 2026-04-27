import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon' | 'white' | 'gold' | 'monochrome';
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'horizontal', 
  className = '', 
  size = 40 
}) => {
  const colors = {
    primary: '#1A6B3C',
    gold: '#D4A017',
    charcoal: '#1C1C2E',
    white: '#FFFFFF',
    monochrome: '#1C1C2E',
  };

  const getColors = () => {
    switch (variant) {
      case 'white': return { icon: colors.white, text: colors.white };
      case 'gold': return { icon: colors.gold, text: colors.gold };
      case 'monochrome': return { icon: colors.monochrome, text: colors.monochrome };
      default: return { icon: colors.primary, text: colors.charcoal };
    }
  };

  const { icon, text } = getColors();

  const IconPath = () => (
    <path
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
      fill={icon}
    />
    /* This is a placeholder path for the recycling R shape described in the prompt */
    /* I will use a more stylized recycling-leaf-R hybrid below */
  );

  const StylizedR = () => (
    <g transform="translate(2, 2) scale(0.8)">
      <path
        d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10s4.477 10 10 10c1.845 0 3.564-.503 5.035-1.378L19.343 20l1.414-1.414-4.308-4.308C18.665 12.831 20 11.564 20 10zM10 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
        fill={icon}
      />
      <path
        d="M10 5v4h4V5h-4zm1 1h2v2h-2V6zm-1 6v4h4v-4h-4zm1 1h2v2h-2v-2z"
        fill={icon}
      />
    </g>
  );

  if (variant === 'icon') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <StylizedR />
      </svg>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <svg width={size * 1.5} height={size * 1.5} viewBox="0 0 24 24" fill="none">
          <StylizedR />
        </svg>
        <span style={{ color: text }} className="font-heading font-extrabold text-xl tracking-tight uppercase">
          Recovang
        </span>
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <StylizedR />
      </svg>
      <span style={{ color: text }} className="font-heading font-extrabold text-2xl tracking-tighter uppercase">
        Recovang
      </span>
    </div>
  );
};

export default Logo;
