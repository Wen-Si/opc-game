// ============================================================
// OPC 创业模拟RPG - 核心类型定义
// ============================================================

/** 角色属性 */
export interface CharacterStats {
  leadership: number;    // 领导力 0-100
  technical: number;     // 技术能力 0-100
  marketing: number;     // 营销能力 0-100
  finance: number;       // 财务能力 0-100
  creativity: number;    // 创造力 0-100
  resilience: number;    // 抗压能力 0-100
  networking: number;    // 人脉能力 0-100
}

/** 角色状态 */
export interface CharacterState {
  name: string;
  health: number;        // 生命值 0-100
  energy: number;        // 精力值 0-100
  morale: number;        // 士气 0-100
  reputation: number;    // 声望 0-100
  experience: number;    // 经验值
  level: number;         // 等级
  skillPoints: number;    // 可用技能点
  stats: CharacterStats;
  mentalHealth: number;   // 心理健康 0-100
  burnoutRisk: number;    // 倦怠风险 0-100
}

/** 公司阶段 */
export type CompanyPhase =
  | 'idea'
  | 'registration'
  | 'early'
  | 'growth'
  | 'mature'
  | 'crisis'
  | 'bankrupt'
  | 'success';

/** 公司状态 */
export interface CompanyState {
  name: string;
  phase: CompanyPhase;
  cash: number;
  monthlyRevenue: number;
  monthlyExpense: number;
  productQuality: number;     // 0-100
  marketShare: number;        // 0-100
  teamSize: number;
  officeLevel: number;        // 1-5
  clients: number;
  completedProjects: number;
  failedProjects: number;
  totalProfit: number;
  industry: string;
}

/** 事件类型 */
export type GameEventType = 'opportunity' | 'crisis' | 'story' | 'milestone' | 'random';

/** 风险等级 */
export type RiskLevel = 'low' | 'medium' | 'high';

/** 事件选择效果 */
export interface EventEffects {
  cash?: number;
  health?: number;
  energy?: number;
  morale?: number;
  reputation?: number;
  experience?: number;
  mentalHealth?: number;
  burnoutRisk?: number;
  productQuality?: number;
  marketShare?: number;
  clients?: number;
  monthlyRevenue?: number;
  monthlyExpense?: number;
  teamSize?: number;
  totalProfit?: number;
  stats?: Partial<CharacterStats>;
  // 允许直接使用角色能力属性（会自动映射到stats）
  leadership?: number;
  technical?: number;
  marketing?: number;
  finance?: number;
  creativity?: number;
  resilience?: number;
  networking?: number;
  // 扩展标记（用于特殊效果描述，不影响游戏逻辑）
  legal?: boolean;
}

/** 事件选择 */
export interface EventChoice {
  id: string;
  text: string;
  effects: EventEffects;
  requirements?: Partial<CharacterStats>;
  outcomeText: string;
  riskLevel?: RiskLevel;
}

/** 游戏事件 */
export interface GameEvent {
  id: string;
  type: GameEventType;
  title: string;
  description: string;
  chapter?: number;
  choices: EventChoice[];
  condition?: (state: GameState) => boolean;
}

/** 技能类别 */
export type SkillCategory =
  | 'leadership'
  | 'technical'
  | 'marketing'
  | 'finance'
  | 'creativity'
  | 'resilience'
  | 'networking';

/** 技能树节点 */
export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;              // 技能点消耗
  maxLevel: number;
  currentLevel: number;
  category: SkillCategory;
  effects: Partial<CharacterStats>;
  prerequisite?: string;    // 前置技能ID
}

/** 游戏日志条目 */
export interface GameLogEntry {
  day: number;
  type: 'event' | 'action' | 'system' | 'achievement';
  message: string;
}

/** 游戏状态（完整） */
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
  pendingEvent?: GameEvent;
}

/** 创建游戏请求 */
export interface CreateGameRequest {
  userId: string;
  characterName: string;
  companyName: string;
  industry?: string;
}

/** 行动请求 */
export interface ActionRequest {
  action: string;
  choiceId?: string;
  params?: Record<string, any>;
}

/** 学习技能请求 */
export interface LearnSkillRequest {
  skillId: string;
}

/** 章节定义 */
export interface Chapter {
  number: number;
  title: string;
  dayRange: [number, number];
  description: string;
}

/** 行动类型 */
export type ActionType =
  | 'rest'
  | 'work'
  | 'network'
  | 'upgrade_office'
  | 'hire'
  | 'marketing_campaign'
  | 'develop_product'
  | 'seek_investment'
  | 'take_loan'
  | 'repay_loan'
  | 'research_market'
  | 'train_skill';

/** 贷款信息 */
export interface LoanInfo {
  amount: number;
  interestRate: number;
  remainingDebt: number;
  monthlyPayment: number;
}
