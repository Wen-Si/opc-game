// ============================================================
// OPC 创业模拟RPG - 随机事件引擎
// ============================================================

import {
  GameEvent,
  GameState,
  EventChoice,
  EventEffects,
  CharacterStats,
} from '../types';
import { getChapterEvents, getChapterByDay, getMainEvents, getRandomEvents } from './storySystem';

/** 每日事件触发概率（基础值） */
const BASE_EVENT_CHANCE = 0.35; // 35%

/** 主线事件触发间隔（天数） */
const MAIN_EVENT_INTERVAL = 15;

/**
 * 每日事件检查 - 判断今天是否触发事件
 */
export function checkDailyEvent(state: GameState): GameEvent | null {
  if (state.isGameOver) return null;

  // 如果有待处理事件，不触发新事件
  if (state.pendingEvent) return null;

  const chapter = getChapterByDay(state.currentDay);

  // 检查是否应该触发主线事件
  const mainEvents = getMainEvents(chapter.number);
  const unplayedMainEvents = mainEvents.filter(
    e => !state.eventHistory.includes(e.id)
  );

  // 每隔 MAIN_EVENT_INTERVAL 天触发主线事件
  if (
    unplayedMainEvents.length > 0 &&
    (state.currentDay === chapter.dayRange[0] ||
      (state.currentDay - chapter.dayRange[0]) % MAIN_EVENT_INTERVAL === 0)
  ) {
    const event = unplayedMainEvents[0];
    return event;
  }

  // 随机事件触发判定
  const randomChance = calculateEventChance(state);
  if (Math.random() < randomChance) {
    const randomEvents = getRandomEvents(chapter.number);
    const available = randomEvents.filter(
      e => !state.eventHistory.includes(e.id)
    );

    if (available.length > 0) {
      // 随机选择一个可用事件
      const index = Math.floor(Math.random() * available.length);
      return available[index];
    }
  }

  return null;
}

/**
 * 计算事件触发概率
 * 基于游戏状态调整概率
 */
function calculateEventChance(state: GameState): number {
  let chance = BASE_EVENT_CHANCE;

  // 倦怠风险越高，危机事件概率越高
  if (state.character.burnoutRisk > 60) {
    chance += 0.15;
  } else if (state.character.burnoutRisk > 40) {
    chance += 0.08;
  }

  // 资金紧张时，危机事件概率增加
  if (state.company.cash < 10000) {
    chance += 0.2;
  } else if (state.company.cash < 30000) {
    chance += 0.1;
  }

  // 声望高时，机遇事件概率增加
  if (state.character.reputation > 70) {
    chance += 0.1;
  }

  // 限制最大概率
  return Math.min(chance, 0.8);
}

/**
 * 应用事件选择的效果到游戏状态
 */
