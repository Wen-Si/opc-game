import { useState } from 'react';
import type { CreateGameRequest } from '../types';
import { INDUSTRY_OPTIONS } from '../types';

interface LoginPageProps {
  onCreateGame: (data: CreateGameRequest) => void;
  loading: boolean;
}

export default function LoginPage({ onCreateGame, loading }: LoginPageProps) {
  const [userId, setUserId] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('tech');
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!userId.trim() || !characterName.trim() || !companyName.trim()) {
      setError('请填写所有必填项');
      return;
    }
    setError('');
    onCreateGame({
      userId: userId.trim(),
      characterName: characterName.trim(),
      companyName: companyName.trim(),
      industry,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step < 2) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Title */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-amber-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent text-glow-gold">
            OPC 创业模拟
          </h1>
          <p className="text-text-secondary text-lg tracking-wider">
            ENTREPRENEURSHIP SIMULATION RPG
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </div>

        {/* Form Card */}
        <div className="rpg-card p-8 animate-card-appear">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    i <= step
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white glow-blue'
                      : 'bg-bg-secondary text-text-muted border border-gray-700'
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 h-0.5 transition-all duration-300 ${
                      i < step ? 'bg-blue-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 0: User ID */}
          {step === 0 && (
            <div className="animate-fade-in" onKeyDown={handleKeyDown}>
              <label className="block text-text-secondary text-sm mb-2 uppercase tracking-wider">
                玩家 ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="输入你的唯一ID..."
                className="w-full p-3 bg-bg-secondary border border-gray-700 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                autoFocus
              />
              <p className="text-text-muted text-xs mt-2">
                用于保存游戏进度，请牢记此ID
              </p>
            </div>
          )}

          {/* Step 1: Character & Company */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in" onKeyDown={handleKeyDown}>
              <div>
                <label className="block text-text-secondary text-sm mb-2 uppercase tracking-wider">
                  创始人姓名
                </label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="你的角色名..."
                  className="w-full p-3 bg-bg-secondary border border-gray-700 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2 uppercase tracking-wider">
                  公司名称
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="你的创业公司名..."
                  className="w-full p-3 bg-bg-secondary border border-gray-700 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
          )}

          {/* Step 2: Industry */}
          {step === 2 && (
            <div className="animate-fade-in">
              <label className="block text-text-secondary text-sm mb-3 uppercase tracking-wider">
                选择行业方向
              </label>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setIndustry(opt.value)}
                    className={`p-3 rounded-lg text-sm transition-all duration-200 border ${
                      industry === opt.value
                        ? 'bg-blue-500/20 border-blue-500/60 text-blue-300 glow-blue'
                        : 'bg-bg-secondary border-gray-700 text-text-secondary hover:border-gray-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm mt-4 animate-fade-in">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="rpg-btn flex-1"
              >
                上一步
              </button>
            )}
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="rpg-btn rpg-btn-primary flex-1"
              >
                下一步
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="rpg-btn rpg-btn-gold flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    创建中...
                  </>
                ) : (
                  '开始创业之旅'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-text-muted text-xs mt-6">
          OPC Entrepreneurship Simulation v1.0
        </p>
      </div>
    </div>
  );
}
