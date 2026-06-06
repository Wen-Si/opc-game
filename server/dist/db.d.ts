import Database from 'better-sqlite3';
import { GameState } from './types';
/** 初始化数据库连接和表结构 */
export declare function initDatabase(): Database.Database;
/** 获取数据库实例 */
export declare function getDb(): Database.Database;
/** 创建用户 */
export declare function createUser(userId: string, username?: string): void;
/** 获取用户信息 */
export declare function getUser(userId: string): {
    id: string;
    username: string;
    created_at: string;
    last_login: string;
} | null;
/** 更新用户最后登录时间 */
export declare function updateUserLogin(userId: string): void;
/** 保存游戏状态 */
export declare function saveGame(userId: string, state: GameState): void;
/** 加载游戏状态 */
export declare function loadGame(userId: string): GameState | null;
/** 检查游戏是否存在 */
export declare function gameExists(userId: string): boolean;
/** 删除游戏存档 */
export declare function deleteGame(userId: string): boolean;
/** 获取所有游戏存档列表 */
export declare function listGames(): Array<{
    userId: string;
    updatedAt: string;
}>;
/** 解锁成就 */
export declare function unlockAchievement(userId: string, achievementId: string): void;
/** 获取用户所有成就 */
export declare function getUserAchievements(userId: string): string[];
/** 添加排行榜记录 */
export declare function addToLeaderboard(userId: string, characterName: string, companyName: string, score: number, daysSurvived: number): void;
/** 获取排行榜前N名 */
export declare function getLeaderboard(limit?: number): Array<{
    rank: number;
    userId: string;
    characterName: string;
    companyName: string;
    score: number;
    daysSurvived: number;
    completedAt: string;
}>;
/** 关闭数据库连接 */
export declare function closeDatabase(): void;
//# sourceMappingURL=db.d.ts.map