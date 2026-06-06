// ============================================================
// OPC 创业模拟RPG - SQLite 数据库模块
// ============================================================

import Database from 'better-sqlite3';
import path from 'path';
import { GameState } from './types';

const DB_PATH = path.join(__dirname, '..', 'game.db');

let db: Database.Database;

/** 初始化数据库连接和表结构 */
export function initDatabase(): Database.Database {
  db = new Database(DB_PATH);

  // 启用 WAL 模式提升并发性能
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // 创建用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      last_login TEXT DEFAULT (datetime('now'))
    )
  `);

  // 创建游戏存档表
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      user_id TEXT PRIMARY KEY,
      game_state TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 创建成就记录表
  db.exec(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      achievement_id TEXT NOT NULL,
      unlocked_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, achievement_id)
    )
  `);

  // 创建排行榜表
  db.exec(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      character_name TEXT NOT NULL,
      company_name TEXT NOT NULL,
      score INTEGER NOT NULL,
      days_survived INTEGER NOT NULL,
      completed_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('[DB] 数据库初始化完成:', DB_PATH);
  return db;
}

/** 获取数据库实例 */
export function getDb(): Database.Database {
  if (!db) {
    throw new Error('数据库未初始化，请先调用 initDatabase()');
  }
  return db;
}

// ============================================================
// 用户相关操作
// ============================================================

/** 创建用户 */
export function createUser(userId: string, username?: string): void {
  const database = getDb();
  const stmt = database.prepare(
    'INSERT OR IGNORE INTO users (id, username) VALUES (?, ?)'
  );
  stmt.run(userId, username || userId);
}

/** 获取用户信息 */
export function getUser(userId: string): { id: string; username: string; created_at: string; last_login: string } | null {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(userId) as any || null;
}

/** 更新用户最后登录时间 */
export function updateUserLogin(userId: string): void {
  const database = getDb();
  const stmt = database.prepare(
    "UPDATE users SET last_login = datetime('now') WHERE id = ?"
  );
  stmt.run(userId);
}

// ============================================================
// 游戏存档操作
// ============================================================

/** 保存游戏状态 */
export function saveGame(userId: string, state: GameState): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO games (user_id, game_state, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(user_id) DO UPDATE SET
      game_state = excluded.game_state,
      updated_at = excluded.updated_at
  `);
  stmt.run(userId, JSON.stringify(state));
}

/** 加载游戏状态 */
export function loadGame(userId: string): GameState | null {
  const database = getDb();
  const stmt = database.prepare('SELECT game_state FROM games WHERE user_id = ?');
  const row = stmt.get(userId) as { game_state: string } | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.game_state) as GameState;
  } catch (e) {
    console.error('[DB] 解析游戏存档失败:', e);
    return null;
  }
}

/** 检查游戏是否存在 */
export function gameExists(userId: string): boolean {
  const database = getDb();
  const stmt = database.prepare('SELECT 1 FROM games WHERE user_id = ?');
  return !!stmt.get(userId);
}

/** 删除游戏存档 */
export function deleteGame(userId: string): boolean {
  const database = getDb();
  const stmt = database.prepare('DELETE FROM games WHERE user_id = ?');
  const result = stmt.run(userId);
  return result.changes > 0;
}

/** 获取所有游戏存档列表 */
export function listGames(): Array<{ userId: string; updatedAt: string }> {
  const database = getDb();
  const stmt = database.prepare(
    'SELECT user_id as userId, updated_at as updatedAt FROM games ORDER BY updated_at DESC'
  );
  return stmt.all() as any[];
}

// ============================================================
// 成就操作
// ============================================================

/** 解锁成就 */
export function unlockAchievement(userId: string, achievementId: string): void {
  const database = getDb();
  const stmt = database.prepare(
    'INSERT OR IGNORE INTO achievements (user_id, achievement_id) VALUES (?, ?)'
  );
  stmt.run(userId, achievementId);
}

/** 获取用户所有成就 */
export function getUserAchievements(userId: string): string[] {
  const database = getDb();
  const stmt = database.prepare(
    'SELECT achievement_id FROM achievements WHERE user_id = ?'
  );
  const rows = stmt.all(userId) as Array<{ achievement_id: string }>;
  return rows.map(r => r.achievement_id);
}

// ============================================================
// 排行榜操作
// ============================================================

/** 添加排行榜记录 */
export function addToLeaderboard(
  userId: string,
  characterName: string,
  companyName: string,
  score: number,
  daysSurvived: number
): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO leaderboard (user_id, character_name, company_name, score, days_survived)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(userId, characterName, companyName, score, daysSurvived);
}

/** 获取排行榜前N名 */
export function getLeaderboard(limit: number = 10): Array<{
  rank: number;
  userId: string;
  characterName: string;
  companyName: string;
  score: number;
  daysSurvived: number;
  completedAt: string;
}> {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT user_id as userId, character_name as characterName,
           company_name as companyName, score, days_survived as daysSurvived,
           completed_at as completedAt
    FROM leaderboard
    ORDER BY score DESC, days_survived ASC
    LIMIT ?
  `);
  const rows = stmt.all(limit) as any[];
  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

/** 关闭数据库连接 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    console.log('[DB] 数据库连接已关闭');
  }
}
