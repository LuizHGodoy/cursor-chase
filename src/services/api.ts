import type { HighScore } from '../store/leaderboard';
import { supabase } from '../lib/supabase';

export async function getScores(): Promise<HighScore[]> {
  const { data, error } = await supabase
    .from('high_scores')
    .select('player_name, score, created_at')
    .order('score', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Erro ao buscar scores:', error);
    throw error;
  }

  return data.map(score => ({
    playerName: score.player_name,
    score: score.score,
    date: score.created_at
  }));
}

export async function saveScore(score: HighScore): Promise<void> {
  const { error } = await supabase
    .from('high_scores')
    .insert({
      player_name: score.playerName,
      score: score.score
    });

  if (error) {
    console.error('Erro ao salvar score:', error);
    throw error;
  }
}
