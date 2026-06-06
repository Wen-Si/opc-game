import type { GameState } from '../types';
import { CHAPTER_NAMES, PHASE_LABELS } from '../types';

interface DashboardViewProps {
  gameState: GameState;
}

export default function DashboardView({ gameState }: DashboardViewProps) {
  const { character, company, currentDay, currentMonth, currentYear, chapter, gameLog } = gameState;
  const recentLogs = gameLog.slice(-5).reverse();

  return (
    <div className="animate-fade-in space-y-4">
      {/* Welcome Card */}
      <div className="rpg-card p-6 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-1">
              欢迎回来，{character.name}
            </h2>
            <p className="text-text-secondary text-sm">
              {CHAPTER_NAMES[chapter] || `第${chapter}章`} - {PHASE_LABELS[company.phase] || company.phase}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-muted">当前日期</div>
            <div className="text-lg font-mono text-cyan-400">
              {currentYear}年{currentMonth}月{currentDay}日
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rpg-card p-4 text-center">
          <div className="text-xs text-text-muted mb-1">现金</div>
          <div className={`text-xl font-bold font-mono ${company.cash >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
            ${company.cash.toLocaleString()}
          </div>
        </div>
        <div className="rpg-card p-4 text-center">
          <div className="text-xs text-text-muted mb-1">声望</div>
          <div className="text-xl font-bold text-purple-400">{character.reputation}</div>
        </div>
        <div className="rpg-card p-4 text-center">
          <div className="text-xs text-text-muted mb-1">客户数</div>
          <div className="text-xl font-bold text-cyan-400">{company.clients}</div>
        </div>
        <div className="rpg-card p-4 text-center">
          <div className="text-xs text-text-muted mb-1">团队</div>
          <div className="text-xl font-bold text-blue-400">{company.teamSize}人</div>
        </div>
      </div>

      {/* Company Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rpg-card p-4">
          <h3 className="text-sm font-bold text-text-primary mb-3">公司概览 - {company.name}</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">产品质量</span>
                <span className="text-purple-400">{company.productQuality}%</span>
              </div>
              <div className="rpg-progress">
                <div
                  className="rpg-progress-fill bg-gradient-to-r from-purple-600 to-purple-400"
                  style={{ width: `${company.productQuality}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">市场份额</span>
                <span className="text-cyan-400">{company.marketShare}%</span>
              </div>
              <div className="rpg-progress">
                <div
                  className="rpg-progress-fill bg-gradient-to-r from-cyan-600 to-cyan-400"
                  style={{ width: `${company.marketShare}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">团队士气</span>
                <span className="text-amber-400">{character.morale}%</span>
              </div>
              <div className="rpg-progress">
                <div
                  className="rpg-progress-fill bg-gradient-to-r from-amber-600 to-amber-400"
                  style={{ width: `${character.morale}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rpg-card p-4">
          <h3 className="text-sm font-bold text-text-primary mb-3">最近动态</h3>
          <div className="space-y-2">
            {recentLogs.length === 0 ? (
              <p className="text-text-muted text-xs">暂无动态</p>
            ) : (
              recentLogs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-xs"
                >
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    log.type === 'system' ? 'bg-blue-500' :
                    log.type === 'event' ? 'bg-amber-500' :
                    log.type === 'action' ? 'bg-green-500' :
                    log.type === 'danger' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`} />
                  <span className="text-text-secondary">
                    <span className="text-text-muted">Day {log.day}:</span> {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="rpg-card p-4 bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/20">
        <div className="flex items-start gap-2">
          <span className="text-amber-400 text-sm">!</span>
          <div>
            <h4 className="text-xs font-bold text-amber-400 mb-1">今日提示</h4>
            <p className="text-xs text-text-secondary">
              {character.energy < 30
                ? '你的精力不足，建议休息恢复后再行动。'
                : character.burnoutRisk > 50
                  ? '倦怠风险较高，注意劳逸结合，适当安排休息时间。'
                  : company.cash < 10000
                    ? '资金紧张，考虑寻求融资或削减开支。'
                    : company.teamSize < 3 && company.phase !== 'idea'
                      ? '团队规模较小，考虑招聘更多成员来加速发展。'
                      : '合理分配精力，在产品开发、营销推广和团队建设之间找到平衡。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
