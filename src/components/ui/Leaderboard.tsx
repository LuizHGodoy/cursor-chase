import { useEffect, useState } from 'react';
import type { HighScore } from '../../store/leaderboard';
import { getLeaderboard, getPlayerRank } from '../../store/leaderboard';

interface LeaderboardProps {
  currentScore: number;
  playerName: string;
}

export function Leaderboard({ currentScore, playerName }: LeaderboardProps) {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [playerRank, setPlayerRank] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const leaderboard = await getLeaderboard();
        const rank = await getPlayerRank(currentScore);
        setScores(leaderboard);
        setPlayerRank(rank);
      } catch (err) {
        setError('Falha ao carregar leaderboard');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [currentScore]);

  if (isLoading) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 max-w-md w-full">
        <p className="text-white text-center">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 max-w-md w-full">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        🏆 High Scores
      </h2>
      
      <div className="bg-white/10 rounded-lg p-3 mb-4">
        <p className="text-white text-center">
          Sua posição: {playerRank}º lugar
          {playerRank <= 10 ? ' 🎉' : ''}
        </p>
      </div>

      <div className="space-y-2">
        {scores.map((score, index) => (
          <div
            key={`${score.playerName}-${score.date}`}
            className={`flex justify-between p-2 rounded ${
              score.playerName === playerName && score.score === currentScore
                ? 'bg-white/20'
                : 'bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-white/80 w-6">
                {index + 1}.
              </span>
              <span className="text-white">
                {score.playerName}
              </span>
            </div>
            <span className="text-white font-mono">
              {score.score}
            </span>
          </div>
        ))}

        {scores.length === 0 && (
          <p className="text-white/50 text-center py-4">
            Seja o primeiro a fazer um high score!
          </p>
        )}
      </div>
    </div>
  );
} 