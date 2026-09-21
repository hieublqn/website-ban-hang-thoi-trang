const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { sign } = require('../auth');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query('SELECT * FROM TaiKhoan WHERE TenDangNhap = ?', [username]);
  if (!rows.length || !bcrypt.compareSync(password || '', rows[0].MatKhau)) {
    return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
  }
  res.json({ token: sign({ id: rows[0].MaTK, role: rows[0].VaiTro }), username });
});

module.exports = router;
