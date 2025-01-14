export interface IPowerUp {
  id: string;
  position: {
    x: number;
    y: number;
  };
  type: 'score' | 'multiplier';
  value: number;
  color: string;
  duration: number;
  createdAt: number;
}