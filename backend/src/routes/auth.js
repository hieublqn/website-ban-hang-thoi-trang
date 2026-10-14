const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { sign, requireAdmin } = require('../auth');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query('SELECT * FROM TaiKhoan WHERE TenDangNhap = ?', [username]);
  if (!rows.length || !bcrypt.compareSync(password || '', rows[0].MatKhau)) {
    return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
  }
  res.json({ token: sign({ id: rows[0].MaTK, role: rows[0].VaiTro }), username });
});

// Đổi mật khẩu của tài khoản đang đăng nhập (phải nhập đúng mật khẩu cũ).
// Lỗi nhập sai trả 400 (không phải 401) để giao diện không tưởng là hết phiên đăng nhập.
router.put('/password', requireAdmin, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (typeof oldPassword !== 'string' || typeof newPassword !== 'string' || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Vui lòng nhập mật khẩu cũ và mật khẩu mới' });
  }
  if (newPassword.length < 8) return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 8 ký tự' });
  if (newPassword.length > 72) return res.status(400).json({ error: 'Mật khẩu mới tối đa 72 ký tự' }); // giới hạn của bcrypt

  const [rows] = await db.query('SELECT MatKhau FROM TaiKhoan WHERE MaTK = ?', [req.user.id]);
  if (!rows.length || !bcrypt.compareSync(oldPassword, rows[0].MatKhau)) {
    return res.status(400).json({ error: 'Mật khẩu cũ không đúng' });
  }
  await db.query('UPDATE TaiKhoan SET MatKhau = ? WHERE MaTK = ?', [bcrypt.hashSync(newPassword, 10), req.user.id]);
  res.json({ ok: true });
});

module.exports = router;
