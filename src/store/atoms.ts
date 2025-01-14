import { atom } from "jotai";
import { IPowerUp } from "../types/types";

export interface Position {
	x: number;
	y: number;
}

export interface Pursuer {
	id: string;
	position: Position;
	speed: number;
}

export interface GameState {
	score: number;
	isGameOver: boolean;
	difficulty: number;
	isPlaying: boolean;
	lastScoreUpdate: number;
	playerName: string;
	scoreMultiplier: number;
	pursuers: Pursuer[];
}

const savedPlayerName = localStorage.getItem("playerName");

export const gameStateAtom = atom<GameState>({
	score: 0,
	isGameOver: false,
	difficulty: 0.04,
	isPlaying: !!savedPlayerName,
	lastScoreUpdate: 0,
	playerName: savedPlayerName || "",
	scoreMultiplier: 1,
	pursuers: [{
		id: 'initial',
		position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
		speed: 0.04
	}]
});

export const mousePosAtom = atom<Position>({ x: 0, y: 0 });

export const pursuerPosAtom = atom<Position>({
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
});

export const powerUpsAtom = atom<IPowerUp[]>([]);
