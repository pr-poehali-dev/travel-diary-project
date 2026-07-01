import { useState } from 'react';
import { Trip } from '@/data/travels';

interface Country {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
}

const COUNTRIES: Country[] = [
  { id: 'Шри-Ланка', name: 'Шри-Ланка', emoji: '🌴', x: 71, y: 62 },
  { id: 'Турция', name: 'Турция', emoji: '🎈', x: 57.5, y: 40 },
  { id: 'Мексика', name: 'Мексика', emoji: '🌵', x: 20, y: 47 },
  { id: 'Норвегия', name: 'Норвегия', emoji: '❄️', x: 51, y: 22 },
];

interface Props {
  trips: Trip[];
}

const WorldMap = ({ trips }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const statusOf = (id: string) => trips.find((t) => t.country === id)?.status;

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative rounded-[2rem] overflow-hidden border border-border bg-gradient-to-br from-[hsl(200_45%_92%)] to-[hsl(190_40%_86%)] shadow-[0_20px_60px_-20px_rgba(90,110,90,0.35)] aspect-[2/1]">
        <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g fill="hsl(142 18% 78%)" stroke="hsl(142 20% 70%)" strokeWidth="0.15">
            <path d="M12 12 Q18 8 25 11 L28 18 Q26 26 22 30 L18 40 Q14 38 15 30 L10 22 Q9 15 12 12 Z" />
            <path d="M24 33 Q30 32 31 38 L29 46 Q25 49 23 45 L22 38 Q22 34 24 33 Z" />
            <path d="M46 10 Q52 7 58 10 L57 16 Q52 18 49 16 L46 14 Z" />
            <path d="M46 18 Q54 16 60 19 L58 28 Q52 32 48 28 L45 22 Q45 19 46 18 Z" />
            <path d="M60 14 Q74 10 86 16 L88 26 Q80 34 70 32 L62 26 Q58 20 60 14 Z" />
            <path d="M78 36 Q86 34 90 39 L88 44 Q82 46 79 42 Z" />
          </g>

          {COUNTRIES.map((c) => {
            const status = statusOf(c.id);
            const color =
              status === 'visited'
                ? 'hsl(142 45% 55%)'
                : status === 'planned'
                ? 'hsl(42 75% 58%)'
                : 'hsl(30 10% 60%)';
            return (
              <g
                key={c.id}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                <circle cx={c.x} cy={c.y} r={hovered === c.id ? 3.2 : 1.6} fill={color} opacity={0.25}>
                  <animate attributeName="r" values="1.6;2.6;1.6" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={hovered === c.id ? 1.8 : 1.3}
                  fill={color}
                  stroke="white"
                  strokeWidth="0.3"
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </svg>

        {COUNTRIES.map((c) =>
          hovered === c.id ? (
            <div
              key={c.id}
              className="absolute -translate-x-1/2 -translate-y-full pointer-events-none animate-scale-in"
              style={{ left: `${c.x}%`, top: `${c.y - 3}%` }}
            >
              <div className="bg-card px-3 py-1.5 rounded-full shadow-lg border border-border whitespace-nowrap text-sm font-medium">
                {c.emoji} {c.name}
              </div>
            </div>
          ) : null
        )}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sage inline-block" /> Уже была
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gold inline-block" /> Планирую
        </span>
      </div>
    </div>
  );
};

export default WorldMap;
