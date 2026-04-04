const express = require('express');
const { createRoom, getRooms, joinRoom, getOneRoom } = require('../controllers/gameController.js');
const router = express.Router();
const authMiddleware = require('../middleware/auth.js');

router.post('/create', authMiddleware, createRoom);
router.get('/rooms', getRooms);
router.post('/join', authMiddleware, joinRoom);
router.post('/room', getOneRoom);

module.exports = router;