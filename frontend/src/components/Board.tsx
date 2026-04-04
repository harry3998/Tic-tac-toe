import Square from './Square';
import type { Player } from '../types/game';

type Props = {
  board: Player[];
  onClick: (index: number) => void;
};

export default function Board({ board, onClick }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)' }}>
      {board.map((val, i) => (
        <Square key={i} value={val} onClick={() => onClick(i)} />
      ))}
    </div>
  );
}