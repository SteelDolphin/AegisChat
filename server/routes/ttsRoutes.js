const express = require('express');
const router = express.Router();
const ttsController = require('../controllers/ttsController');

// 流式 TTS 端点
router.post('/stream', ttsController.handleStreamTTS);

module.exports = router; 