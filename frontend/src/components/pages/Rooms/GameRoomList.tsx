import { createRoom, getRooms } from "../../../apis/game.service";
import { Room } from "../../../types";
import { getLocalStorage } from "../../../utils/localStorage";
import styles from "./GameRoomList.module.css";
import { useNavigate } from "react-router-dom";

const GameRoomList = () => {
    const rooms: Room[] | null = getRooms();
    const userId = getLocalStorage().userId;
    const navigate = useNavigate();
    const handleCreate = async () => {
        const roomId = await createRoom(userId);
        navigate(`/game/${roomId}`);
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Game Rooms</h2>
            <button onClick={handleCreate} className={styles.createBtn}>+ create Room</button>
            <div className={styles.list}>
                {rooms != null ? Array.from(rooms).map((room: Room, idx) => (
                    <div key={idx} className={styles.roomCard}>
                        <span>RoomID: {room.id}</span>
                        <button 
                            className={styles.createBtn} 
                            onClick={handleCreate}
                        >
                            Join
                        </button>
                    </div>
                )) : null}
            </div>
        </div>
    );
};

export default GameRoomList;