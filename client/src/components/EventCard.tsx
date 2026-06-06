import type { GameEvent, CharacterStats } from '../types';

interface EventCardProps {
  event: GameEvent;
  characterStats: CharacterStats;
  onChoice: (choiceId: string) => void;
}

function getRiskColor(riskLevel?: string) {
  switch (riskLevel) {
    case 'low': return { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400', label: '低风险' };
    case 'medium': return { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', label: '中风险' };
    case 'high': return { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', label: '高风险' };
    default: return { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', label: '' };
  }
}

function getEventTypeLabel(type: string) {
  switch (type) {
    case 'story': return { label: '剧情事件', color: 'text-purple-400', bg: 'bg-purple-500/20' };
    case 'crisis': return { label: '危机事件', color: 'text-red-400', bg: 'bg-red-500/20' };
    case 'opportunity': return { label: '机遇事件', color: 'text-green-400', bg: 'bg-green-500/20' };
    case 'random': return { label: '随机事件', color: 'text-cyan-400', bg: 'bg-cyan-500/20' };
    default: return { label: '事件', color: 'text-blue-400', bg: 'bg-blue-500/20' };
  }
}

export default function EventCard({ event, characterStats, onChoice }: EventCardProps) {
  const typeInfo = getEventTypeLabel(event.type);

  return (
    <div className="animate-card-appear">
      <div className="rpg-card p-6 border-blue-500/30 animate-border-glow">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${typeInfo.bg} ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
            {event.chapter && (
              <span className="text-xs text-text-muted">第{event.chapter}章</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-text-primary mb-3 text-glow-blue">
          {event.title}
        </h2>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          {event.description}
        </p>

        {/* Choices */}
        <div className="space-y-3">
          <h4 className="text-xs text-text-muted uppercase tracking-wider">选择你的行动：</h4>
          {event.choices.map((choice, index) => {
            const riskInfo = getRiskColor(choice.riskLevel);
            const meetsRequirements = !choice.requirements ||
              Object.entries(choice.requirements).every(
                ([key, value]) => characterStats[key as keyof CharacterStats] >= (value as number)
              );

            return (
              <button
                key={choice.id}
                onClick={() => meetsRequirements && onChoice(choice.id)}
                disabled={!meetsRequirements}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  meetsRequirements
                    ? 'bg-bg-secondary/50 border-blue-500/20 hover:border-blue-500/50 hover:bg-bg-hover cursor-pointer hover:glow-blue'
                    : 'bg-bg-secondary/20 border-gray-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    meetsRequirements
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-gray-700 text-gray-500 border border-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary mb-2">{choice.text}</p>
                    {/* Effects preview */}
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(choice.effects).map(([key, value]) => {
                        const numVal = Number(value);
                        return (
                          <span
                            key={key}
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              numVal > 0
                                ? 'bg-green-500/15 text-green-400'
                                : numVal < 0
                                  ? 'bg-red-500/15 text-red-400'
                                  : 'bg-gray-500/15 text-gray-400'
                            }`}
                          >
                            {key} {numVal > 0 ? '+' : ''}{numVal}
                          </span>
                        );
                      })}
                    </div>
                    {/* Risk level */}
                    {choice.riskLevel && (
                      <span className={`text-xs ml-2 px-1.5 py-0.5 rounded ${riskInfo.bg} ${riskInfo.text}`}>
                        {riskInfo.label}
                      </span>
                    )}
                    {/* Requirements not met */}
                    {!meetsRequirements && choice.requirements && (
                      <div className="mt-1 text-xs text-red-400">
                        需要: {Object.entries(choice.requirements).map(([k, v]) => `${k} >= ${v}`).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
