import { GameState, CharacterState, SkillNode, SkillCategory } from '../types';
/**
 * 添加经验值并检查升级
 */
export declare function addExperience(state: GameState, amount: number): GameState;
/**
 * 获取指定等级所需的经验值
 */
export declare function getExpForLevel(level: number): number | null;
/**
 * 获取当前等级到下一级的进度
 */
export declare function getLevelProgress(character: CharacterState): {
    currentExp: number;
    requiredExp: number;
    progress: number;
};
/** 完整的技能树 */
export declare const SKILL_TREE: SkillNode[];
/**
 * 学习技能
 */
export declare function learnSkill(state: GameState, skillId: string): GameState;
/**
 * 获取可学习的技能列表
 */
export declare function getLearnableSkills(state: GameState): SkillNode[];
/**
 * 获取技能树按类别分组
 */
export declare function getSkillTreeByCategory(): Record<SkillCategory, SkillNode[]>;
/**
 * 初始化技能树（用于新游戏）
 */
export declare function initializeSkillTree(): SkillNode[];
/**
 * 每日倦怠/疲劳更新
 */
export declare function updateBurnout(state: GameState): GameState;
/**
 * 休息行动
 */
export declare function restAction(state: GameState): GameState;
/**
 * 工作行动
 */
export declare function workAction(state: GameState): GameState;
/**
 * 社交/人脉行动
 */
export declare function networkAction(state: GameState): GameState;
/**
 * 研发产品行动
 */
export declare function developProductAction(state: GameState): GameState;
/**
 * 营销推广行动
 */
export declare function marketingAction(state: GameState): GameState;
/**
 * 招聘员工行动
 */
export declare function hireAction(state: GameState): GameState;
/**
 * 市场调研行动
 */
export declare function researchMarketAction(state: GameState): GameState;
/**
 * 训练技能行动（消耗精力获取经验）
 */
export declare function trainSkillAction(state: GameState): GameState;
/** 成就定义 */
export declare const ACHIEVEMENTS: {
    id: string;
    name: string;
    description: string;
    condition: (s: GameState) => boolean;
}[];
/**
 * 检查并解锁成就
 */
export declare function checkAchievements(state: GameState): {
    state: GameState;
    newAchievements: string[];
};
//# sourceMappingURL=growthSystem.d.ts.map