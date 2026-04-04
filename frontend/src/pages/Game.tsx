import { useEffect, useState } from 'react';
import { socket } from '../socket/socket';
import { useParams } from 'react-router-dom';
import Board from '../components/Board';
import type { GameState } from '../types/game';

export default function Game() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [game, setGame] = useState<GameState>({
    board: Array(9).fill(null),
    turn: 'X',
  });

  useEffect(() => {
    socket.emit('join_room', { roomId: id, userId: user.id });

    socket.on('move_made', (gameState: GameState) => {
      setGame(gameState);
    });

    return () => {
      socket.off('move_made');
    };
  }, []);

  const handleClick = (index: number) => {
    socket.emit('make_move', {
      roomId: id,
      index,
      userId: user.id
    });
  };

  return (
    <div>
      <h2>Turn: {game.turn}</h2>
      {game.result && <h3>Result: {game.result}</h3>}
      <Board board={game.board} onClick={handleClick} />
    </div>
  );
}