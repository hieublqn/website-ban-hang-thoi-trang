const router = require('express').Router();
const db = require('../db');
const { requireAdmin } = require('../auth');

// Danh sách sắp xếp cho phép - dùng whitelist, không nối trực tiếp query của client vào SQL
const SORTS = { gia_tang: 'sp.Gia ASC', gia_giam: 'sp.Gia DESC', moi_nhat: 'sp.MaSP DESC' };

// GET /api/products?category=1&q=áo&sort=gia_tang&minPrice=100000&maxPrice=300000
router.get('/', async (req, res) => {
  const { category, q, sort, minPrice, maxPrice } = req.query;
  const where = [];
  const params = [];
  if (category) { where.push('sp.MaDM = ?'); params.push(category); }
  if (q) { where.push('sp.TenSP LIKE ?'); params.push(`%${q}%`); }
  if (minPrice) { where.push('sp.Gia >= ?'); params.push(minPrice); }
  if (maxPrice) { where.push('sp.Gia <= ?'); params.push(maxPrice); }
  const [rows] = await db.query(
    `SELECT sp.*, dm.TenDM FROM SanPham sp JOIN DanhMuc dm ON dm.MaDM = sp.MaDM
     ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ${SORTS[sort] || SORTS.moi_nhat}`, params);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await db.query(
    'SELECT sp.*, dm.TenDM FROM SanPham sp JOIN DanhMuc dm ON dm.MaDM = sp.MaDM WHERE MaSP = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  res.json(rows[0]);
});

function validate(b) {
  if (!b.TenSP || !b.MaDM) return 'Thiếu tên sản phẩm hoặc danh mục';
  if (!(Number(b.Gia) >= 0)) return 'Giá không hợp lệ';
  if (!(Number(b.SoLuongTon) >= 0)) return 'Số lượng tồn không hợp lệ';
  return null;
}

router.post('/', requireAdmin, async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const b = req.body;
  const [r] = await db.query(
    'INSERT INTO SanPham (MaDM, TenSP, MoTa, Gia, SoLuongTon, HinhAnh) VALUES (?,?,?,?,?,?)',
    [b.MaDM, b.TenSP, b.MoTa || null, b.Gia, b.SoLuongTon, b.HinhAnh || null]);
  res.status(201).json({ MaSP: r.insertId });
});

router.put('/:id', requireAdmin, async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const b = req.body;
  await db.query(
    'UPDATE SanPham SET MaDM=?, TenSP=?, MoTa=?, Gia=?, SoLuongTon=?, HinhAnh=? WHERE MaSP=?',
    [b.MaDM, b.TenSP, b.MoTa || null, b.Gia, b.SoLuongTon, b.HinhAnh || null, req.params.id]);
  res.json({ ok: true });
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM SanPham WHERE MaSP = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ error: 'Sản phẩm đã có trong hóa đơn, không thể xóa' });
    throw e;
  }
});

module.exports = router;
