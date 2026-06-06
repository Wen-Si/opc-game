import type { GameState, ActionRequest } from '../types';

interface ActionPanelProps {
  gameState: GameState;
  onAction: (action: ActionRequest) => void;
}

interface ActionItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  energyCost: number;
  category: string;
  effects: Record<string, number>;
  requirements?: Record<string, number>;
}

const ACTIONS: ActionItem[] = [
  {
    id: 'develop_product',
    name: '开发产品',
    description: '投入精力改进产品功能和用户体验',
    icon: '>>',
    energyCost: 20,
    category: '产品',
    effects: { technical: 2, productQuality: 5, energy: -20 },
  },
  {
    id: 'marketing_campaign',
    name: '营销推广',
    description: '开展市场推广活动，获取更多客户',
    icon: '>>',
    energyCost: 15,
    category: '营销',
    effects: { marketing: 2, marketShare: 3, clients: 1, energy: -15, cash: -5000 },
  },
  {
    id: 'hire_employee',
    name: '招聘员工',
    description: '招募新成员加入团队',
    icon: '>>',
    energyCost: 10,
    category: '团队',
    effects: { teamSize: 1, monthlyExpense: 8000, energy: -10, cash: -5000 },
  },
  {
    id: 'network_event',
    name: '参加社交活动',
    description: '参加行业会议和社交活动，拓展人脉',
    icon: '>>',
    energyCost: 15,
    category: '社交',
    effects: { networking: 3, reputation: 2, energy: -15 },
  },
  {
    id: 'rest',
    name: '休息恢复',
    description: '好好休息，恢复精力和心理健康',
    icon: '>>',
    energyCost: 0,
    category: '恢复',
    effects: { energy: 30, health: 10, mentalHealth: 15, morale: 5 },
  },
  {
    id: 'research',
    name: '市场调研',
    description: '深入研究市场趋势和竞争对手',
    icon: '>>',
    energyCost: 15,
    category: '研究',
    effects: { marketing: 1, creativity: 1, energy: -15 },
  },
  {
    id: 'pitch_investor',
    name: '路演融资',
    description: '向投资人展示你的创业项目',
    icon: '>>',
    energyCost: 25,
    category: '融资',
    effects: { finance: 2, networking: 2, energy: -25, morale: -5 },
  },
  {
    id: 'upgrade_office',
    name: '升级办公室',
    description: '改善办公环境，提升团队效率',
    icon: '>>',
    energyCost: 10,
    category: '基础设施',
    effects: { officeLevel: 1, cash: -20000, morale: 5, energy: -10 },
  },
];

function getCategoryColor(category: string) {
  switch (category) {
    case '产品': return 'border-blue-500/30 bg-blue-500/10';
    case '营销': return 'border-pink-500/30 bg-pink-500/10';
    case '团队': return 'border-amber-500/30 bg-amber-500/10';
    case '社交': return 'border-cyan-500/30 bg-cyan-500/10';
    case '恢复': return 'border-green-500/30 bg-green-500/10';
    case '研究': return 'border-purple-500/30 bg-purple-500/10';
    case '融资': return 'border-amber-500/30 bg-amber-500/10';
    case '基础设施': return 'border-gray-500/30 bg-gray-500/10';
    default: return 'border-gray-500/30 bg-gray-500/10';
  }
}

export default function ActionPanel({ gameState, onAction }: ActionPanelProps) {
  const { character, company } = gameState;
  const categories = [...new Set(ACTIONS.map((a) => a.category))];

  return (
    <div className="animate-fade-in">
      <div className="rpg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary text-glow-blue">
            可执行行动
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">精力:</span>
            <span className={`text-sm font-bold ${character.energy > 30 ? 'text-blue-400' : 'text-red-400'}`}>
              {character.energy}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-xs text-text-muted uppercase tracking-wider mb-2">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ACTIONS.filter((a) => a.category === category).map((action) => {
                  const canAfford = character.energy >= action.energyCost &&
                    company.cash >= (action.effects.cash ? Math.abs(action.effects.cash) : 0);

                  return (
                    <button
                      key={action.id}
                      onClick={() => canAfford && onAction({
                        action: action.id,
                        params: action.effects,
                      })}
                      disabled={!canAfford}
                      className={`text-left p-3 rounded-lg border transition-all duration-200 ${
                        canAfford
                          ? `${getCategoryColor(category)} hover:scale-[1.01] cursor-pointer`
                          : 'border-gray-800 bg-bg-secondary/20 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-text-primary">{action.name}</span>
                        <span className="text-xs text-text-muted">
                          {action.energyCost > 0 ? `-${action.energyCost} EP` : '免费'}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mb-2">{action.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(action.effects)
                          .filter(([key]) => key !== 'energy')
                          .map(([key, value]) => {
                            const numVal = Number(value);
                            if (numVal === 0) return null;
                            return (
                              <span
                                key={key}
                                className={`text-xs px-1 py-0.5 rounded ${
                                  numVal > 0
                                    ? 'bg-green-500/15 text-green-400'
                                    : 'bg-red-500/15 text-red-400'
                                }`}
                              >
                                {key} {numVal > 0 ? '+' : ''}{numVal}
                              </span>
                            );
                          })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
