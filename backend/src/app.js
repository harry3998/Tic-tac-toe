const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const authRouter = require('./routes/auth.js');
const gameRouter = require('./routes/game.js');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST']
}));
app.use(express.json());
app.use('/auth', authRouter);
app.use('/game', gameRouter)

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST']
  },
});

const games = {};

const checkWinner = (board) => {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let [a, b, c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (!board.includes(null)) return 'draw';

  return null;
}

io.on('connection', (socket) => {
  socket.on('join_room', ({ roomId, userId }) => {
    socket.join(roomId);
    if (!games[roomId]) {
      games[roomId] = {
        board: Array(9).fill(null),
        turn: 'X',
        players: {
          X: null,
          O: null
        }
      };
    }

    const game = games[roomId];
    if (!game.players.X) {
      game.players.X = userId;
    } else if (!game.players.O) {
      game.players.O = userId;
    }
  });

  socket.on('make_move', ({ roomId, index, userId }) => {
    const game = games[roomId];
    if (!game) return;

    const player = game.players.X === userId ? 'X' :
      game.players.O === userId ? 'O' : null;

    if (!player) return;
    if (game.turn !== player) return;
    if (game.board[index] !== null) return;

    game.board[index] = player;
    game.turn = player === 'X' ? 'O' : 'X';

    const result = checkWinner(game.board);

    io.to(roomId).emit('move_made', { ...game, result });
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});