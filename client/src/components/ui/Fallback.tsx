import React from 'react';

interface PhotonSpinProps {
  className?: string;
  style?: React.CSSProperties;
  size?: 'small' | 'default' | 'large';
  scale?: number;
  animationDuration?: number;
}

export function PhotonSpin(
  {
    className,
    style,
    size = 'default',
    scale = 1,
    animationDuration = 1.5,
  }: PhotonSpinProps) {
  const sizeConfig = {
    small: {
      container: 'h-4 w-4',
      ball: 'h-1 w-1',
      shadow: 'shadow-[0_0_10px_2px_rgba(12,102,228,0.9)]',
    },
    default: {
      container: 'h-8 w-8',
      ball: 'h-1.5 w-1.5',
      shadow: 'shadow-[0_0_15px_4px_rgba(12,102,228,0.9)]',
    },
    large: {
      container: 'h-16 w-16',
      ball: 'h-3 w-3',
      shadow: 'shadow-[0_0_30px_6px_rgba(12,102,228,0.9)]',
    },
  };

  const config = sizeConfig[size] || sizeConfig.default;

  return (
    <div
      className={`inline-block ${className || ''}`}
      style={{
        ...style,
        transform: `scale(${scale})`,
        willChange: 'transform'
      }}
    >
      <div
        className={`relative flex animate-spin items-center justify-center [animation-duration:1.5s] ${config.container}`}
        style={{
          ...style,
          animationDuration: `${animationDuration}s`,
        }}
      >
        {/* O Rastro do Fóton (Cauda) */}
        <div className="absolute inset-0 rounded-full blur-[1px]
             bg-[conic-gradient(from_0deg,transparent_0%,transparent_55%,rgba(12,102,228,0.9)_100%)]
             mask-[radial-gradient(closest-side,transparent_85%,black_87%)]
             Webkit-mask-[radial-gradient(closest-side,transparent_85%,black_87%)]">
        </div>

        {/* A Partícula (Fóton) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`rounded-full bg-blue-50 relative ${config.ball}`}>
            <div className={`absolute inset-0 rounded-full ${config.shadow}`}></div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default function Fallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full w-full p-6">
      <PhotonSpin size="large"/>

      <p
        className="text-[#0C66E4] text-sm font-semibold tracking-wider uppercase flex items-center">
        Carregando
        <span className="loading-dots w-6 text-left inline-block"></span>
      </p>
    </div>
  );
}