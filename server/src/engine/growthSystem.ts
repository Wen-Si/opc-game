// ============================================================
// OPC 创业模拟RPG - 角色成长/技能系统
// ============================================================

import {
  GameState,
  CharacterState,
  CharacterStats,
  SkillNode,
  SkillCategory,
} from '../types';

// ============================================================
// 经验值和升级系统
// ============================================================

/** 升级所需经验值表 */
const LEVEL_EXP_TABLE: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 800,
  6: 1200,
  7: 1800,
  8: 2600,
  9: 3600,
  10: 5000,
  11: 7000,
  12: 9500,
  13: 12500,
  14: 16000,
  15: 20000,
  16: 25000,
  17: 31000,
  18: 38000,
  19: 46000,
  20: 55000,
};

/** 每次升级获得的技能点 */
const SKILL_POINTS_PER_LEVEL = 2;

/**
 * 添加经验值并检查升级
 */
export function addExperience(state: GameState, amount: number): GameState {
  const newState = { ...state };
  newState.character = { ...newState.character };
  newState.character.experience += amount;

  // 检查升级
  let leveledUp = false;
  while (true) {
    const nextLevel = newState.character.level + 1;
    const requiredExp = getExpForLevel(nextLevel);
    if (requiredExp !== null && newState.character.experience >= requiredExp) {
      newState.character.level = nextLevel;
      newState.character.skillPoints += SKILL_POINTS_PER_LEVEL;
      leveledUp = true;

      const logEntry = {
        day: newState.currentDay,
        type: 'system' as const,
        message: `[升级] 恭喜！你升到了 ${nextLevel} 级！获得 ${SKILL_POINTS_PER_LEVEL} 个技能点。`,
      };
      newState.gameLog = [...newState.gameLog, logEntry];
    } else {
      break;
    }
  }

  return newState;
}

/**
 * 获取指定等级所需的经验值
 */
export function getExpForLevel(level: number): number | null {
  return LEVEL_EXP_TABLE[level] ?? null;
}

/**
 * 获取当前等级到下一级的进度
 */
export function getLevelProgress(character: CharacterState): {
  currentExp: number;
  requiredExp: number;
  progress: number;
} {
  const currentLevel = character.level;
  const currentExp = character.experience;
  const currentLevelExp = LEVEL_EXP_TABLE[currentLevel] ?? 0;
  const nextLevelExp = LEVEL_EXP_TABLE[currentLevel + 1];

  if (nextLevelExp === undefined) {
    return { currentExp, requiredExp: currentExp, progress: 1 };
  }

  const progress = (currentExp - currentLevelExp) / (nextLevelExp - currentLevelExp);
  return {
    currentExp: currentExp - currentLevelExp,
    requiredExp: nextLevelExp - currentLevelExp,
    progress: Math.min(1, Math.max(0, progress)),
  };
}

// ============================================================
// 技能树定义
// ============================================================

