import type { PageType, ViewType } from '../types';

interface BottomBarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onNextDay: () => void;
  loading: boolean;
  hasEvent: boolean;
  onViewChange?: (view: ViewType) => void;
}

interface NavButton {
  id: PageType;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavButton[] = [
  { id: 'game', label: '游戏', icon: '[G]' },
  { id: 'skillTree', label: '技能树', icon: '[S]' },
  { id: 'finance', label: '财务', icon: '[$]' },
  { id: 'history', label: '日志', icon: '[L]' },
];

export default function BottomBar({
  currentPage,
  onNavigate,
  onNextDay,
  loading,
  hasEvent,
  onViewChange,
}: BottomBarProps) {
  return (
    <div className="rpg-panel px-4 py-2 flex items-center justify-between gap-4">
      {/* Left: Navigation */}
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 glow-blue'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-transparent'
            }`}
          >
            <span className="mr-1.5 text-xs font-mono">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Center: View switcher (only on game page) */}
      {currentPage === 'game' && onViewChange && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewChange('dashboard')}
            className="px-3 py-1.5 rounded text-xs text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all"
          >
            仪表盘
          </button>
          {hasEvent && (
            <button
              onClick={() => onViewChange('event')}
              className="px-3 py-1.5 rounded text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all animate-glow-pulse"
            >
              事件!
            </button>
          )}
          <button
            onClick={() => onViewChange('action')}
            className="px-3 py-1.5 rounded text-xs text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all"
          >
            行动
          </button>
        </div>
      )}

      {/* Right: Next Day Button */}
      <button
        onClick={onNextDay}
        disabled={loading}
        className={`rpg-btn rpg-btn-gold px-6 py-2.5 flex items-center gap-2 text-sm font-bold ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            处理中...
          </>
        ) : (
          <>
            <span className="text-lg">+</span>
            下一天
          </>
        )}
      </button>
    </div>
  );
}
