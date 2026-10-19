import React from "react";

// 自作の線画アイコン（外部素材不使用）。viewBox 64x64、線色は color で指定。
type P = { size?: number; color?: string; stroke?: number; style?: React.CSSProperties };

const Svg: React.FC<P & { children: React.ReactNode }> = ({ size = 64, color = "currentColor", stroke = 2.6, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

export const IconAutoDoor: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="8" y="10" width="48" height="46" rx="1" />
    <line x1="32" y1="14" x2="32" y2="56" />
    <rect x="12" y="14" width="18" height="42" />
    <rect x="34" y="14" width="18" height="42" />
    <circle cx="32" cy="7" r="2.5" />
  </Svg>
);

export const IconParking: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M10 40 L14 28 Q15 25 18 25 L46 25 Q49 25 50 28 L54 40" />
    <rect x="8" y="40" width="48" height="10" rx="3" />
    <circle cx="18" cy="50" r="4" />
    <circle cx="46" cy="50" r="4" />
    <rect x="24" y="6" width="16" height="14" rx="2" />
    <path d="M29 17 V9 H33 Q36 9 36 12 Q36 15 33 15 H29" />
  </Svg>
);

export const IconBuilding: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="14" y="8" width="36" height="50" />
    {[16, 26, 36].map((y) => (
      <g key={y}>
        <rect x="20" y={y} width="6" height="5" />
        <rect x="29" y={y} width="6" height="5" />
        <rect x="38" y={y} width="6" height="5" />
      </g>
    ))}
    <rect x="27" y="46" width="10" height="12" />
  </Svg>
);

export const IconShop: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M8 22 L12 10 H52 L56 22 Z" />
    <path d="M8 22 Q14 28 20 22 Q26 28 32 22 Q38 28 44 22 Q50 28 56 22" />
    <rect x="12" y="26" width="40" height="30" />
    <rect x="18" y="34" width="12" height="22" />
    <rect x="35" y="34" width="12" height="10" />
  </Svg>
);

export const IconFactory: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M6 56 V30 L20 38 V30 L34 38 V30 L48 38 V12 H56 V56 Z" />
    <rect x="14" y="44" width="8" height="6" />
    <rect x="28" y="44" width="8" height="6" />
    <rect x="42" y="44" width="8" height="6" />
  </Svg>
);

export const IconElevator: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="12" y="8" width="40" height="50" />
    <line x1="32" y1="16" x2="32" y2="58" />
    <path d="M24 12 L27 9 L30 12" />
    <path d="M34 9 L37 12 L40 9" />
  </Svg>
);

export const IconPerson: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="32" cy="18" r="9" />
    <path d="M14 56 Q14 34 32 34 Q50 34 50 56" />
  </Svg>
);

export const IconSensor: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="8" y="22" width="22" height="20" rx="3" />
    <circle cx="24" cy="32" r="4" />
    <path d="M36 24 Q42 32 36 40" />
    <path d="M42 18 Q52 32 42 46" />
    <path d="M48 12 Q62 32 48 52" />
  </Svg>
);

export const IconChip: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="16" y="16" width="32" height="32" rx="2" />
    <rect x="24" y="24" width="16" height="16" />
    {[22, 32, 42].map((v) => (
      <g key={v}>
        <line x1={v} y1="8" x2={v} y2="16" />
        <line x1={v} y1="48" x2={v} y2="56" />
        <line x1="8" y1={v} x2="16" y2={v} />
        <line x1="48" y1={v} x2="56" y2={v} />
      </g>
    ))}
  </Svg>
);

export const IconCar: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M6 40 L12 26 Q14 22 18 22 L44 22 Q48 22 50 26 L58 40" />
    <rect x="4" y="38" width="56" height="10" rx="3" />
    <circle cx="17" cy="48" r="5" />
    <circle cx="47" cy="48" r="5" />
    <line x1="30" y1="22" x2="30" y2="38" />
  </Svg>
);

export const IconBottle: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="12" y="20" width="16" height="36" rx="3" />
    <rect x="15" y="10" width="10" height="10" />
    <line x1="12" y1="34" x2="28" y2="34" />
    <path d="M36 30 H54 V54 Q54 56 52 56 H38 Q36 56 36 54 Z" />
    <rect x="40" y="22" width="10" height="8" />
  </Svg>
);

