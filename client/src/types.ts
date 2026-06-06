// ===== Character Types =====

export interface CharacterStats {
  leadership: number;
  technical: number;
  marketing: number;
  finance: number;
  creativity: number;
  resilience: number;
  networking: number;
}

export interface CharacterState {
  name: string;
  health: number;
  energy: number;
  morale: number;
  reputation: number;
  experience: number;
  level: number;
  skillPoints: number;
  stats: CharacterStats;
  mentalHealth: number;
  burnoutRisk: number;
}

// ===== Company Types =====

export interface CompanyState {
  name: string;
  phase: string;
  cash: number;
  monthlyRevenue: number;
  monthlyExpense: number;
  productQuality: number;
  marketShare: number;
  teamSize: number;
  officeLevel: number;
  clients: number;
  completedProjects: number;
  failedProjects: number;
  totalProfit: number;
}

// ===== Event Types =====

export interface GameEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  chapter?: number;
  choices: EventChoice[];
}

export interface EventChoice {
  id: string;
  text: string;
  effects: Record<string, number>;
  requirements?: Partial<CharacterStats>;
  outcomeText: string;
  riskLevel?: string;
}

// ===== Skill Types =====

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxLevel: number;
  currentLevel: number;
  category: string;
  effects: Partial<CharacterStats>;
  prerequisite?: string;
}

// ===== Game State =====

export interface GameLogEntry {
  day: number;
  type: string;
  message: string;
}

export interface GameState {
  userId: string;
  character: CharacterState;
  company: CompanyState;
  currentDay: number;
  currentMonth: number;
  currentYear: number;
  chapter: number;
  phase: string;
  skills: SkillNode[];
  eventHistory: string[];
  achievements: string[];
  gameLog: GameLogEntry[];
  isGameOver: boolean;
  gameOverReason?: string;
  currentEvent?: GameEvent;
}

// ===== API Request/Response =====

export interface CreateGameRequest {
  userId: string;
  characterName: string;
  companyName: string;
  industry?: string;
}

export interface ActionRequest {
  action: string;
  choiceId?: string;
  params?: Record<string, number | string | boolean>;
}

// ===== UI Types =====

export type ViewType = 'dashboard' | 'event' | 'action';

export type PageType = 'game' | 'skillTree' | 'finance' | 'history';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  duration?: number;
}

// ===== Stat Labels =====

export const STAT_LABELS: Record<keyof CharacterStats, string> = {
  leadership: '领导力',
  technical: '技术力',
  marketing: '营销力',
  finance: '财务力',
  creativity: '创造力',
  resilience: '抗压',
  networking: '人脉',
};

export const STAT_COLORS: Record<keyof CharacterStats, string> = {
  leadership: '#f59e0b',
  technical: '#3b82f6',
  marketing: '#ec4899',
  finance: '#10b981',
  creativity: '#8b5cf6',
  resilience: '#ef4444',
  networking: '#06b6d4',
};

export const INDUSTRY_OPTIONS = [
  { value: 'tech', label: '科技/互联网' },
  { value: 'fintech', label: '金融科技' },
  { value: 'ecommerce', label: '电子商务' },
  { value: 'education', label: '在线教育' },
  { value: 'healthcare', label: '医疗健康' },
  { value: 'gaming', label: '游戏娱乐' },
  { value: 'ai', label: '人工智能' },
  { value: 'green', label: '绿色能源' },
];

export const CHAPTER_NAMES: Record<number, string> = {
  1: '第一章：创业萌芽',
  2: '第二章：产品打磨',
  3: '第三章：市场拓展',
  4: '第四章：团队壮大',
  5: '第五章：融资博弈',
  6: '第六章：危机与转机',
  7: '第七章：巅峰对决',
};

export const PHASE_LABELS: Record<string, string> = {
  idea: '创意阶段',
  mvp: 'MVP开发',
  seed: '种子轮',
  growth: '成长期',
  expansion: '扩张期',
  mature: '成熟期',
  ipo: 'IPO准备',
};
