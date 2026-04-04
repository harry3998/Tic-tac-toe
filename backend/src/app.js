const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const authRouter = require('./routes/auth.js');
const gameRouter = require('./routes/game.js');
const cors = require('cors');

const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST']
}));
app.use(express.json());
app.use('/auth', authRouter);
app.use('/game', gameRouter);

// //insert database
// pool.connect()
//   .then(() => {
//     console.log('database connected'); // you can create table in here by inserting query statement.
//   })

// Socket.IO setup

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST']
  },
});

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('join_room', (data) => {
//     socket.join(data.roomId);
//     console.log(`User ${socket.id} joined room: ${data.roomId}`);
//   });

//   socket.on('make_move', ({ roomId, index, player }) => {
//     // Broadcast the move to all clients in the room
//     socket.to(roomId).emit('move_made', { index, player });
//   });
  
//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// Start the server

const games = {};

io.on('connection', (socket) => {
  socket.on('join_room', ({ roomId }) => {
    socket.join(roomId);
    if (!games[roomId]) {
      games[roomId] = {
        board: Array(9).fill(null),
        turn: 'X'
      };
    }
  });

  socket.on('make_move', ({ roomId, index, player }) => {
    const game = games[roomId];
    if (!game) return;

    if (game.board[index] !== null) return;
    if (game.turn !== player) return;

    game.board[index] = player;
    game.turn = player === 'X' ? 'O' : 'X';

    io.to(roomId).emit('move_made', game);
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});