export function applyEventEffects(
  state: GameState,
  event: GameEvent,
  choice: EventChoice
): GameState {
  const newState = { ...state };
  const effects = choice.effects;

  // 应用现金效果
  if (effects.cash) {
    newState.company = { ...newState.company, cash: newState.company.cash + effects.cash };
  }

  // 应用角色属性效果
  if (effects.health) {
    newState.character = { ...newState.character, health: clamp(newState.character.health + effects.health) };
  }
  if (effects.energy) {
    newState.character = { ...newState.character, energy: clamp(newState.character.energy + effects.energy) };
  }
  if (effects.morale) {
    newState.character = { ...newState.character, morale: clamp(newState.character.morale + effects.morale) };
  }
  if (effects.reputation) {
    newState.character = { ...newState.character, reputation: clamp(newState.character.reputation + effects.reputation) };
  }
  if (effects.experience) {
    newState.character = { ...newState.character, experience: newState.character.experience + effects.experience };
  }
  if (effects.mentalHealth) {
    newState.character = { ...newState.character, mentalHealth: clamp(newState.character.mentalHealth + effects.mentalHealth) };
  }
  if (effects.burnoutRisk) {
    newState.character = { ...newState.character, burnoutRisk: clamp(newState.character.burnoutRisk + effects.burnoutRisk) };
  }

  // 应用公司属性效果
  if (effects.productQuality) {
    newState.company = { ...newState.company, productQuality: clamp(newState.company.productQuality + effects.productQuality) };
  }
  if (effects.marketShare) {
    newState.company = { ...newState.company, marketShare: clamp(newState.company.marketShare + effects.marketShare) };
  }
  if (effects.clients) {
    newState.company = { ...newState.company, clients: Math.max(0, newState.company.clients + effects.clients) };
  }
  if (effects.monthlyRevenue) {
    newState.company = { ...newState.company, monthlyRevenue: Math.max(0, newState.company.monthlyRevenue + effects.monthlyRevenue) };
  }
  if (effects.monthlyExpense) {
    newState.company = { ...newState.company, monthlyExpense: Math.max(0, newState.company.monthlyExpense + effects.monthlyExpense) };
  }
  if (effects.teamSize) {
    newState.company = { ...newState.company, teamSize: Math.max(1, newState.company.teamSize + effects.teamSize) };
  }
  if (effects.totalProfit) {
    newState.company = { ...newState.company, totalProfit: newState.company.totalProfit + effects.totalProfit };
  }

  // 应用角色能力属性效果（通过 stats 对象）
  const newStats = { ...newState.character.stats };
  if (effects.stats) {
    if (effects.stats.leadership) newStats.leadership = clamp(newStats.leadership + effects.stats.leadership);
    if (effects.stats.technical) newStats.technical = clamp(newStats.technical + effects.stats.technical);
    if (effects.stats.marketing) newStats.marketing = clamp(newStats.marketing + effects.stats.marketing);
    if (effects.stats.finance) newStats.finance = clamp(newStats.finance + effects.stats.finance);
    if (effects.stats.creativity) newStats.creativity = clamp(newStats.creativity + effects.stats.creativity);
    if (effects.stats.resilience) newStats.resilience = clamp(newStats.resilience + effects.stats.resilience);
    if (effects.stats.networking) newStats.networking = clamp(newStats.networking + effects.stats.networking);
  }
  // 也支持直接在 effects 中指定角色能力属性
  if (effects.leadership) newStats.leadership = clamp(newStats.leadership + effects.leadership);
  if (effects.technical) newStats.technical = clamp(newStats.technical + effects.technical);
  if (effects.marketing) newStats.marketing = clamp(newStats.marketing + effects.marketing);
  if (effects.finance) newStats.finance = clamp(newStats.finance + effects.finance);
  if (effects.creativity) newStats.creativity = clamp(newStats.creativity + effects.creativity);
  if (effects.resilience) newStats.resilience = clamp(newStats.resilience + effects.resilience);
  if (effects.networking) newStats.networking = clamp(newStats.networking + effects.networking);
  newState.character = { ...newState.character, stats: newStats };

  // 记录事件到历史
  newState.eventHistory = [...newState.eventHistory, event.id];

  // 添加日志
  const logEntry = {
    day: newState.currentDay,
    type: 'event' as const,
    message: `[事件] ${event.title}: ${choice.outcomeText}`,
  };
  newState.gameLog = [...newState.gameLog, logEntry];

  // 清除待处理事件
  newState.pendingEvent = undefined;

  return newState;
}

/**
 * 检查选择是否满足属性要求
 */
export function checkChoiceRequirements(
  choice: EventChoice,
  stats: CharacterStats
): boolean {
  if (!choice.requirements) return true;

  const reqs = choice.requirements;
  if (reqs.leadership && stats.leadership < reqs.leadership) return false;
  if (reqs.technical && stats.technical < reqs.technical) return false;
  if (reqs.marketing && stats.marketing < reqs.marketing) return false;
  if (reqs.finance && stats.finance < reqs.finance) return false;
  if (reqs.creativity && stats.creativity < reqs.creativity) return false;
  if (reqs.resilience && stats.resilience < reqs.resilience) return false;
  if (reqs.networking && stats.networking < reqs.networking) return false;

  return true;
}

/**
 * 获取事件中可用的选择（满足属性要求的）
 */
export function getAvailableChoices(
  event: GameEvent,
  stats: CharacterStats
): EventChoice[] {
  return event.choices.filter(choice => checkChoiceRequirements(choice, stats));
}

/**
 * 获取当前章节的可用事件列表
 */
export function getAvailableEventsForState(state: GameState): GameEvent[] {
  const chapter = getChapterByDay(state.currentDay);
  const allChapterEvents = getChapterEvents(chapter.number);
  return allChapterEvents.filter(e => !state.eventHistory.includes(e.id));
}

/**
 * 应用通用效果到游戏状态（用于行动系统）
 */
export function applyEffects(state: GameState, effects: EventEffects): GameState {
  // 创建一个虚拟事件用于复用 applyEventEffects
  const dummyEvent: GameEvent = {
    id: 'action',
    type: 'random',
    title: '行动',
    description: '',
    choices: [{
      id: 'action_choice',
      text: '',
      effects,
      outcomeText: '',
    }],
  };
  return applyEventEffects(state, dummyEvent, dummyEvent.choices[0]);
}

/** 数值限制在0-100之间 */
function clamp(value: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, value));
}
