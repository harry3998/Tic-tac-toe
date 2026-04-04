// import styles from "./Game.module.css";
// import { useParams } from "react-router-dom";
// import { useGame } from "../../../hooks/useGame";
// import { useSocket } from "../../../hooks/useSocket";
// import { emitEvent } from "../../../socket/socket";
// import { useEffect, useState } from "react";
// import { getRoomCreator } from "../../../apis/game.service";
// import { getLocalStorage } from "../../../utils/localStorage";
// import { PLAYER_CLICK } from "../../../utils/define";

// const Game = () => {
//   const { roomId } = useParams();
//   const [creator, setCreator] = useState<number>(0);
//   const { board, setBoard, isFirstPlayer, winner, clickBoard } = useGame();
  
//   // const userId: any = localStorage.getItem('userId');
//   const userId: number = getLocalStorage().userId;

//   const handleClick = (index: number) => {
//     if(creator == userId) {
//         if(!isFirstPlayer) return;
//     }
//     else {
//         if(isFirstPlayer) return;
//     }
//     clickBoard(index, isFirstPlayer ? "X" : "O");
//     emitEvent("make_move", { roomId, index });
//   };

//   useSocket(PLAYER_CLICK, (data) => {
//     setBoard((prev: any) => {
//       const newBoard = [...prev];
//       newBoard[data.index] = data.player;
//       return newBoard;
//     });
//   });

//   useEffect(() => {
//     const creatorId = getRoomCreator(roomId);
//     setCreator(creatorId);
//   }, [])

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h2 className={styles.title}>Tic Tac Toe</h2>

//         <div className={styles.status}>
//           {winner ? `Winner: ${winner}` : `Next: ${isFirstPlayer ? "X" : "O"}`}
//         </div>

//         <div className={styles.board}>
//           {board.map((_, i) => (
//             <button key={i} onClick={() => handleClick(i)}>
//               {board[i]}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Game;
/////////////////////////////////////////////////////////////////////////////
// Game.tsx
// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { emitEvent } from "../../../socket/socket"; 
// import { useSocket } from "../../../hooks/useSocket"; 
// import { useGame } from "../../../hooks/useGame";

// const Game = () => {
//   const { roomId } = useParams();
//   const { board, setBoard, turn, setTurn } = useGame();

//   useEffect(() => {
//     emitEvent("join_room", { roomId });
//   }, [roomId]);

//   useSocket("move_made", (game) => {
//     setBoard(game.board);
//     setTurn(game.turn);
//   });

//   const handleClick = (i: number) => {
//     emitEvent("make_move", {
//       roomId,
//       index: i,
//       player: turn
//     });
//   };

//   return (
//     <div>
//       <h2>Turn: {turn}</h2>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,100px)' }}>
//         {board.map((val, i) => (
//           <button key={i} onClick={() => handleClick(i)} style={{height:100}}>
//             {val}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Game;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { emitEvent } from "../../../socket/socket"; 
import { useSocket } from "../../../hooks/useSocket";

const Game = () => {
  const { roomId } = useParams();

  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState<string | null>(null);

  // Join room
  useEffect(() => {
    emitEvent("join_room", { roomId });
  }, [roomId]);

  // Listen for updates
  useSocket("move_made", (game: any) => {
    setBoard(game.board);
    setTurn(game.turn);
    setWinner(game.winner);
  });

  const handleClick = (index: number) => {
    if (winner) return;

    emitEvent("make_move", {
      roomId,
      index,
      player: turn
    });
  };

  return (
    <div>
      <h2>Tic Tac Toe</h2>

      <h3>
        {winner ? `Winner: ${winner}` : `Turn: ${turn}`}
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 100px)"
      }}>
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{ height: 100, fontSize: 24 }}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Game;