export const IconCircuit: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="8" y="12" width="48" height="40" rx="3" />
    <rect x="18" y="22" width="12" height="10" />
    <circle cx="42" cy="26" r="4" />
    <path d="M30 27 H38" />
    <path d="M24 32 V42 H46 V30" />
    <circle cx="24" cy="42" r="2" />
  </Svg>
);

export const IconAI: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="12" y="16" width="40" height="32" rx="6" />
    <circle cx="24" cy="30" r="3.5" />
    <circle cx="40" cy="30" r="3.5" />
    <line x1="24" y1="40" x2="40" y2="40" />
    <line x1="32" y1="8" x2="32" y2="16" />
    <circle cx="32" cy="7" r="2.5" />
    <line x1="6" y1="28" x2="12" y2="28" />
    <line x1="52" y1="28" x2="58" y2="28" />
  </Svg>
);

export const IconChat: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M8 12 H40 V34 H22 L14 42 V34 H8 Z" />
    <path d="M44 22 H56 V44 H50 V52 L42 44 H28 V38" />
  </Svg>
);

export const IconEar: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M20 26 Q20 10 34 10 Q48 10 48 26 Q48 34 40 40 Q36 43 36 50 Q36 56 30 56 Q24 56 24 50" />
    <path d="M28 26 Q28 18 34 18 Q40 18 40 26 Q40 30 36 32" />
  </Svg>
);

export const IconMemo: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="12" y="8" width="32" height="48" rx="2" />
    <line x1="18" y1="18" x2="38" y2="18" />
    <line x1="18" y1="26" x2="38" y2="26" />
    <line x1="18" y1="34" x2="30" y2="34" />
    <path d="M50 14 L56 20 L36 46 L28 48 L30 40 Z" />
  </Svg>
);

export const IconSearch: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="26" cy="26" r="16" />
    <line x1="38" y1="38" x2="56" y2="56" strokeWidth={5} />
  </Svg>
);

export const IconBulb: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M22 40 Q12 32 12 24 Q12 8 32 8 Q52 8 52 24 Q52 32 42 40 V46 H22 Z" />
    <line x1="24" y1="52" x2="40" y2="52" />
    <line x1="27" y1="58" x2="37" y2="58" />
    <path d="M26 30 L32 36 L38 30" />
  </Svg>
);

export const IconHandshake: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 26 L14 18 L24 22 L32 18 L40 22 L50 18 L60 26" />
    <path d="M14 34 L26 46 Q30 50 34 46 L46 34" />
    <path d="M24 30 L32 38" />
    <path d="M30 26 L38 34" />
    <line x1="4" y1="26" x2="14" y2="34" />
    <line x1="60" y1="26" x2="50" y2="34" />
  </Svg>
);

export const IconGear: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="32" cy="32" r="9" />
    <path d="M32 6 V14 M32 50 V58 M6 32 H14 M50 32 H58 M13.6 13.6 L19.3 19.3 M44.7 44.7 L50.4 50.4 M13.6 50.4 L19.3 44.7 M44.7 19.3 L50.4 13.6" />
    <circle cx="32" cy="32" r="18" />
  </Svg>
);

export const IconLock: React.FC<P & { open?: number }> = ({ open = 0, ...p }) => (
  <Svg {...p}>
    <rect x="12" y="28" width="40" height="28" rx="4" />
    <path d={`M20 28 V${20 - open * 2} Q20 ${8 - open * 4} 32 ${8 - open * 4} Q44 ${8 - open * 4} 44 ${20 - open * 2} V${28 - open * 10}`} transform={`translate(${open * 14} 0)`} />
    <circle cx="32" cy="41" r="3" />
    <line x1="32" y1="44" x2="32" y2="49" />
  </Svg>
);

export const IconCheck: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 34 L26 48 L52 18" />
  </Svg>
);

export const IconTarget: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="32" cy="32" r="22" />
    <circle cx="32" cy="32" r="10" />
    <line x1="32" y1="2" x2="32" y2="14" />
    <line x1="32" y1="50" x2="32" y2="62" />
    <line x1="2" y1="32" x2="14" y2="32" />
    <line x1="50" y1="32" x2="62" y2="32" />
  </Svg>
);
