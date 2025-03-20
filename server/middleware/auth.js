const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: '令牌无效' });
    }
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '需要管理员权限' });
  }

  next();
};

module.exports = {
  authenticateToken,
  isAdmin
}; 