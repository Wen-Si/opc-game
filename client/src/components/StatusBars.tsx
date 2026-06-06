import type { GameState } from '../types';
import { CHAPTER_NAMES, PHASE_LABELS } from '../types';

interface StatusBarsProps {
  gameState: GameState;
}

function ProgressBar({
  value,
  max = 100,
  color,
  label,
  showValue = true,
}: {
  value: number;
  max?: number;
  color: string;
  label: string;
  showValue?: boolean;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const getColor = () => {
    if (percentage > 60) return color;
    if (percentage > 30) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted w-8">{label}</span>
      <div className="rpg-progress flex-1">
        <div
          className="rpg-progress-fill animate-progress-fill"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${getColor()}cc, ${getColor()})`,
          }}
        />
      </div>
      {showValue && (
        <span className="text-xs text-text-secondary w-8 text-right">{value}</span>
      )}
    </div>
  );
}

export default function StatusBars({ gameState }: StatusBarsProps) {
  const { character, company, currentDay, currentMonth, currentYear, chapter } = gameState;

  return (
    <div className="rpg-panel px-4 py-3">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Character info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
              {character.level}
            </div>
            <div>
              <span className="text-sm font-bold text-text-primary">{character.name}</span>
              <span className="text-xs text-text-muted ml-2">@ {company.name}</span>
            </div>
          </div>
          <div className="h-6 w-px bg-gray-700" />
          <div className="flex items-center gap-1">
            <span className="text-xs text-amber-400">
              {CHAPTER_NAMES[chapter] || `第${chapter}章`}
            </span>
          </div>
        </div>

        {/* Center: Status bars */}
        <div className="flex-1 max-w-md space-y-1">
          <div className="flex gap-4">
            <ProgressBar value={character.health} color="#ef4444" label="HP" />
            <ProgressBar value={character.energy} color="#3b82f6" label="EP" />
          </div>
          <div className="flex gap-4">
            <ProgressBar value={character.morale} color="#f59e0b" label="士气" />
            <ProgressBar value={character.mentalHealth} color="#8b5cf6" label="心理" />
          </div>
        </div>

        {/* Right: Date & Cash */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-text-muted">日期</div>
            <div className="text-sm font-mono text-cyan-400">
              第{currentYear}年/{currentMonth}月/{currentDay}日
            </div>
          </div>
          <div className="h-6 w-px bg-gray-700" />
          <div className="text-center">
            <div className="text-xs text-text-muted">现金</div>
            <div
              className={`text-lg font-bold font-mono ${
                company.cash >= 0 ? 'text-amber-400 text-glow-gold' : 'text-red-400'
              }`}
            >
              ${company.cash.toLocaleString()}
            </div>
          </div>
          <div className="h-6 w-px bg-gray-700" />
          <div className="text-center">
            <div className="text-xs text-text-muted">阶段</div>
            <div className="text-sm text-green-400">
              {PHASE_LABELS[company.phase] || company.phase}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
