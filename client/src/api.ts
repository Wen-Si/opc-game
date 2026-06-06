import type {
  GameState,
  CreateGameRequest,
  ActionRequest,
  GameEvent,
} from './types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `请求失败: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`API Error [${url}]:`, error.message);
      throw error;
    }
    throw new Error('未知网络错误');
  }
}

export async function createGame(data: CreateGameRequest): Promise<GameState> {
  return request<GameState>('/api/game/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getGameState(userId: string): Promise<GameState> {
  return request<GameState>(`/api/game/state?userId=${encodeURIComponent(userId)}`);
}

export async function executeAction(
  userId: string,
  action: ActionRequest
): Promise<GameState> {
  return request<GameState>(`/api/game/action`, {
    method: 'POST',
    body: JSON.stringify({ userId, ...action }),
  });
}

export async function getNextDay(userId: string): Promise<GameState> {
  return request<GameState>(`/api/game/next-day`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function learnSkill(
  userId: string,
  skillId: string
): Promise<GameState> {
  return request<GameState>(`/api/game/learn-skill`, {
    method: 'POST',
    body: JSON.stringify({ userId, skillId }),
  });
}

export async function getEvents(userId: string): Promise<GameEvent[]> {
  return request<GameEvent[]>(`/api/game/events?userId=${encodeURIComponent(userId)}`);
}

export async function saveGame(state: GameState): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/api/game/save', {
    method: 'POST',
    body: JSON.stringify(state),
  });
}

export async function loadGame(userId: string): Promise<GameState> {
  return request<GameState>(`/api/game/load?userId=${encodeURIComponent(userId)}`);
}
