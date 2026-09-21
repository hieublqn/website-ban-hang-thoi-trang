-- Website bán hàng thời trang - CSDL MySQL
-- Chạy trong phpMyAdmin (tab Import) hoặc: mysql -u root < schema.sql
DROP DATABASE IF EXISTS ban_hang_thoi_trang;
CREATE DATABASE ban_hang_thoi_trang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ban_hang_thoi_trang;

CREATE TABLE DanhMuc (
  MaDM INT AUTO_INCREMENT PRIMARY KEY,
  TenDM VARCHAR(100) NOT NULL,
  MoTa VARCHAR(255)
);

CREATE TABLE SanPham (
  MaSP INT AUTO_INCREMENT PRIMARY KEY,
  MaDM INT NOT NULL,
  TenSP VARCHAR(150) NOT NULL,
  MoTa TEXT,
  Gia DECIMAL(12,0) NOT NULL CHECK (Gia >= 0),
  SoLuongTon INT NOT NULL DEFAULT 0 CHECK (SoLuongTon >= 0),
  HinhAnh VARCHAR(500),
  NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sp_dm FOREIGN KEY (MaDM) REFERENCES DanhMuc(MaDM)
);

CREATE TABLE KhachHang (
  MaKH INT AUTO_INCREMENT PRIMARY KEY,
  HoTen VARCHAR(100) NOT NULL,
  Email VARCHAR(100),
  SoDienThoai VARCHAR(20) NOT NULL,
  DiaChi VARCHAR(255) NOT NULL
);

CREATE TABLE TaiKhoan (
  MaTK INT AUTO_INCREMENT PRIMARY KEY,
  TenDangNhap VARCHAR(50) NOT NULL UNIQUE,
  MatKhau VARCHAR(100) NOT NULL,
  VaiTro ENUM('admin') NOT NULL DEFAULT 'admin'
);

CREATE TABLE HoaDon (
  MaHD INT AUTO_INCREMENT PRIMARY KEY,
  MaKH INT NOT NULL,
  NgayLap DATETIME DEFAULT CURRENT_TIMESTAMP,
  TongTien DECIMAL(14,0) NOT NULL,
  PhuongThucThanhToan ENUM('COD','QR') NOT NULL DEFAULT 'COD',
  MaThanhToan VARCHAR(30),                      -- nội dung chuyển khoản, vd DH12
  TrangThaiThanhToan ENUM('chua_thanh_toan','da_thanh_toan') NOT NULL DEFAULT 'chua_thanh_toan',
  TrangThaiDon ENUM('moi','dang_giao','hoan_thanh','huy') NOT NULL DEFAULT 'moi',
  GhiChu VARCHAR(255),
  CONSTRAINT fk_hd_kh FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH)
);

CREATE TABLE ChiTietHoaDon (
  MaCT INT AUTO_INCREMENT PRIMARY KEY,
  MaHD INT NOT NULL,
  MaSP INT NOT NULL,
  SoLuong INT NOT NULL CHECK (SoLuong > 0),
  DonGia DECIMAL(12,0) NOT NULL,
  CONSTRAINT fk_ct_hd FOREIGN KEY (MaHD) REFERENCES HoaDon(MaHD) ON DELETE CASCADE,
  CONSTRAINT fk_ct_sp FOREIGN KEY (MaSP) REFERENCES SanPham(MaSP)
);

CREATE TABLE LienHe (
  MaLH INT AUTO_INCREMENT PRIMARY KEY,
  HoTen VARCHAR(100) NOT NULL,
  Email VARCHAR(100) NOT NULL,
  NoiDung TEXT NOT NULL,
  NgayGui DATETIME DEFAULT CURRENT_TIMESTAMP,
  DaXuLy TINYINT(1) NOT NULL DEFAULT 0
);

-- ===== Dữ liệu mẫu =====
-- Tài khoản admin: admin / admin123
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES
('admin', '$2b$10$wjFyl2r66fOJaHRz53Rj2OxcTxHzRF/TC8Sy/7Q.qfR4Z04u3XaKC', 'admin');

INSERT INTO DanhMuc (TenDM, MoTa) VALUES
('Áo', 'Áo thun, áo sơ mi, áo khoác'),
('Quần', 'Quần jean, quần kaki, quần short'),
('Váy đầm', 'Váy và đầm nữ'),
('Phụ kiện', 'Mũ, túi, thắt lưng');

INSERT INTO SanPham (MaDM, TenSP, MoTa, Gia, SoLuongTon, HinhAnh) VALUES
(1, 'Áo thun basic trắng', 'Áo thun cotton 100%, form regular, thoáng mát.', 149000, 50, 'https://picsum.photos/seed/aothun/400/500'),
(1, 'Áo sơ mi oxford xanh', 'Sơ mi oxford dài tay lịch sự, phù hợp đi làm.', 299000, 30, 'https://picsum.photos/seed/somi/400/500'),
(1, 'Áo khoác bomber đen', 'Áo khoác bomber chống gió nhẹ.', 459000, 20, 'https://picsum.photos/seed/bomber/400/500'),
(2, 'Quần jean slim fit', 'Jean co giãn nhẹ, ôm vừa vặn.', 399000, 40, 'https://picsum.photos/seed/jean/400/500'),
(2, 'Quần kaki be', 'Kaki mềm, dễ phối đồ.', 329000, 35, 'https://picsum.photos/seed/kaki/400/500'),
(2, 'Quần short thể thao', 'Short thun lạnh, nhanh khô.', 179000, 60, 'https://picsum.photos/seed/short/400/500'),
(3, 'Đầm suông hoa nhí', 'Đầm suông nhẹ nhàng, chất voan.', 349000, 25, 'https://picsum.photos/seed/dam/400/500'),
(3, 'Chân váy chữ A', 'Chân váy chữ A lưng cao.', 249000, 30, 'https://picsum.photos/seed/chanvay/400/500'),
(4, 'Mũ lưỡi trai', 'Mũ cotton thêu logo.', 99000, 80, 'https://picsum.photos/seed/mu/400/500'),
(4, 'Túi tote canvas', 'Túi vải canvas đựng vừa laptop 14 inch.', 129000, 45, 'https://picsum.photos/seed/tote/400/500');

INSERT INTO KhachHang (HoTen, Email, SoDienThoai, DiaChi) VALUES
('Nguyễn Văn An', 'an@example.com', '0900000001', '12 Nguyễn Trãi, Hà Nội'),
('Trần Thị Bình', 'binh@example.com', '0900000002', '45 Lê Lợi, Đà Nẵng');

INSERT INTO HoaDon (MaKH, TongTien, PhuongThucThanhToan, MaThanhToan, TrangThaiThanhToan, TrangThaiDon) VALUES
(1, 397000, 'QR', 'DH1', 'da_thanh_toan', 'hoan_thanh'),
(2, 399000, 'COD', NULL, 'chua_thanh_toan', 'moi');

INSERT INTO ChiTietHoaDon (MaHD, MaSP, SoLuong, DonGia) VALUES
(1, 1, 2, 149000), (1, 9, 1, 99000),
(2, 4, 1, 399000);

INSERT INTO LienHe (HoTen, Email, NoiDung) VALUES
('Lê Minh', 'minh@example.com', 'Shop có ship COD toàn quốc không ạ?');
