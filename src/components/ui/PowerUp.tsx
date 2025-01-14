import type React from "react";
import type { Position } from "../../store/atoms";

interface PowerUpProps {
  position: Position;
  type: "score" | "multiplier";
  value: number;
  color: string;
  duration: number;
  createdAt: number;
}

export const PowerUp: React.FC<PowerUpProps> = ({
  position,
  type,
  value,
  color,
  duration,
  createdAt,
}) => {
  const timeLeft = Math.max(
    0,
    Math.round((duration - (Date.now() - createdAt)) / 1000)
  );

  return (
    <div
      className={`absolute w-8 h-8 rounded-full ${color} animate-pulse flex items-center justify-center text-black font-bold transform -translate-x-1/2 -translate-y-1/2`}
      style={{
        left: position.x,
        top: position.y,
        boxShadow: `0 0 15px ${color.replace("bg-", "rgb-")}`,
      }}
    >
      {type === "multiplier" ? `${value}x` : `+${value}`}
      <div className="absolute -bottom-5 text-xs text-white">{timeLeft}s</div>
    </div>
  );
};