/** 完整的技能树 */
export const SKILL_TREE: SkillNode[] = [
  // --- 领导力技能 ---
  {
    id: 'lead_1',
    name: '团队激励',
    description: '提升团队士气和工作效率。团队成员在压力下表现更好。',
    cost: 1,
    maxLevel: 5,
    currentLevel: 0,
    category: 'leadership',
    effects: { leadership: 5 },
  },
  {
    id: 'lead_2',
    name: '战略规划',
    description: '制定长期发展战略的能力。提升决策质量和前瞻性。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'leadership',
    effects: { leadership: 8 },
    prerequisite: 'lead_1',
  },
  {
    id: 'lead_3',
    name: '危机管理',
    description: '在危机中保持冷静，做出正确决策。降低危机事件的负面影响。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'leadership',
    effects: { leadership: 6, resilience: 4 },
    prerequisite: 'lead_2',
  },
  {
    id: 'lead_4',
    name: '领袖魅力',
    description: '成为真正的领袖。吸引人才、凝聚团队、影响行业。',
    cost: 3,
    maxLevel: 3,
    currentLevel: 0,
    category: 'leadership',
    effects: { leadership: 12, networking: 5 },
    prerequisite: 'lead_3',
  },

  // --- 技术能力技能 ---
  {
    id: 'tech_1',
    name: '技术精进',
    description: '提升核心技术能力。产品质量和交付效率提高。',
    cost: 1,
    maxLevel: 5,
    currentLevel: 0,
    category: 'technical',
    effects: { technical: 5 },
  },
  {
    id: 'tech_2',
    name: '架构设计',
    description: '设计可扩展的技术架构。提升产品稳定性和可维护性。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'technical',
    effects: { technical: 8 },
    prerequisite: 'tech_1',
  },
  {
    id: 'tech_3',
    name: '创新研发',
    description: '推动技术创新。解锁新产品研发能力。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'technical',
    effects: { technical: 6, creativity: 4 },
    prerequisite: 'tech_2',
  },
  {
    id: 'tech_4',
    name: '技术领导力',
    description: '成为技术领域的权威。引领技术方向，培养技术团队。',
    cost: 3,
    maxLevel: 3,
    currentLevel: 0,
    category: 'technical',
    effects: { technical: 12, leadership: 3 },
    prerequisite: 'tech_3',
  },

  // --- 营销能力技能 ---
  {
    id: 'mkt_1',
    name: '市场洞察',
    description: '深入理解市场需求和趋势。做出更精准的营销决策。',
    cost: 1,
    maxLevel: 5,
    currentLevel: 0,
    category: 'marketing',
    effects: { marketing: 5 },
  },
  {
    id: 'mkt_2',
    name: '品牌建设',
    description: '打造有影响力的品牌。提升公司知名度和客户信任度。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'marketing',
    effects: { marketing: 8 },
    prerequisite: 'mkt_1',
  },
  {
    id: 'mkt_3',
    name: '增长黑客',
    description: '掌握低成本高效增长的方法。用创意驱动用户增长。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'marketing',
    effects: { marketing: 6, creativity: 4 },
    prerequisite: 'mkt_2',
  },
  {
    id: 'mkt_4',
    name: '营销大师',
    description: '成为营销领域的专家。制定战略级营销方案，引领市场。',
    cost: 3,
    maxLevel: 3,
    currentLevel: 0,
    category: 'marketing',
    effects: { marketing: 12, networking: 5 },
    prerequisite: 'mkt_3',
  },

  // --- 财务能力技能 ---
  {
    id: 'fin_1',
    name: '财务基础',
    description: '掌握基本的财务知识。更好地管理公司账目和现金流。',
    cost: 1,
    maxLevel: 5,
    currentLevel: 0,
    category: 'finance',
    effects: { finance: 5 },
  },
  {
    id: 'fin_2',
    name: '成本控制',
    description: '优化成本结构，减少不必要的开支。提升利润率。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'finance',
    effects: { finance: 8 },
    prerequisite: 'fin_1',
  },
  {
    id: 'fin_3',
    name: '融资谈判',
    description: '掌握融资技巧和谈判策略。获得更好的融资条件。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'finance',
    effects: { finance: 6, networking: 4 },
    prerequisite: 'fin_2',
  },
  {
    id: 'fin_4',
    name: '资本运作',
    description: '精通资本市场的运作。为公司的发展提供资金保障。',
    cost: 3,
    maxLevel: 3,
    currentLevel: 0,
    category: 'finance',
    effects: { finance: 12, leadership: 3 },
    prerequisite: 'fin_3',
  },

  // --- 创造力技能 ---
  {
    id: 'cre_1',
    name: '创意思维',
    description: '培养发散性思维。在解决问题时能想出更多方案。',
    cost: 1,
    maxLevel: 5,
    currentLevel: 0,
    category: 'creativity',
    effects: { creativity: 5 },
  },
  {
    id: 'cre_2',
    name: '产品设计',
    description: '提升产品设计能力。打造用户喜爱的产品。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'creativity',
    effects: { creativity: 8 },
    prerequisite: 'cre_1',
  },
  {
    id: 'cre_3',
    name: '颠覆创新',
    description: '敢于打破常规，创造颠覆性的产品和商业模式。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'creativity',
    effects: { creativity: 6, technical: 3 },
    prerequisite: 'cre_2',
  },

  // --- 抗压能力技能 ---
  {
    id: 'res_1',
    name: '压力管理',
    description: '学会管理压力。在高压环境下保持正常发挥。',
    cost: 1,
    maxLevel: 5,
    currentLevel: 0,
    category: 'resilience',
    effects: { resilience: 5 },
  },
  {
    id: 'res_2',
    name: '逆境成长',
    description: '从挫折中学习和成长。每次失败都让你变得更强。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'resilience',
    effects: { resilience: 8 },
    prerequisite: 'res_1',
  },
  {
    id: 'res_3',
    name: '心理韧性',
    description: '建立强大的心理防线。即使面对最困难的局面也不崩溃。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'resilience',
    effects: { resilience: 6 },
    prerequisite: 'res_2',
  },
  {
    id: 'res_4',
    name: '涅槃重生',
    description: '从废墟中站起来的能力。危机过后变得更加强大。',
    cost: 3,
    maxLevel: 3,
    currentLevel: 0,
    category: 'resilience',
    effects: { resilience: 12, leadership: 5 },
    prerequisite: 'res_3',
  },

  // --- 人脉能力技能 ---
  {
    id: 'net_1',
    name: '社交技巧',
    description: '提升社交能力。在各种场合都能建立良好的人际关系。',
    cost: 1,
    maxLevel: 5,
    currentLevel: 0,
    category: 'networking',
    effects: { networking: 5 },
  },
  {
    id: 'net_2',
    name: '资源整合',
    description: '善于整合各方资源。通过合作实现双赢。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'networking',
    effects: { networking: 8 },
    prerequisite: 'net_1',
  },
  {
    id: 'net_3',
    name: '行业影响力',
    description: '在行业内建立影响力。成为意见领袖和关键联系人。',
    cost: 2,
    maxLevel: 5,
    currentLevel: 0,
    category: 'networking',
    effects: { networking: 6, marketing: 3 },
    prerequisite: 'net_2',
  },
  {
    id: 'net_4',
    name: '人脉帝国',
    description: '构建庞大而稳固的人脉网络。在任何领域都能找到帮手。',
    cost: 3,
    maxLevel: 3,
    currentLevel: 0,
    category: 'networking',
    effects: { networking: 12, leadership: 5 },
    prerequisite: 'net_3',
  },
];

