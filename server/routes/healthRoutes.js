const express = require('express');
const router = express.Router();

// 健康检查路由
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '后端服务正常运行',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 