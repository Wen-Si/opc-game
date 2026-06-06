import { useState } from 'react';
import type { CreateGameRequest, ActionRequest } from './types';
import { useGameState } from './hooks/useGameState';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/GamePage';

function App() {
  const {
    gameState,
    loading,
    error,
    initGame,
    nextDay,
    executeAction,
    learnSkill,
    resetGame,
    cashChanged,
  } = useGameState();

  const [created, setCreated] = useState(false);

  const handleCreateGame = async (data: CreateGameRequest) => {
    await initGame(data);
    setCreated(true);
  };

  const handleExecuteAction = async (action: ActionRequest) => {
    if (action.action === 'learn_skill' && action.params?.skillId) {
      await learnSkill(String(action.params.skillId));
    } else {
      await executeAction(action);
    }
  };

  const handleReset = () => {
    resetGame();
    setCreated(false);
  };

  // Loading screen
  if (loading && !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary bg-grid">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">正在初始化游戏世界...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error && !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary bg-grid">
        <div className="rpg-card p-8 max-w-md text-center animate-card-appear">
          <h2 className="text-xl font-bold text-red-400 mb-4">出错了</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button onClick={handleReset} className="rpg-btn rpg-btn-primary">
            返回登录
          </button>
        </div>
      </div>
    );
  }

  // Login page
  if (!created || !gameState) {
    return <LoginPage onCreateGame={handleCreateGame} loading={loading} />;
  }

  // Game page
  return (
    <GamePage
      gameState={gameState}
      loading={loading}
      onNextDay={nextDay}
      onExecuteAction={handleExecuteAction}
      onResetGame={handleReset}
      cashChanged={cashChanged}
    />
  );
}

export default App;
