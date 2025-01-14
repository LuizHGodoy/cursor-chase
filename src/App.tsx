import { useAtom } from "jotai";
import type React from "react";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { GameOver } from "./components/GameOver";
import { StartScreen } from "./components/StartScreen";
import { PowerUp } from "./components/ui/PowerUp";
import { Pursuer } from "./components/ui/Pursuer";
import { ScoreDisplay } from "./components/ui/ScoreDisplay";
import {
  gameStateAtom,
  mousePosAtom,
  powerUpsAtom,
  pursuerPosAtom,
} from "./store/atoms";
import { IPowerUp } from "./types/types";

function App() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [mousePos, setMousePos] = useAtom(mousePosAtom);
  const [pursuerPos, setPursuerPos] = useAtom(pursuerPosAtom);
  const [powerUps, setPowerUps] = useAtom<IPowerUp[]>(powerUpsAtom);

  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const lastPowerUpSpawnRef = useRef<number>(0);

  const startGame = (playerName: string) => {
    localStorage.setItem("playerName", playerName);

    setGameState({
      score: 0,
      isGameOver: false,
      difficulty: 0.04,
      isPlaying: true,
      lastScoreUpdate: Date.now(),
      playerName,
      scoreMultiplier: 1,
    });
    setPursuerPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setPowerUps([]);
  };

  const powerUpTypes = useMemo(() => {
    const types: Array<{
      type: "score" | "multiplier";
      value: number;
      color: string;
      duration: number;
      chance: number;
    }> = [
      {
        type: "multiplier",
        value: 2,
        color: "bg-yellow-400",
        duration: 7000,
        chance: 0.3,
      },
      {
        type: "multiplier",
        value: 3,
        color: "bg-purple-400",
        duration: 5000,
        chance: 0.2,
      },
      {
        type: "score",
        value: 10,
        color: "bg-green-400",
        duration: 4000,
        chance: 0.2,
      },
      {
        type: "score",
        value: 50,
        color: "bg-blue-400",
        duration: 3000,
        chance: 0.2,
      },
      {
        type: "score",
        value: 100,
        color: "bg-red-400",
        duration: 2000,
        chance: 0.1,
      },
    ];
    return types;
  }, []);

  const spawnPowerUp = useCallback(() => {
    const padding = 100;
    const random = Math.random();
    let selectedType = powerUpTypes[0];
    let accumulatedChance = 0;

    for (const type of powerUpTypes) {
      accumulatedChance += type.chance;
      if (random <= accumulatedChance) {
        selectedType = type;
        break;
      }
    }

    const newPowerUp: IPowerUp = {
      id: crypto.randomUUID(),
      position: {
        x: Math.random() * (window.innerWidth - 2 * padding) + padding,
        y: Math.random() * (window.innerHeight - 2 * padding) + padding,
      },
      type: selectedType.type,
      value: selectedType.value,
      color: selectedType.color,
      duration: selectedType.duration,
      createdAt: Date.now(),
    };
    setPowerUps((prev) => [...prev, newPowerUp]);
  }, [powerUpTypes, setPowerUps]);

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

      if (now - lastPowerUpSpawnRef.current >= 5000) {
        spawnPowerUp();
        lastPowerUpSpawnRef.current = now;
      }

      setPowerUps((prev) =>
        prev.filter((powerUp) => now - powerUp.createdAt < 7000)
      );

      if (timeSinceLastScore >= 1000) {
        setGameState((prev) => ({
          ...prev,
          score: prev.score + 1 * prev.scoreMultiplier,
          difficulty: Math.min(0.12, 0.04 + (prev.score + 1) * 0.0001),
          lastScoreUpdate: now,
        }));
      }

      const mouseRadius = 20;
      setPowerUps((prev) => {
        const collidedPowerUp = prev.find((powerUp) => {
          const dx = mousePos.x - powerUp.position.x;
          const dy = mousePos.y - powerUp.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < mouseRadius + 16;
        });

        if (collidedPowerUp) {
          setGameState((prev) => ({
            ...prev,
            score:
              collidedPowerUp.type === "score"
                ? prev.score + collidedPowerUp.value
                : prev.score,
            scoreMultiplier:
              collidedPowerUp.type === "multiplier"
                ? collidedPowerUp.value
                : prev.scoreMultiplier,
          }));
          return prev.filter((p) => p.id !== collidedPowerUp.id);
        }
        return prev;
      });

      setPursuerPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 30) {
          setGameState((prev) => ({
            ...prev,
            isGameOver: true,
            isPlaying: false,
          }));
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
  }, [
    gameState.isPlaying,
    gameState.isGameOver,
    gameState.lastScoreUpdate,
    gameState.difficulty,
    gameState.score,
    mousePos,
    setGameState,
    setPursuerPos,
    setPowerUps,
    spawnPowerUp,
  ]);

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
          multiplier={gameState.scoreMultiplier}
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
        <>
          <Pursuer x={pursuerPos.x} y={pursuerPos.y} />
          {powerUps.map((powerUp) => (
            <PowerUp
              key={powerUp.id}
              position={powerUp.position}
              type={powerUp.type}
              value={powerUp.value}
              color={powerUp.color}
              duration={powerUp.duration}
              createdAt={powerUp.createdAt}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default App;
