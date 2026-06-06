import type { GameState, CharacterStats } from '../types';
import { STAT_LABELS, STAT_COLORS } from '../types';

interface CharacterPanelProps {
  gameState: GameState;
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="rpg-progress">
        <div
          className="rpg-progress-fill"
          style={{
            width: `${Math.min(100, value)}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

export default function CharacterPanel({ gameState }: CharacterPanelProps) {
  const { character } = gameState;
  const expForLevel = character.level * 100;
  const expProgress = (character.experience / expForLevel) * 100;

  return (
    <div className="rpg-card p-4 h-full flex flex-col">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 p-0.5 animate-glow-pulse">
          <div className="w-full h-full rounded-full bg-bg-card flex items-center justify-center">
            <span className="text-3xl font-bold bg-gradient-to-b from-amber-300 to-amber-500 bg-clip-text text-transparent">
              {character.name.charAt(0)}
            </span>
          </div>
        </div>
        <h3 className="text-sm font-bold text-text-primary mt-2">{character.name}</h3>
        <span className="text-xs text-amber-400">Lv.{character.level} 创始人</span>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-text-muted">经验值</span>
          <span className="text-cyan-400">{character.experience}/{expForLevel}</span>
        </div>
        <div className="rpg-progress">
          <div
            className="rpg-progress-fill bg-gradient-to-r from-cyan-600 to-cyan-400"
            style={{ width: `${expProgress}%` }}
          />
        </div>
      </div>

      {/* Skill Points */}
      <div className="flex items-center justify-between mb-4 p-2 rounded-lg bg-bg-secondary border border-amber-500/20">
        <span className="text-xs text-text-secondary">可用技能点</span>
        <span className="text-lg font-bold text-amber-400 text-glow-gold">
          {character.skillPoints}
        </span>
      </div>

      {/* Stats */}
      <div className="flex-1 space-y-2.5 overflow-y-auto">
        <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">属性面板</h4>
        {(Object.keys(STAT_LABELS) as Array<keyof CharacterStats>).map((key) => (
          <StatBar
            key={key}
            label={STAT_LABELS[key]}
            value={character.stats[key]}
            color={STAT_COLORS[key]}
          />
        ))}
      </div>

      {/* Burnout Warning */}
      {character.burnoutRisk > 30 && (
        <div
          className={`mt-3 p-2 rounded-lg text-xs text-center ${
            character.burnoutRisk > 70
              ? 'bg-red-500/20 border border-red-500/40 text-red-300'
              : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
          }`}
        >
          {character.burnoutRisk > 70
            ? '严重倦怠风险！请注意休息！'
            : '倦怠风险上升，注意调节'}
        </div>
      )}
    </div>
  );
}
