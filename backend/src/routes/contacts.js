const router = require('express').Router();
const db = require('../db');
const { requireAdmin } = require('../auth');

// Khách gửi liên hệ (công khai)
router.post('/', async (req, res) => {
  const { HoTen, Email, NoiDung } = req.body;
  if (!HoTen || !Email || !NoiDung) return res.status(400).json({ error: 'Vui lòng điền đủ thông tin' });
  await db.query('INSERT INTO LienHe (HoTen, Email, NoiDung) VALUES (?,?,?)', [HoTen, Email, NoiDung]);
  res.status(201).json({ ok: true });
});

router.get('/', requireAdmin, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM LienHe ORDER BY MaLH DESC');
  res.json(rows);
});

router.put('/:id', requireAdmin, async (req, res) => {
  await db.query('UPDATE LienHe SET DaXuLy = ? WHERE MaLH = ?', [req.body.DaXuLy ? 1 : 0, req.params.id]);
  res.json({ ok: true });
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await db.query('DELETE FROM LienHe WHERE MaLH = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
