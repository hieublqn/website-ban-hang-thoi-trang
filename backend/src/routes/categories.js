const router = require('express').Router();
const db = require('../db');
const { requireAdmin } = require('../auth');

router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM DanhMuc ORDER BY MaDM');
  res.json(rows);
});

router.post('/', requireAdmin, async (req, res) => {
  const { TenDM, MoTa } = req.body;
  if (!TenDM) return res.status(400).json({ error: 'Thiếu tên danh mục' });
  const [r] = await db.query('INSERT INTO DanhMuc (TenDM, MoTa) VALUES (?, ?)', [TenDM, MoTa || null]);
  res.status(201).json({ MaDM: r.insertId });
});

router.put('/:id', requireAdmin, async (req, res) => {
  const { TenDM, MoTa } = req.body;
  if (!TenDM) return res.status(400).json({ error: 'Thiếu tên danh mục' });
  await db.query('UPDATE DanhMuc SET TenDM = ?, MoTa = ? WHERE MaDM = ?', [TenDM, MoTa || null, req.params.id]);
  res.json({ ok: true });
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM DanhMuc WHERE MaDM = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ error: 'Danh mục còn sản phẩm, không thể xóa' });
    throw e;
  }
});

module.exports = router;
