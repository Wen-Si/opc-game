import { useState, useCallback, useRef } from 'react';
import * as api from '../api';
import type {
  GameState,
  CreateGameRequest,
  ActionRequest,
  CharacterStats,
  SkillNode,
  GameLogEntry,
} from '../types';

const DEFAULT_STATS: CharacterStats = {
  leadership: 10,
  technical: 10,
  marketing: 10,
  finance: 10,
  creativity: 10,
  resilience: 10,
  networking: 10,
};

const DEFAULT_SKILLS: SkillNode[] = [
  // Leadership tree
  { id: 'lead_1', name: '团队激励', description: '提升团队士气和效率', cost: 1, maxLevel: 5, currentLevel: 0, category: 'leadership', effects: { leadership: 3 } },
  { id: 'lead_2', name: '战略规划', description: '制定更有效的商业战略', cost: 2, maxLevel: 5, currentLevel: 0, category: 'leadership', effects: { leadership: 5 }, prerequisite: 'lead_1' },
  { id: 'lead_3', name: '愿景演讲', description: '用愿景打动投资人和员工', cost: 3, maxLevel: 3, currentLevel: 0, category: 'leadership', effects: { leadership: 8 }, prerequisite: 'lead_2' },
  // Technical tree
  { id: 'tech_1', name: '全栈基础', description: '掌握前后端开发基础', cost: 1, maxLevel: 5, currentLevel: 0, category: 'technical', effects: { technical: 3 } },
  { id: 'tech_2', name: '架构设计', description: '设计可扩展的系统架构', cost: 2, maxLevel: 5, currentLevel: 0, category: 'technical', effects: { technical: 5 }, prerequisite: 'tech_1' },
  { id: 'tech_3', name: 'AI赋能', description: '利用AI技术提升产品', cost: 3, maxLevel: 3, currentLevel: 0, category: 'technical', effects: { technical: 8 }, prerequisite: 'tech_2' },
  // Marketing tree
  { id: 'mkt_1', name: '内容营销', description: '通过内容吸引目标用户', cost: 1, maxLevel: 5, currentLevel: 0, category: 'marketing', effects: { marketing: 3 } },
  { id: 'mkt_2', name: '增长黑客', description: '数据驱动的增长策略', cost: 2, maxLevel: 5, currentLevel: 0, category: 'marketing', effects: { marketing: 5 }, prerequisite: 'mkt_1' },
  { id: 'mkt_3', name: '品牌塑造', description: '打造有影响力的品牌', cost: 3, maxLevel: 3, currentLevel: 0, category: 'marketing', effects: { marketing: 8 }, prerequisite: 'mkt_2' },
  // Finance tree
  { id: 'fin_1', name: '基础财务', description: '管理日常收支和预算', cost: 1, maxLevel: 5, currentLevel: 0, category: 'finance', effects: { finance: 3 } },
  { id: 'fin_2', name: '融资谈判', description: '与投资人有效谈判', cost: 2, maxLevel: 5, currentLevel: 0, category: 'finance', effects: { finance: 5 }, prerequisite: 'fin_1' },
  { id: 'fin_3', name: '资本运作', description: '高级资本策略和并购', cost: 3, maxLevel: 3, currentLevel: 0, category: 'finance', effects: { finance: 8 }, prerequisite: 'fin_2' },
  // Creativity tree
  { id: 'cre_1', name: '设计思维', description: '以用户为中心的创新方法', cost: 1, maxLevel: 5, currentLevel: 0, category: 'creativity', effects: { creativity: 3 } },
  { id: 'cre_2', name: '产品创新', description: '打造差异化的产品体验', cost: 2, maxLevel: 5, currentLevel: 0, category: 'creativity', effects: { creativity: 5 }, prerequisite: 'cre_1' },
  { id: 'cre_3', name: '颠覆式创新', description: '创造全新市场赛道', cost: 3, maxLevel: 3, currentLevel: 0, category: 'creativity', effects: { creativity: 8 }, prerequisite: 'cre_2' },
  // Resilience tree
  { id: 'res_1', name: '压力管理', description: '有效管理工作压力', cost: 1, maxLevel: 5, currentLevel: 0, category: 'resilience', effects: { resilience: 3 } },
  { id: 'res_2', name: '危机应对', description: '冷静处理突发事件', cost: 2, maxLevel: 5, currentLevel: 0, category: 'resilience', effects: { resilience: 5 }, prerequisite: 'res_1' },
  { id: 'res_3', name: '涅槃重生', description: '从失败中快速恢复并更强', cost: 3, maxLevel: 3, currentLevel: 0, category: 'resilience', effects: { resilience: 8 }, prerequisite: 'res_2' },
  // Networking tree
  { id: 'net_1', name: '社交入门', description: '建立初步的人脉网络', cost: 1, maxLevel: 5, currentLevel: 0, category: 'networking', effects: { networking: 3 } },
  { id: 'net_2', name: '资源整合', description: '有效整合各方资源', cost: 2, maxLevel: 5, currentLevel: 0, category: 'networking', effects: { networking: 5 }, prerequisite: 'net_1' },
  { id: 'net_3', name: '生态构建', description: '打造完整的商业生态', cost: 3, maxLevel: 3, currentLevel: 0, category: 'networking', effects: { networking: 8 }, prerequisite: 'net_2' },
];

