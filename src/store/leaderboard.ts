import { getScores, saveScore as apiSaveScore } from '../services/api';

export interface HighScore {
  playerName: string;
  score: number;
  date: string;
}

export async function getLeaderboard(): Promise<HighScore[]> {
  try {
    return await getScores();
  } catch (error) {
    console.error('Erro ao buscar scores:', error);
    return [];
  }
}

export async function saveScore(score: HighScore): Promise<void> {
  try {
    await apiSaveScore(score);
  } catch (error) {
    console.error('Erro ao salvar score:', error);
  }
}

export async function getPlayerRank(score: number): Promise<number> {
  const leaderboard = await getLeaderboard();
  let rank = 1;
  
  for (const entry of leaderboard) {
    if (entry.score > score) {
      rank++;
    }
  }
  
  return rank;
} 