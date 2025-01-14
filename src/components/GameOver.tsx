import { useEffect } from "react";
import { saveScore } from "../store/leaderboard";
import { Leaderboard } from "./ui/Leaderboard";

interface GameOverProps {
  score: number;
  playerName: string;
  onRestart: () => void;
}

export function GameOver({ score, playerName, onRestart }: GameOverProps) {
  useEffect(() => {
    const savedScoreKey = `saved_score_${playerName}_${score}`;
    if (!localStorage.getItem(savedScoreKey)) {
      saveScore({
        playerName,
        score,
        date: new Date().toISOString(),
      });
      localStorage.setItem(savedScoreKey, "true");
    }
  }, [playerName, score]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="flex flex-col items-center max-w-2xl w-full gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h1>
          <p className="text-2xl text-white mb-2">Jogador: {playerName}</p>
          <p className="text-2xl text-white mb-8">Pontuação Final: {score}</p>

          <button
            type="button"
            onClick={onRestart}
            className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Jogar Novamente
          </button>
        </div>

        <Leaderboard currentScore={score} playerName={playerName} />
      </div>
    </div>
  );
}
