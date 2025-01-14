import { atom } from 'jotai';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  score: number;
  isGameOver: boolean;
  difficulty: number;
  isPlaying: boolean;
  lastScoreUpdate: number;
  playerName: string;
}

const savedPlayerName = localStorage.getItem('playerName');

export const gameStateAtom = atom<GameState>({
  score: 0,
  isGameOver: false,
  difficulty: 0.04,
  isPlaying: !!savedPlayerName,
  lastScoreUpdate: 0,
  playerName: savedPlayerName || '',
});

export const mousePosAtom = atom<Position>({ x: 0, y: 0 });

export const pursuerPosAtom = atom<Position>({
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
}); 