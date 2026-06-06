import { GameEvent, Chapter } from '../types';
/** 章节定义 */
export declare const CHAPTERS: Chapter[];
/** 根据天数获取当前章节 */
export declare function getChapterByDay(day: number): Chapter;
/** 获取章节所有事件 */
export declare function getEventsByChapter(chapter: number): GameEvent[];
/** 获取所有事件 */
export declare function getAllEvents(): GameEvent[];
/** 获取指定章节的事件 */
export declare function getChapterEvents(chapter: number): GameEvent[];
/** 获取指定章节的主线事件 */
export declare function getMainEvents(chapter: number): GameEvent[];
/** 获取指定章节的随机事件 */
export declare function getRandomEvents(chapter: number): GameEvent[];
/** 根据条件筛选可用事件 */
export declare function getAvailableEvents(chapter: number, eventHistory: string[]): GameEvent[];
//# sourceMappingURL=storySystem.d.ts.map