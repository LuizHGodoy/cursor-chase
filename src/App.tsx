import type React from "react";
import { useEffect, useRef } from "react";
import { atom, useAtom } from 'jotai';

interface Position {
	x: number;
	y: number;
}

interface GameState {
	score: number;
	isGameOver: boolean;
	difficulty: number;
	isPlaying: boolean;
	lastScoreUpdate: number;
}

const gameStateAtom = atom<GameState>({
	score: 0,
	isGameOver: false,
	difficulty: 0.04,
	isPlaying: false,
	lastScoreUpdate: 0,
});

const mousePosAtom = atom<Position>({ x: 0, y: 0 });
const pursuerPosAtom = atom<Position>({
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
});

function App() {
	const [gameState, setGameState] = useAtom(gameStateAtom);
	const [mousePos, setMousePos] = useAtom(mousePosAtom);
	const [pursuerPos, setPursuerPos] = useAtom(pursuerPosAtom);
	
	const animationFrameRef = useRef<number>();
	const lastUpdateRef = useRef<number>(0);

	const startGame = () => {
		setGameState({
			score: 0,
			isGameOver: false,
			difficulty: 0.04,
			isPlaying: true,
			lastScoreUpdate: Date.now(),
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
				<div className="fixed top-4 left-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
					<p className="text-white font-mono">
						Score: {gameState.score} | Speed:{" "}
						{Math.round(gameState.difficulty * 1000)}
					</p>
				</div>
			)}

			{gameState.isGameOver && (
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
					<h1 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h1>
					<p className="text-2xl text-white mb-8">
						Final Score: {gameState.score}
					</p>
					<button
						type="button"
						onClick={() => startGame()}
						className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
					>
						Play Again
					</button>
				</div>
			)}

			{!gameState.isPlaying && !gameState.isGameOver && (
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<h1 className="text-4xl font-bold text-white mb-8">Cursor Chase</h1>
					<p className="text-white/80 text-xl font-light mb-8 text-center max-w-md">
						Evade the white circle as long as you can!
						<br />
						The pursuer gets faster as time passes.
					</p>
					<button
						type="button"
						onClick={() => startGame()}
						className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
					>
						Start Game
					</button>
				</div>
			)}

			{gameState.isPlaying && (
				<div
					className="absolute pointer-events-none"
					style={{
						transform: `translate(${pursuerPos.x - 15}px, ${pursuerPos.y - 15}px)`,
						transition: "transform 0.016s linear",
					}}
				>
					<div className="w-[30px] h-[30px] bg-white rounded-full animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
				</div>
			)}
		</div>
	);
}

export default App;
