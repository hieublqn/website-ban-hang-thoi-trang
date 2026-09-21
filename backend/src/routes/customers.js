const router = require('express').Router();
const db = require('../db');
const { requireAdmin } = require('../auth');

router.use(requireAdmin);

router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM KhachHang ORDER BY MaKH DESC');
  res.json(rows);
});

router.put('/:id', async (req, res) => {
  const { HoTen, Email, SoDienThoai, DiaChi } = req.body;
  if (!HoTen || !SoDienThoai || !DiaChi) return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  await db.query('UPDATE KhachHang SET HoTen=?, Email=?, SoDienThoai=?, DiaChi=? WHERE MaKH=?',
    [HoTen, Email || null, SoDienThoai, DiaChi, req.params.id]);
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM KhachHang WHERE MaKH = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ error: 'Khách hàng đã có hóa đơn, không thể xóa' });
    throw e;
  }
});

module.exports = router;
