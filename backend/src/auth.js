const jwt = require('jsonwebtoken');

const secret = () => process.env.JWT_SECRET || 'dev-secret';
const sign = (payload) => jwt.sign(payload, secret(), { expiresIn: '8h' });

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, secret());
    next();
  } catch {
    res.status(401).json({ error: 'Chưa đăng nhập hoặc phiên hết hạn' });
  }
}

module.exports = { sign, requireAdmin };