function createDefaultGameState(data: CreateGameRequest): GameState {
  return {
    userId: data.userId,
    character: {
      name: data.characterName,
      health: 100,
      energy: 100,
      morale: 80,
      reputation: 10,
      experience: 0,
      level: 1,
      skillPoints: 3,
      stats: { ...DEFAULT_STATS },
      mentalHealth: 90,
      burnoutRisk: 5,
    },
    company: {
      name: data.companyName,
      phase: 'idea',
      cash: 50000,
      monthlyRevenue: 0,
      monthlyExpense: 0,
      productQuality: 0,
      marketShare: 0,
      teamSize: 1,
      officeLevel: 0,
      clients: 0,
      completedProjects: 0,
      failedProjects: 0,
      totalProfit: 0,
    },
    currentDay: 1,
    currentMonth: 1,
    currentYear: 1,
    chapter: 1,
    phase: 'idea',
    skills: DEFAULT_SKILLS.map((s) => ({ ...s })),
    eventHistory: [],
    achievements: [],
    gameLog: [
      {
        day: 1,
        type: 'system',
        message: `${data.characterName} 创建了 ${data.companyName}，踏上了创业之旅！`,
      },
    ],
    isGameOver: false,
    currentEvent: {
      id: 'evt_start',
      type: 'story',
      title: '创业的第一天',
      description: `你坐在简陋的办公室里，面前只有一台笔记本电脑和一杯已经凉了的咖啡。${data.companyName}正式成立了。作为创始人，你需要决定第一步该做什么。`,
      chapter: 1,
      choices: [
        {
          id: 'ch_product',
          text: '先做产品原型 - 用技术证明你的想法',
          effects: { technical: 2, energy: -15, cash: -2000 },
          outcomeText: '你开始埋头开发产品原型，虽然辛苦但看到了进展。',
          riskLevel: 'low',
        },
        {
          id: 'ch_market',
          text: '先做市场调研 - 了解用户真正需要什么',
          effects: { marketing: 2, energy: -10, networking: 1 },
          outcomeText: '你花时间与潜在用户交流，获得了宝贵的市场洞察。',
          riskLevel: 'low',
        },
        {
          id: 'ch_fund',
          text: '先找投资人 - 资金是创业的血液',
          effects: { finance: 2, networking: 2, morale: -5 },
          outcomeText: '你开始参加各种创业活动，试图引起投资人的注意。',
          riskLevel: 'medium',
        },
      ],
    },
  };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevCashRef = useRef<number>(0);

  const initGame = useCallback(async (data: CreateGameRequest) => {
    setLoading(true);
    setError(null);
    try {
      // Try API first, fall back to local
      const state = await api.createGame(data).catch(() => createDefaultGameState(data));
      setGameState(state);
      prevCashRef.current = state.company.cash;
    } catch (err) {
      // Fallback to local state
      const state = createDefaultGameState(data);
      setGameState(state);
      prevCashRef.current = state.company.cash;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadExistingGame = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const state = await api.getGameState(userId);
      setGameState(state);
      prevCashRef.current = state.company.cash;
    } catch {
      setError('无法加载游戏存档');
    } finally {
      setLoading(false);
    }
  }, []);

  const nextDay = useCallback(async () => {
    if (!gameState) return;
    setLoading(true);
    setError(null);
    try {
      const newState = await api.getNextDay(gameState.userId);
      setGameState(newState);
      prevCashRef.current = newState.company.cash;
    } catch {
      // Fallback: simulate next day locally
      setGameState((prev) => {
        if (!prev) return prev;
        const newDay = prev.currentDay + 1;
        const newMonth = prev.currentMonth + (newDay > 30 ? 1 : 0);
        const newYear = prev.currentYear + (newMonth > 12 ? 1 : 0);
        const actualMonth = newMonth > 12 ? 1 : newMonth;
        const actualDay = newDay > 30 ? 1 : newDay;

        const energyCost = 10 + Math.floor(Math.random() * 10);
        const newEnergy = Math.max(0, prev.character.energy - energyCost);
        const newHealth = Math.max(0, prev.character.health - (newEnergy === 0 ? 5 : 0));
        const newMorale = Math.max(0, Math.min(100, prev.character.morale + (Math.random() > 0.5 ? 2 : -3)));
        const newExp = prev.character.experience + 5 + Math.floor(Math.random() * 10);
        const expForLevel = prev.character.level * 100;
        const newLevel = newExp >= expForLevel ? prev.character.level + 1 : prev.character.level;
        const newSkillPoints = newLevel > prev.character.level ? prev.character.skillPoints + 2 : prev.character.skillPoints;

        const newCash = prev.company.cash + prev.company.monthlyRevenue - prev.company.monthlyExpense;
        const burnoutIncrease = newEnergy < 20 ? 5 : newEnergy < 40 ? 2 : 0;
        const newBurnout = Math.min(100, prev.character.burnoutRisk + burnoutIncrease);
        const newMental = Math.max(0, prev.character.mentalHealth - (burnoutIncrease > 0 ? 3 : 0));

        const logEntry: GameLogEntry = {
          day: actualDay,
          type: 'daily',
          message: `第${actualDay}天过去了。精力消耗${energyCost}点。`,
        };

        const newState: GameState = {
          ...prev,
          currentDay: actualDay,
          currentMonth: actualMonth,
          currentYear: newYear,
          character: {
            ...prev.character,
            energy: newEnergy,
            health: newHealth,
            morale: newMorale,
            experience: newExp,
            level: newLevel,
            skillPoints: newSkillPoints,
            mentalHealth: newMental,
            burnoutRisk: newBurnout,
          },
          company: {
            ...prev.company,
            cash: newCash,
          },
          gameLog: [...prev.gameLog, logEntry],
          isGameOver: newHealth <= 0 || newCash < -100000 || newBurnout >= 100,
          gameOverReason:
            newHealth <= 0
              ? '你的身体已经无法承受创业的压力，不得不暂时放下一切...'
              : newCash < -100000
                ? '公司资金链断裂，被迫宣布破产...'
                : newBurnout >= 100
                  ? '严重的职业倦怠让你彻底崩溃了...'
                  : '未知原因',
        };
        prevCashRef.current = newState.company.cash;
        return newState;
      });
    } finally {
      setLoading(false);
    }
  }, [gameState]);

  const executeAction = useCallback(
    async (action: ActionRequest) => {
      if (!gameState) return;
      setLoading(true);
      setError(null);
      try {
        const newState = await api.executeAction(gameState.userId, action);
        setGameState(newState);
        prevCashRef.current = newState.company.cash;
      } catch {
        // Fallback: apply effects locally
        setGameState((prev) => {
          if (!prev) return prev;
          const effects = action.params || {};
          const newCharacter = { ...prev.character, stats: { ...prev.character.stats } };
          const newCompany = { ...prev.company };

          for (const [key, value] of Object.entries(effects)) {
            const numVal = Number(value);
            if (key in newCharacter.stats) {
              (newCharacter.stats as unknown as Record<string, number>)[key] =
                Math.max(0, (newCharacter.stats as unknown as Record<string, number>)[key] + numVal);
            } else if (key in newCharacter) {
              (newCharacter as unknown as Record<string, number>)[key] = Math.max(
                0,
                Math.min(100, (newCharacter as unknown as Record<string, number>)[key] + numVal)
              );
            } else if (key in newCompany) {
              (newCompany as unknown as Record<string, number>)[key] += numVal;
            }
          }

          const newState: GameState = {
            ...prev,
            character: newCharacter,
            company: newCompany,
            currentEvent: undefined,
          };
          prevCashRef.current = newState.company.cash;
          return newState;
        });
      } finally {
        setLoading(false);
      }
    },
    [gameState]
  );

  const learnSkill = useCallback(
    async (skillId: string) => {
      if (!gameState) return;
      setLoading(true);
      setError(null);
      try {
        const newState = await api.learnSkill(gameState.userId, skillId);
        setGameState(newState);
      } catch {
        // Fallback: apply skill locally
        setGameState((prev) => {
          if (!prev) return prev;
          const skillIndex = prev.skills.findIndex((s) => s.id === skillId);
          if (skillIndex === -1) return prev;

          const skill = prev.skills[skillIndex];
          if (
            skill.currentLevel >= skill.maxLevel ||
            prev.character.skillPoints < skill.cost
          ) {
            return prev;
          }

          const newSkills = [...prev.skills];
          newSkills[skillIndex] = {
            ...skill,
            currentLevel: skill.currentLevel + 1,
          };

          const newStats = { ...prev.character.stats };
          if (skill.effects) {
            for (const [key, value] of Object.entries(skill.effects)) {
              if (key in newStats) {
                (newStats as Record<string, number>)[key] += Number(value);
              }
            }
          }

          return {
            ...prev,
            character: {
              ...prev.character,
              stats: newStats,
              skillPoints: prev.character.skillPoints - skill.cost,
            },
            skills: newSkills,
          };
        });
      } finally {
        setLoading(false);
      }
    },
    [gameState]
  );

  const resetGame = useCallback(() => {
    setGameState(null);
    setError(null);
    prevCashRef.current = 0;
  }, []);

  return {
    gameState,
    loading,
    error,
    initGame,
    loadExistingGame,
    nextDay,
    executeAction,
    learnSkill,
    resetGame,
    cashChanged: gameState ? gameState.company.cash !== prevCashRef.current : false,
  };
}
