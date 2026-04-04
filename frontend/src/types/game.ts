export type Player = 'X' | 'O' | null;

export interface GameState {
  board: Player[];
  turn: Player;
  result?: 'X' | 'O' | 'draw' | null;
}