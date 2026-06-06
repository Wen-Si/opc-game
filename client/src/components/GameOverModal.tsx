import type { GameState } from '../types';
import { CHAPTER_NAMES } from '../types';

interface GameOverModalProps {
  gameState: GameState;
  onRestart: () => void;
  onClose: () => void;
}

export default function GameOverModal({ gameState, onRestart, onClose }: GameOverModalProps) {
  const { character, company, currentDay, currentMonth, currentYear, gameOverReason } = gameState;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="rpg-card p-8 max-w-lg w-full mx-4 animate-card-appear border-red-500/30">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-red-400 mb-2 text-glow-blue">
            游戏结束
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        </div>

        {/* Reason */}
        <div className="rpg-card p-4 mb-6 bg-red-500/10 border-red-500/20">
          <p className="text-text-secondary text-sm text-center">{gameOverReason}</p>
        </div>

        {/* Final Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rpg-card p-3 text-center">
            <div className="text-xs text-text-muted">存活天数</div>
            <div className="text-lg font-bold text-cyan-400">
              {(currentYear - 1) * 360 + (currentMonth - 1) * 30 + currentDay}
            </div>
          </div>
          <div className="rpg-card p-3 text-center">
            <div className="text-xs text-text-muted">最终等级</div>
            <div className="text-lg font-bold text-amber-400">Lv.{character.level}</div>
          </div>
          <div className="rpg-card p-3 text-center">
            <div className="text-xs text-text-muted">完成项目</div>
            <div className="text-lg font-bold text-green-400">{company.completedProjects}</div>
          </div>
          <div className="rpg-card p-3 text-center">
            <div className="text-xs text-text-muted">最终章节</div>
            <div className="text-lg font-bold text-purple-400">
              {CHAPTER_NAMES[gameState.chapter] || `第${gameState.chapter}章`}
            </div>
          </div>
          <div className="rpg-card p-3 text-center">
            <div className="text-xs text-text-muted">团队规模</div>
            <div className="text-lg font-bold text-blue-400">{company.teamSize}人</div>
          </div>
          <div className="rpg-card p-3 text-center">
            <div className="text-xs text-text-muted">累计利润</div>
            <div className={`text-lg font-bold ${company.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${company.totalProfit.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Achievements */}
        {gameState.achievements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-amber-400 mb-2">获得成就</h3>
            <div className="flex flex-wrap gap-2">
              {gameState.achievements.map((achievement, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30"
                >
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="rpg-btn flex-1">
            查看最终状态
          </button>
          <button onClick={onRestart} className="rpg-btn rpg-btn-gold flex-1">
            重新开始
          </button>
        </div>
      </div>
    </div>
  );
}
