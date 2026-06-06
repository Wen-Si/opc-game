import type { GameState } from '../types';
import { PHASE_LABELS } from '../types';

interface CompanyPanelProps {
  gameState: GameState;
}

function MetricRow({ label, value, color, suffix = '' }: { label: string; value: number | string; color?: string; suffix?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-800/50 last:border-0">
      <span className="text-xs text-text-muted">{label}</span>
      <span className={`text-sm font-bold ${color || 'text-text-primary'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </span>
    </div>
  );
}

export default function CompanyPanel({ gameState }: CompanyPanelProps) {
  const { company } = gameState;

  const phaseIndex = ['idea', 'mvp', 'seed', 'growth', 'expansion', 'mature', 'ipo'].indexOf(company.phase);
  const phaseProgress = Math.max(0, (phaseIndex / 6) * 100);

  return (
    <div className="rpg-card p-4 h-full flex flex-col">
      {/* Company Name */}
      <div className="text-center mb-4">
        <h3 className="text-sm font-bold text-text-primary">{company.name}</h3>
        <span className="text-xs text-cyan-400">{PHASE_LABELS[company.phase] || company.phase}</span>
      </div>

      {/* Phase Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-text-muted">公司发展</span>
          <span className="text-cyan-400">{phaseIndex + 1}/7</span>
        </div>
        <div className="rpg-progress">
          <div
            className="rpg-progress-fill bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-500"
            style={{ width: `${phaseProgress}%` }}
          />
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="space-y-0 mb-4">
        <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">财务数据</h4>
        <MetricRow label="现金" value={`$${company.cash.toLocaleString()}`} color={company.cash >= 0 ? 'text-green-400' : 'text-red-400'} />
        <MetricRow label="月收入" value={`+$${company.monthlyRevenue.toLocaleString()}`} color="text-green-400" />
        <MetricRow label="月支出" value={`-$${company.monthlyExpense.toLocaleString()}`} color="text-red-400" />
        <MetricRow label="累计利润" value={`$${company.totalProfit.toLocaleString()}`} color={company.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'} />
      </div>

      {/* Business Metrics */}
      <div className="space-y-0 mb-4">
        <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">经营数据</h4>
        <MetricRow label="产品质量" value={company.productQuality} color="text-purple-400" suffix="%" />
        <MetricRow label="市场份额" value={company.marketShare} color="text-cyan-400" suffix="%" />
        <MetricRow label="客户数" value={company.clients} color="text-blue-400" />
        <MetricRow label="团队规模" value={company.teamSize} color="text-amber-400" suffix="人" />
        <MetricRow label="办公室" value={`Lv.${company.officeLevel}`} color="text-text-secondary" />
      </div>

      {/* Projects */}
      <div className="mt-auto">
        <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">项目统计</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
            <div className="text-lg font-bold text-green-400">{company.completedProjects}</div>
            <div className="text-xs text-text-muted">完成</div>
          </div>
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
            <div className="text-lg font-bold text-red-400">{company.failedProjects}</div>
            <div className="text-xs text-text-muted">失败</div>
          </div>
        </div>
      </div>
    </div>
  );
}