/**
 * 学习技能
 */
export function learnSkill(state: GameState, skillId: string): GameState {
  const newState = { ...state };

  // 查找技能
  const skillIndex = newState.skills.findIndex(s => s.id === skillId);
  if (skillIndex === -1) {
    return state; // 技能不存在
  }

  const skill = newState.skills[skillIndex];

  // 检查是否已满级
  if (skill.currentLevel >= skill.maxLevel) {
    return state;
  }

  // 检查前置技能
  if (skill.prerequisite) {
    const prereq = newState.skills.find(s => s.id === skill.prerequisite);
    if (!prereq || prereq.currentLevel < 1) {
      return state; // 前置技能未学习
    }
  }

  // 检查技能点
  if (newState.character.skillPoints < skill.cost) {
    return state; // 技能点不足
  }

  // 学习技能
  const newSkills = [...newState.skills];
  newSkills[skillIndex] = {
    ...skill,
    currentLevel: skill.currentLevel + 1,
  };

  // 扣除技能点
  newState.character = {
    ...newState.character,
    skillPoints: newState.character.skillPoints - skill.cost,
  };

  // 应用属性加成
  if (skill.effects) {
    const newStats = { ...newState.character.stats };
    if (skill.effects.leadership) newStats.leadership = clamp(newStats.leadership + skill.effects.leadership);
    if (skill.effects.technical) newStats.technical = clamp(newStats.technical + skill.effects.technical);
    if (skill.effects.marketing) newStats.marketing = clamp(newStats.marketing + skill.effects.marketing);
    if (skill.effects.finance) newStats.finance = clamp(newStats.finance + skill.effects.finance);
    if (skill.effects.creativity) newStats.creativity = clamp(newStats.creativity + skill.effects.creativity);
    if (skill.effects.resilience) newStats.resilience = clamp(newStats.resilience + skill.effects.resilience);
    if (skill.effects.networking) newStats.networking = clamp(newStats.networking + skill.effects.networking);
    newState.character = { ...newState.character, stats: newStats };
  }

  newState.skills = newSkills;

  // 添加日志
  const logEntry = {
    day: newState.currentDay,
    type: 'action' as const,
    message: `[技能] 学习了「${skill.name}」，当前等级 ${skill.currentLevel + 1}/${skill.maxLevel}`,
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  return newState;
}

/**
 * 获取可学习的技能列表
 */
export function getLearnableSkills(state: GameState): SkillNode[] {
  return state.skills.filter(skill => {
    // 未满级
    if (skill.currentLevel >= skill.maxLevel) return false;

    // 检查前置技能
    if (skill.prerequisite) {
      const prereq = state.skills.find(s => s.id === skill.prerequisite);
      if (!prereq || prereq.currentLevel < 1) return false;
    }

    // 检查技能点
    if (state.character.skillPoints < skill.cost) return false;

    return true;
  });
}

/**
 * 获取技能树按类别分组
 */
export function getSkillTreeByCategory(): Record<SkillCategory, SkillNode[]> {
  const result: Record<string, SkillNode[]> = {
    leadership: [],
    technical: [],
    marketing: [],
    finance: [],
    creativity: [],
    resilience: [],
    networking: [],
  };

  for (const skill of SKILL_TREE) {
    result[skill.category].push({ ...skill });
  }

  return result as Record<SkillCategory, SkillNode[]>;
}

/**
 * 初始化技能树（用于新游戏）
 */
export function initializeSkillTree(): SkillNode[] {
  return SKILL_TREE.map(skill => ({ ...skill, currentLevel: 0 }));
}

// ============================================================
// 疲劳和倦怠系统
// ============================================================

/**
 * 每日倦怠/疲劳更新
 */
export function updateBurnout(state: GameState): GameState {
  const newState = { ...state };
  const character = { ...newState.character };

  // 精力低于30时，倦怠风险增加
  if (character.energy < 30) {
    character.burnoutRisk = Math.min(100, character.burnoutRisk + 2);
  }

  // 精力低于10时，倦怠风险大幅增加
  if (character.energy < 10) {
    character.burnoutRisk = Math.min(100, character.burnoutRisk + 5);
  }

  // 健康低于30时，倦怠风险增加
  if (character.health < 30) {
    character.burnoutRisk = Math.min(100, character.burnoutRisk + 3);
  }

  // 士气低于20时，倦怠风险增加
  if (character.morale < 20) {
    character.burnoutRisk = Math.min(100, character.burnoutRisk + 2);
  }

  // 心理健康高时，倦怠风险自然恢复
  if (character.mentalHealth > 70) {
    character.burnoutRisk = Math.max(0, character.burnoutRisk - 1);
  }

  // 倦怠风险高时，心理健康下降
  if (character.burnoutRisk > 70) {
    character.mentalHealth = Math.max(0, character.mentalHealth - 2);
  }

  // 倦怠风险极高时，健康下降
  if (character.burnoutRisk > 90) {
    character.health = Math.max(0, character.health - 3);
  }

  newState.character = character;
  return newState;
}

/**
 * 休息行动
 */
export function restAction(state: GameState): GameState {
  const newState = { ...state };
  newState.character = { ...newState.character };

  // 恢复精力
  newState.character.energy = Math.min(100, newState.character.energy + 25);

  // 恢复一些健康
  newState.character.health = Math.min(100, newState.character.health + 5);

  // 降低倦怠风险
  newState.character.burnoutRisk = Math.max(0, newState.character.burnoutRisk - 10);

  // 提升心理健康
  newState.character.mentalHealth = Math.min(100, newState.character.mentalHealth + 5);

  // 士气小幅提升
  newState.character.morale = Math.min(100, newState.character.morale + 3);

  // 添加日志
  const logEntry = {
    day: newState.currentDay,
    type: 'action' as const,
    message: '[休息] 你给自己放了一天假。精力+25，健康+5，倦怠风险-10。',
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  return newState;
}

/**
 * 工作行动
 */
export function workAction(state: GameState): GameState {
  let newState = { ...state };
  newState.character = { ...newState.character };
  newState.company = { ...newState.company };

  // 消耗精力
  newState.character.energy = Math.max(0, newState.character.energy - 20);

  // 增加经验
  newState = addExperience(newState, 15);

  // 提升产品质量
  newState.company.productQuality = Math.min(100, newState.company.productQuality + 1);

  // 增加倦怠风险
  newState.character.burnoutRisk = Math.min(100, newState.character.burnoutRisk + 3);

  // 添加日志
  const logEntry = {
    day: newState.currentDay,
    type: 'action' as const,
    message: '[工作] 专注于产品和业务。精力-20，经验+15，产品质量+1。',
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  return newState;
}

/**
 * 社交/人脉行动
 */
export function networkAction(state: GameState): GameState {
  let newState = { ...state };
  newState.character = { ...newState.character };

  // 消耗精力
  newState.character.energy = Math.max(0, newState.character.energy - 15);

  // 增加经验
  newState = addExperience(newState, 10);

  // 提升人脉能力
  newState.character.stats = {
    ...newState.character.stats,
    networking: Math.min(100, newState.character.stats.networking + 1),
  };

  // 提升声望
  newState.character.reputation = Math.min(100, newState.character.reputation + 2);

  // 添加日志
  const logEntry = {
    day: newState.currentDay,
    type: 'action' as const,
    message: '[社交] 参加了行业活动，结识了新朋友。精力-15，人脉+1，声望+2。',
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  return newState;
}

/**
 * 研发产品行动
 */
export function developProductAction(state: GameState): GameState {
  let newState = { ...state };
  newState.character = { ...newState.character };
  newState.company = { ...newState.company };

  // 消耗精力
  newState.character.energy = Math.max(0, newState.character.energy - 25);

  // 增加经验
  newState = addExperience(newState, 25);

  // 提升产品质量
  newState.company.productQuality = Math.min(100, newState.company.productQuality + 3);

  // 增加倦怠风险
  newState.character.burnoutRisk = Math.min(100, newState.character.burnoutRisk + 4);

  // 添加日志
  const logEntry = {
    day: newState.currentDay,
    type: 'action' as const,
    message: '[研发] 专注于产品开发。精力-25，经验+25，产品质量+3。',
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  return newState;
}

/**
 * 营销推广行动
 */
export function marketingAction(state: GameState): GameState {
  let newState = { ...state };
  newState.character = { ...newState.character };
  newState.company = { ...newState.company };

  // 消耗精力
  newState.character.energy = Math.max(0, newState.character.energy - 15);

  // 消耗现金
  newState.company.cash -= 2000;

  // 增加经验
  newState = addExperience(newState, 15);

  // 提升市场占有率
  newState.company.marketShare = Math.min(100, newState.company.marketShare + 2);

  // 提升营销能力
  newState.character.stats = {
    ...newState.character.stats,
    marketing: Math.min(100, newState.character.stats.marketing + 1),
  };

  // 添加日志
  const logEntry = {
    day: newState.currentDay,
    type: 'action' as const,
    message: '[营销] 进行了市场推广活动。精力-15，费用¥2,000，市场占有率+2，营销能力+1。',
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  return newState;
}

/**
 * 招聘员工行动
 */
export function hireAction(state: GameState): GameState {
  const newState = { ...state };
  newState.company = { ...newState.company };

  // 检查资金
  if (newState.company.cash < 15000) {
    return state; // 资金不足
  }

  // 招聘费用
  newState.company.cash -= 15000;

  // 增加团队规模
  newState.company.teamSize += 1;

  // 添加日志
  const logEntry = {
    day: newState.currentDay,
    type: 'action' as const,
    message: `[招聘] 成功招聘了一名新员工！团队规模: ${newState.company.teamSize}人。招聘费用: ¥15,000。`,
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  return newState;
}

/**
 * 市场调研行动
 */
export function researchMarketAction(state: GameState): GameState {
  let newState = { ...state };
  newState.character = { ...newState.character };

  // 消耗精力
  newState.character.energy = Math.max(0, newState.character.energy - 10);

  // 增加经验
  newState = addExperience(newState, 20);

  // 提升营销和财务能力
  newState.character.stats = {
    ...newState.character.stats,
    marketing: Math.min(100, newState.character.stats.marketing + 2),
    finance: Math.min(100, newState.character.stats.finance + 1),
  };

  // 添加日志
  const logEntry = {
    day: newState.currentDay,
    type: 'action' as const,
    message: '[调研] 进行了市场调研。精力-10，经验+20，营销能力+2，财务能力+1。',
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  return newState;
}

/**
 * 训练技能行动（消耗精力获取经验）
 */
export function trainSkillAction(state: GameState): GameState {
  let newState = { ...state };
  newState.character = { ...newState.character };

  // 消耗精力
  newState.character.energy = Math.max(0, newState.character.energy - 20);

  // 增加经验
  newState = addExperience(newState, 30);

  // 添加日志
  const logEntry = {
    day: newState.currentDay,
    type: 'action' as const,
    message: '[训练] 进行了技能训练。精力-20，经验+30。',
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  return newState;
}

// ============================================================
// 成就系统
// ============================================================

/** 成就定义 */
export const ACHIEVEMENTS = [
  { id: 'first_client', name: '第一个客户', description: '获得第一个付费客户', condition: (s: GameState) => s.company.clients >= 1 },
  { id: 'ten_clients', name: '客户满十', description: '累计拥有10个客户', condition: (s: GameState) => s.company.clients >= 10 },
  { id: 'first_profit', name: '首次盈利', description: '公司首次实现月度盈利', condition: (s: GameState) => s.company.totalProfit > 0 },
  { id: 'survive_30', name: '满月', description: '存活30天', condition: (s: GameState) => s.currentDay >= 30 },
  { id: 'survive_90', name: '季度', description: '存活90天', condition: (s: GameState) => s.currentDay >= 90 },
  { id: 'survive_180', name: '半年', description: '存活180天', condition: (s: GameState) => s.currentDay >= 180 },
  { id: 'survive_365', name: '一年', description: '存活365天', condition: (s: GameState) => s.currentDay >= 365 },
  { id: 'cash_100k', name: '十万富翁', description: '现金储备超过10万', condition: (s: GameState) => s.company.cash >= 100000 },
  { id: 'cash_1m', name: '百万富翁', description: '现金储备超过100万', condition: (s: GameState) => s.company.cash >= 1000000 },
  { id: 'team_5', name: '小团队', description: '团队规模达到5人', condition: (s: GameState) => s.company.teamSize >= 5 },
  { id: 'team_15', name: '大团队', description: '团队规模达到15人', condition: (s: GameState) => s.company.teamSize >= 15 },
  { id: 'quality_80', name: '品质保证', description: '产品质量达到80', condition: (s: GameState) => s.company.productQuality >= 80 },
  { id: 'market_50', name: '半壁江山', description: '市场占有率达到50%', condition: (s: GameState) => s.company.marketShare >= 50 },
  { id: 'level_10', name: '老练创业者', description: '角色等级达到10级', condition: (s: GameState) => s.character.level >= 10 },
  { id: 'reputation_80', name: '声名远播', description: '声望达到80', condition: (s: GameState) => s.character.reputation >= 80 },
  { id: 'projects_10', name: '项目达人', description: '完成10个项目', condition: (s: GameState) => s.company.completedProjects >= 10 },
  { id: 'comeback', name: '浴火重生', description: '在现金低于1万后恢复到10万以上', condition: (s: GameState) => s.company.cash >= 100000 && s.gameLog.some(l => l.message.includes('现金储备不足')) },
];

/**
 * 检查并解锁成就
 */
export function checkAchievements(state: GameState): { state: GameState; newAchievements: string[] } {
  const newState = { ...state };
  const newAchievements: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!newState.achievements.includes(achievement.id) && achievement.condition(newState)) {
      newState.achievements = [...newState.achievements, achievement.id];
      newAchievements.push(achievement.id);

      const logEntry = {
        day: newState.currentDay,
        type: 'achievement' as const,
        message: `[成就] 解锁成就：「${achievement.name}」- ${achievement.description}`,
      };
      newState.gameLog = [...newState.gameLog, logEntry];
    }
  }

  return { state: newState, newAchievements };
}

/** 数值限制 */
function clamp(value: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, value));
}
