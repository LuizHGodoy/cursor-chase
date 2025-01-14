import { useAtom } from "jotai";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { GameOver } from "./components/GameOver";
import { StartScreen } from "./components/StartScreen";
import { PowerUp } from "./components/ui/PowerUp";
import { Pursuer } from "./components/ui/Pursuer";
import { ScoreDisplay } from "./components/ui/ScoreDisplay";
import { useSounds } from "./hooks/useSounds";
import { gameStateAtom, mousePosAtom, powerUpsAtom } from "./store/atoms";
import { IPowerUp } from "./types/types";

function App() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [mousePos, setMousePos] = useAtom(mousePosAtom);
  const [powerUps, setPowerUps] = useAtom<IPowerUp[]>(powerUpsAtom);
  const { playSound, stopSound } = useSounds();

  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const lastPowerUpSpawnRef = useRef<number>(0);

  const startGame = (playerName: string) => {
    console.log("Iniciando jogo, tocando BGM...");
    playSound("bgm");
    localStorage.setItem("playerName", playerName);

    setGameState({
      score: 0,
      isGameOver: false,
      difficulty: 0.04,
      isPlaying: true,
      lastScoreUpdate: Date.now(),
      playerName,
      scoreMultiplier: 1,
      pursuers: [
        {
          id: "initial",
          position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
          speed: 0.04,
        },
      ],
    });
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

  const handleGameOver = useCallback(() => {
    stopSound("bgm");
    playSound("gameOver");
    setGameState((prev) => ({
      ...prev,
      isGameOver: true,
      isPlaying: false,
    }));
  }, [playSound, stopSound, setGameState]);

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
        setGameState((prev) => {
          const newScore = prev.score + 1 * prev.scoreMultiplier;
          const newDifficulty = Math.min(0.12, 0.04 + newScore * 0.0001);

          const shouldAddPursuer =
            Math.floor(newScore / 50) > Math.floor(prev.score / 50);

          if (shouldAddPursuer) {
            playSound("newPursuer");
          }

          const newPursuers = shouldAddPursuer
            ? [
                ...prev.pursuers,
                {
                  id: crypto.randomUUID(),
                  position: {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  },
                  speed: newDifficulty,
                },
              ]
            : prev.pursuers;

          return {
            ...prev,
            score: newScore,
            difficulty: newDifficulty,
            lastScoreUpdate: now,
            pursuers: newPursuers,
          };
        });
      }

      const mouseRadius = 20;

      setGameState((prev) => {
        const updatedPursuers = prev.pursuers.map((pursuer) => {
          const dx = mousePos.x - pursuer.position.x;
          const dy = mousePos.y - pursuer.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 30) {
            handleGameOver();
          }

          return {
            ...pursuer,
            position: {
              x: pursuer.position.x + dx * pursuer.speed * (deltaTime / 16),
              y: pursuer.position.y + dy * pursuer.speed * (deltaTime / 16),
            },
          };
        });

        const collidedWithPlayer = updatedPursuers.some((pursuer) => {
          const dx = mousePos.x - pursuer.position.x;
          const dy = mousePos.y - pursuer.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < 30;
        });

        if (collidedWithPlayer) {
          return {
            ...prev,
            isGameOver: true,
            isPlaying: false,
            pursuers: updatedPursuers,
          };
        }

        return {
          ...prev,
          pursuers: updatedPursuers,
        };
      });

      setPowerUps((prev) => {
        const collidedPowerUp = prev.find((powerUp) => {
          const dx = mousePos.x - powerUp.position.x;
          const dy = mousePos.y - powerUp.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < mouseRadius + 16;
        });

        if (collidedPowerUp) {
          playSound(
            collidedPowerUp.type === "score" ? "scoreBonus" : "multiplierBonus"
          );
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
    gameState.score,
    gameState.lastScoreUpdate,
    mousePos,
    setGameState,
    setPowerUps,
    spawnPowerUp,
    playSound,
    stopSound,
    handleGameOver,
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
          {gameState.pursuers.map((pursuer) => (
            <Pursuer
              key={pursuer.id}
              x={pursuer.position.x}
              y={pursuer.position.y}
            />
          ))}
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
