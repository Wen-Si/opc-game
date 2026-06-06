import { useState, useEffect } from 'react';
import type { GameState, ViewType, PageType, ActionRequest } from '../types';
import StatusBars from '../components/StatusBars';
import CharacterPanel from '../components/CharacterPanel';
import CompanyPanel from '../components/CompanyPanel';
import EventCard from '../components/EventCard';
import ActionPanel from '../components/ActionPanel';
import DashboardView from '../components/DashboardView';
import BottomBar from '../components/BottomBar';
import GameOverModal from '../components/GameOverModal';
import NotificationToast from '../components/NotificationToast';
import type { Notification } from '../types';

interface GamePageProps {
  gameState: GameState;
  loading: boolean;
  onNextDay: () => void;
  onExecuteAction: (action: ActionRequest) => void;
  onResetGame: () => void;
  cashChanged: boolean;
}

export default function GamePage({
  gameState,
  loading,
  onNextDay,
  onExecuteAction,
  onResetGame,
  cashChanged,
}: GamePageProps) {
  const [currentView, setCurrentView] = useState<ViewType>(
    gameState.currentEvent ? 'event' : 'dashboard'
  );
  const [currentPage, setCurrentPage] = useState<PageType>('game');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);

  useEffect(() => {
    if (gameState.currentEvent) {
      setCurrentView('event');
    }
  }, [gameState.currentEvent]);

  useEffect(() => {
    if (gameState.isGameOver) {
      setShowGameOver(true);
    }
  }, [gameState.isGameOver]);

  useEffect(() => {
    if (cashChanged) {
      addNotification('info', '资金变动');
    }
  }, [cashChanged]);

  const addNotification = (type: Notification['type'], message: string) => {
    const id = `n-${Date.now()}`;
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNextDay = () => {
    onNextDay();
    setCurrentView('dashboard');
  };

  const handleAction = (action: ActionRequest) => {
    onExecuteAction(action);
    addNotification('success', '行动已执行');
  };

  const handleChoice = (choiceId: string) => {
    const event = gameState.currentEvent;
    if (!event) return;
    const choice = event.choices.find((c) => c.id === choiceId);
    if (choice) {
      onExecuteAction({
        action: 'event_choice',
        choiceId,
        params: { ...choice.effects },
      });
      setCurrentView('dashboard');
    }
  };

  // Render sub-pages
  if (currentPage === 'skillTree') {
    return (
      <div className="min-h-screen bg-bg-primary bg-grid">
        <StatusBars gameState={gameState} />
        <div className="p-4">
          <div className="rpg-card p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-amber-400 mb-6 text-glow-gold">
              技能树
            </h2>
            <p className="text-text-secondary mb-4">
              可用技能点: <span className="text-amber-400 font-bold text-lg">{gameState.character.skillPoints}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameState.skills.map((skill) => {
                const prereqSkill = skill.prerequisite
                  ? gameState.skills.find((s) => s.id === skill.prerequisite)
                  : undefined;
                const canLearn =
                  skill.currentLevel < skill.maxLevel &&
                  gameState.character.skillPoints >= skill.cost &&
                  (!skill.prerequisite || (prereqSkill && prereqSkill.currentLevel > 0));
                const prereqMet = !skill.prerequisite || (prereqSkill && prereqSkill.currentLevel > 0);

                return (
                  <div
                    key={skill.id}
                    className={`rpg-card p-4 transition-all ${
                      canLearn ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-60'
                    } ${!prereqMet ? 'border-gray-800' : ''}`}
                    onClick={() => canLearn && onExecuteAction({ action: 'learn_skill', params: { skillId: skill.id } })}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-cyan-300">{skill.name}</h3>
                      <span className="text-xs text-text-muted">
                        Lv.{skill.currentLevel}/{skill.maxLevel}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mb-3">{skill.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-400">花费: {skill.cost}点</span>
                      {canLearn && (
                        <span className="text-xs text-green-400">可学习</span>
                      )}
                      {!prereqMet && (
                        <span className="text-xs text-red-400">需要前置技能</span>
                      )}
                    </div>
                    {/* Level indicators */}
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: skill.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${
                            i < skill.currentLevel ? 'bg-cyan-500' : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <BottomBar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onNextDay={handleNextDay}
          loading={loading}
          hasEvent={!!gameState.currentEvent}
        />
      </div>
    );
  }

  if (currentPage === 'finance') {
    return (
      <div className="min-h-screen bg-bg-primary bg-grid">
        <StatusBars gameState={gameState} />
        <div className="p-4">
          <div className="rpg-card p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-glow-cyan">
              财务详情
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cash Flow */}
              <div className="rpg-card p-4">
                <h3 className="text-lg font-bold text-text-primary mb-4">现金流概览</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">现金余额</span>
                    <span className={`text-xl font-bold ${gameState.company.cash >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${gameState.company.cash.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">月收入</span>
                    <span className="text-green-400 font-bold">
                      +${gameState.company.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">月支出</span>
                    <span className="text-red-400 font-bold">
                      -${gameState.company.monthlyExpense.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-gray-700 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">月净收入</span>
                    <span className={`font-bold ${
                      gameState.company.monthlyRevenue - gameState.company.monthlyExpense >= 0
                        ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${(gameState.company.monthlyRevenue - gameState.company.monthlyExpense).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">累计利润</span>
                    <span className={`font-bold ${
                      gameState.company.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${gameState.company.totalProfit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="rpg-card p-4">
                <h3 className="text-lg font-bold text-text-primary mb-4">收支对比</h3>
                <div className="space-y-4 mt-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">月收入</span>
                      <span className="text-green-400">${gameState.company.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="rpg-progress">
                      <div
                        className="rpg-progress-fill bg-gradient-to-r from-green-600 to-green-400"
                        style={{ width: `${Math.min(100, (gameState.company.monthlyRevenue / 100000) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">月支出</span>
                      <span className="text-red-400">${gameState.company.monthlyExpense.toLocaleString()}</span>
                    </div>
                    <div className="rpg-progress">
                      <div
                        className="rpg-progress-fill bg-gradient-to-r from-red-600 to-red-400"
                        style={{ width: `${Math.min(100, (gameState.company.monthlyExpense / 100000) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">现金储备</span>
                      <span className="text-amber-400">${gameState.company.cash.toLocaleString()}</span>
                    </div>
                    <div className="rpg-progress">
                      <div
                        className="rpg-progress-fill bg-gradient-to-r from-amber-600 to-amber-400"
                        style={{ width: `${Math.min(100, Math.max(0, (gameState.company.cash / 500000) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Burn Rate */}
              <div className="rpg-card p-4">
                <h3 className="text-lg font-bold text-text-primary mb-4">关键指标</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">烧钱速率</span>
                    <span className="text-text-primary">
                      ${Math.max(0, gameState.company.monthlyExpense - gameState.company.monthlyRevenue).toLocaleString()}/月
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">跑道</span>
                    <span className="text-amber-400">
                      {gameState.company.monthlyExpense > gameState.company.monthlyRevenue
                        ? `${Math.floor(gameState.company.cash / Math.max(1, gameState.company.monthlyExpense - gameState.company.monthlyRevenue))} 个月`
                        : '无限'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">团队规模</span>
                    <span className="text-cyan-400">{gameState.company.teamSize} 人</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">客户数</span>
                    <span className="text-purple-400">{gameState.company.clients}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="rpg-card p-4">
                <h3 className="text-lg font-bold text-text-primary mb-4">财务操作</h3>
                <div className="space-y-2">
                  <button className="rpg-btn w-full text-left" onClick={() => handleAction({ action: 'seek_funding', params: { cash: 50000 } })}>
                    寻求种子轮融资 (+$50,000)
                  </button>
                  <button className="rpg-btn w-full text-left" onClick={() => handleAction({ action: 'seek_funding', params: { cash: 200000 } })}>
                    寻求A轮融资 (+$200,000)
                  </button>
                  <button className="rpg-btn w-full text-left" onClick={() => handleAction({ action: 'cut_costs', params: { expense: -5000 } })}>
                    削减开支 (-$5,000/月)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BottomBar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onNextDay={handleNextDay}
          loading={loading}
          hasEvent={!!gameState.currentEvent}
        />
      </div>
    );
  }

  if (currentPage === 'history') {
    return (
      <div className="min-h-screen bg-bg-primary bg-grid">
        <StatusBars gameState={gameState} />
        <div className="p-4">
          <div className="rpg-card p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-purple-400 mb-6 text-glow-blue">
              历史日志
            </h2>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {gameState.gameLog.map((entry, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-3 rounded-lg bg-bg-secondary/50 border border-gray-800 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <span className="text-xs text-text-muted">第{entry.day}天</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    entry.type === 'system' ? 'bg-blue-500' :
                    entry.type === 'event' ? 'bg-amber-500' :
                    entry.type === 'action' ? 'bg-green-500' :
                    entry.type === 'danger' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`} />
                  <p className="text-sm text-text-secondary">{entry.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <BottomBar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onNextDay={handleNextDay}
          loading={loading}
          hasEvent={!!gameState.currentEvent}
        />
      </div>
    );
  }

  // Main Game Page
  return (
    <div className="min-h-screen bg-bg-primary bg-grid flex flex-col">
      {/* Notifications */}
      <NotificationToast
        notifications={notifications}
        onDismiss={removeNotification}
      />

      {/* Top Status Bar */}
      <StatusBars gameState={gameState} />

      {/* Main Content Area */}
      <div className="flex-1 flex gap-3 p-3 min-h-0">
        {/* Left Panel - Character */}
        <div className="w-64 flex-shrink-0 animate-slide-left">
          <CharacterPanel gameState={gameState} />
        </div>

        {/* Center - Main Content */}
        <div className="flex-1 min-w-0">
          {currentView === 'dashboard' && (
            <DashboardView gameState={gameState} />
          )}
          {currentView === 'event' && gameState.currentEvent && (
            <EventCard
              event={gameState.currentEvent}
              characterStats={gameState.character.stats}
              onChoice={handleChoice}
            />
          )}
          {currentView === 'action' && (
            <ActionPanel
              gameState={gameState}
              onAction={handleAction}
            />
          )}
        </div>

        {/* Right Panel - Company */}
        <div className="w-64 flex-shrink-0 animate-slide-right">
          <CompanyPanel gameState={gameState} />
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomBar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onNextDay={handleNextDay}
        loading={loading}
        hasEvent={!!gameState.currentEvent}
        onViewChange={setCurrentView}
      />

      {/* Game Over Modal */}
      {showGameOver && (
        <GameOverModal
          gameState={gameState}
          onRestart={onResetGame}
          onClose={() => setShowGameOver(false)}
        />
      )}
    </div>
  );
}
