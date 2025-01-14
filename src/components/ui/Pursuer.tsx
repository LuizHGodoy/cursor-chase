interface PursuerProps {
  x: number;
  y: number;
}

export function Pursuer({ x, y }: PursuerProps) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        transform: `translate(${x - 15}px, ${y - 15}px)`,
        transition: "transform 0.016s linear",
      }}
    >
      <div className="w-[30px] h-[30px] bg-white rounded-full animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
    </div>
  );
} 