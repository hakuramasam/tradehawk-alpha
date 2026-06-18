import { useEffect, useState } from "react";

// Decorative SVG sparkline that animates upward — pure visual, not real data
export const PriceChart = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1400);
    return () => clearInterval(id);
  }, []);

  const rng = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  const points = Array.from({ length: 40 }, (_, i) => {
    const base = 60 - i * 1.1;
    const noise = (rng(i + tick) - 0.5) * 14;
    return { x: i * (300 / 39), y: Math.max(8, Math.min(72, base + noise)) };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${path} L 300 80 L 0 80 Z`;

  return (
    <svg viewBox="0 0 300 80" className="w-full h-full">
      <defs>
        <linearGradient id="hawk-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(45 95% 55%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(45 95% 55%)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hawk-line" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(218 95% 58%)" />
          <stop offset="100%" stopColor="hsl(45 95% 55%)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#hawk-area)" />
      <path d={path} fill="none" stroke="url(#hawk-line)" strokeWidth="1.5" strokeLinecap="round" className="transition-all duration-1000" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2.5" fill="hsl(45 95% 65%)">
        <animate attributeName="r" values="2.5;5;2.5" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};