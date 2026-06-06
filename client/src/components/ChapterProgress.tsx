import type { GameState } from '../types';
import { CHAPTER_NAMES } from '../types';

interface ChapterProgressProps {
  gameState: GameState;
}

export default function ChapterProgress({ gameState }: ChapterProgressProps) {
  const { chapter } = gameState;
  const totalChapters = 7;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalChapters }).map((_, i) => {
        const chapterNum = i + 1;
        const isActive = chapterNum === chapter;
        const isCompleted = chapterNum < chapter;

        return (
          <div key={i} className="flex items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                isCompleted
                  ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                  : isActive
                    ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50 animate-glow-pulse'
                    : 'bg-bg-secondary text-text-muted border border-gray-700'
              }`}
              title={CHAPTER_NAMES[chapterNum] || `第${chapterNum}章`}
            >
              {isCompleted ? '+' : chapterNum}
            </div>
            {i < totalChapters - 1 && (
              <div
                className={`w-4 h-0.5 ${
                  isCompleted ? 'bg-green-500/50' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
