import type React from "react";

interface ScoreDisplayProps {
	score: number;
	speed: number;
	playerName: string;
	multiplier: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
	score,
	speed,
	playerName,
	multiplier,
}) => {
	return (
		<div className="absolute top-4 left-4 text-white font-bold">
			<div className="text-2xl mb-2">{playerName}</div>
			<div className="text-xl">Pontuação: {score}</div>
			<div className="text-sm text-gray-300">
				Velocidade: {Math.round(speed * 100)}%
			</div>
			{multiplier > 1 && (
				<div className="text-lg text-yellow-400 animate-pulse">
					Multiplicador: {multiplier}x
				</div>
			)}
		</div>
	);
};
