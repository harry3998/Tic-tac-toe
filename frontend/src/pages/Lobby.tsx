import { useEffect, useState } from 'react';
import { getRooms, createRoom, joinRoom } from '../api/game';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  const [rooms, setRooms] = useState<any[]>([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const res = await getRooms();
    setRooms(res.data);
  };

  const handleCreate = async () => {
    const res = await createRoom(user.id);
    navigate(`/game/${res.data.insertId}`);
  };

  const handleJoin = async (roomId: number) => {
    const res = await joinRoom(user.id, roomId);
    if (res.data.status === 'ok') {
      navigate(`/game/${roomId}`);
    }
  };

  return (
    <div>
      <button onClick={handleCreate}>Create Room</button>

      {rooms.map(room => (
        <div key={room.id}>
          Room {room.id}
          <button onClick={() => handleJoin(room.id)}>Join</button>
        </div>
      ))}
    </div>
  );
}