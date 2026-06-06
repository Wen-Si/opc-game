import { GameEvent, GameState, EventChoice, EventEffects, CharacterStats } from '../types';
/**
 * 每日事件检查 - 判断今天是否触发事件
 */
export declare function checkDailyEvent(state: GameState): GameEvent | null;
/**
 * 应用事件选择的效果到游戏状态
 */
export declare function applyEventEffects(state: GameState, event: GameEvent, choice: EventChoice): GameState;
/**
 * 检查选择是否满足属性要求
 */
export declare function checkChoiceRequirements(choice: EventChoice, stats: CharacterStats): boolean;
/**
 * 获取事件中可用的选择（满足属性要求的）
 */
export declare function getAvailableChoices(event: GameEvent, stats: CharacterStats): EventChoice[];
/**
 * 获取当前章节的可用事件列表
 */
export declare function getAvailableEventsForState(state: GameState): GameEvent[];
/**
 * 应用通用效果到游戏状态（用于行动系统）
 */
export declare function applyEffects(state: GameState, effects: EventEffects): GameState;
//# sourceMappingURL=eventSystem.d.ts.map