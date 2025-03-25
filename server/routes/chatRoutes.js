const express = require('express');
const router = express.Router();
const { streamChat } = require('../controllers/chatController');

router.post('/stream', streamChat);

module.exports = router; 