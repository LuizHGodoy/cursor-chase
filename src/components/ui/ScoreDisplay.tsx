interface ScoreDisplayProps {
  score: number;
  speed: number;
  playerName: string;
}

export function ScoreDisplay({ score, speed, playerName }: ScoreDisplayProps) {
  return (
    <div className="fixed top-4 left-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
      <p className="text-white font-mono">
        Player: {playerName} | Score: {score} | Speed: {Math.round(speed * 1000)}
      </p>
    </div>
  );
} 