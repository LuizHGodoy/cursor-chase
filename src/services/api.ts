import type { HighScore } from '../store/leaderboard';

const API_URL = '/api/scores';

export async function getScores(): Promise<HighScore[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch scores');
  }
  return response.json();
}

export async function saveScore(score: HighScore): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(score),
  });

  if (!response.ok) {
    throw new Error('Failed to save score');
  }
}
