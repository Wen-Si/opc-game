/** 角色属性 */
export interface CharacterStats {
    leadership: number;
    technical: number;
    marketing: number;
    finance: number;
    creativity: number;
    resilience: number;
    networking: number;
}
/** 角色状态 */
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
/** 公司阶段 */
export type CompanyPhase = 'idea' | 'registration' | 'early' | 'growth' | 'mature' | 'crisis' | 'bankrupt' | 'success';
/** 公司状态 */
export interface CompanyState {
    name: string;
    phase: CompanyPhase;
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
    leadership?: number;
    technical?: number;
    marketing?: number;
    finance?: number;
    creativity?: number;
    resilience?: number;
    networking?: number;
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
export type SkillCategory = 'leadership' | 'technical' | 'marketing' | 'finance' | 'creativity' | 'resilience' | 'networking';
/** 技能树节点 */
export interface SkillNode {
    id: string;
    name: string;
    description: string;
    cost: number;
    maxLevel: number;
    currentLevel: number;
    category: SkillCategory;
    effects: Partial<CharacterStats>;
    prerequisite?: string;
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
export type ActionType = 'rest' | 'work' | 'network' | 'upgrade_office' | 'hire' | 'marketing_campaign' | 'develop_product' | 'seek_investment' | 'take_loan' | 'repay_loan' | 'research_market' | 'train_skill';
/** 贷款信息 */
export interface LoanInfo {
    amount: number;
    interestRate: number;
    remainingDebt: number;
    monthlyPayment: number;
}
//# sourceMappingURL=types.d.ts.map