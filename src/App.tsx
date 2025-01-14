import type React from "react";
import { useEffect, useRef } from "react";
import { useAtom } from 'jotai';
import { gameStateAtom, mousePosAtom, pursuerPosAtom } from './store/atoms';
import { ScoreDisplay } from './components/ui/ScoreDisplay';
import { Pursuer } from './components/ui/Pursuer';
import { GameOver } from './components/GameOver';
import { StartScreen } from './components/StartScreen';

function App() {
	const [gameState, setGameState] = useAtom(gameStateAtom);
	const [mousePos, setMousePos] = useAtom(mousePosAtom);
	const [pursuerPos, setPursuerPos] = useAtom(pursuerPosAtom);
	
	const animationFrameRef = useRef<number>();
	const lastUpdateRef = useRef<number>(0);

	const startGame = (playerName: string) => {
		localStorage.setItem('playerName', playerName);

		setGameState({
			score: 0,
			isGameOver: false,
			difficulty: 0.04,
			isPlaying: true,
			lastScoreUpdate: Date.now(),
			playerName,
		});
		setPursuerPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
	};

	useEffect(() => {
		if (!gameState.isPlaying || gameState.isGameOver) {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			return;
		}

		const updateGame = (timestamp: number) => {
			if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
			const deltaTime = timestamp - lastUpdateRef.current;
			lastUpdateRef.current = timestamp;

			const now = Date.now();
			const timeSinceLastScore = now - gameState.lastScoreUpdate;
			
			if (timeSinceLastScore >= 1000) {
				console.log('📊 Atualizando score:', gameState.score + 1);
				setGameState(prev => ({
					...prev,
					score: prev.score + 1,
					difficulty: Math.min(0.12, 0.04 + (prev.score + 1) * 0.0001),
					lastScoreUpdate: now
				}));
			}

			setPursuerPos((prev) => {
				const dx = mousePos.x - prev.x;
				const dy = mousePos.y - prev.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				console.log('🎯 Status:', {
					score: gameState.score,
					dificuldade: gameState.difficulty,
					distancia: Math.round(distance)
				});

				if (distance < 30) {
					setGameState(prev => ({ ...prev, isGameOver: true, isPlaying: false }));
					return prev;
				}

				return {
					x: prev.x + dx * gameState.difficulty * (deltaTime / 16),
					y: prev.y + dy * gameState.difficulty * (deltaTime / 16),
				};
			});

			animationFrameRef.current = requestAnimationFrame(updateGame);
		};

		animationFrameRef.current = requestAnimationFrame(updateGame);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [gameState.isPlaying, gameState.isGameOver, gameState.lastScoreUpdate, gameState.difficulty, gameState.score, mousePos, setGameState, setPursuerPos]);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!gameState.isPlaying || gameState.isGameOver) return;
		setMousePos({ x: e.clientX, y: e.clientY });
	};

	return (
		<div
			className="min-h-screen bg-gray-900 relative overflow-hidden"
			onMouseMove={handleMouseMove}
		>
			{gameState.isPlaying && (
				<ScoreDisplay 
					score={gameState.score} 
					speed={gameState.difficulty}
					playerName={gameState.playerName}
				/>
			)}

			{gameState.isGameOver && (
				<GameOver 
					score={gameState.score} 
					playerName={gameState.playerName}
					onRestart={() => startGame(gameState.playerName)} 
				/>
			)}

			{!gameState.isPlaying && !gameState.isGameOver && (
				<StartScreen 
					onStart={startGame}
					initialPlayerName={gameState.playerName} 
				/>
			)}

			{gameState.isPlaying && (
				<Pursuer x={pursuerPos.x} y={pursuerPos.y} />
			)}
		</div>
	);
}

export default App;
