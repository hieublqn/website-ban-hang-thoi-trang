# Phân tích & thiết kế — Website bán hàng thời trang

## 1. Tác nhân và chức năng

| Tác nhân | Chức năng |
|---|---|
| Khách (không cần đăng nhập) | Xem trang chủ; xem/tìm/lọc sản phẩm; xem chi tiết; quản lý giỏ hàng; đặt hàng (COD hoặc QR); gửi liên hệ |
| Quản trị viên | Đăng nhập; CRUD sản phẩm, danh mục; xem/sửa/xóa khách hàng; xem chi tiết đơn, đổi trạng thái đơn, xác nhận thanh toán, xóa đơn; xem/đánh dấu/xóa liên hệ |

## 2. Use Case Diagram

```mermaid
flowchart LR
  K([Khách]) --- UC1(Xem trang chủ)
  K --- UC2(Xem / tìm / lọc sản phẩm)
  K --- UC3(Xem chi tiết sản phẩm)
  K --- UC4(Quản lý giỏ hàng)
  K --- UC5(Đặt hàng)
  UC5 -.include.-> UC6(Thanh toán COD)
  UC5 -.include.-> UC7(Thanh toán quét QR VietQR)
  K --- UC8(Gửi liên hệ)

  A([Quản trị viên]) --- UA0(Đăng nhập)
  A --- UA1(CRUD sản phẩm)
  A --- UA2(CRUD danh mục)
  A --- UA3(Quản lý khách hàng)
  A --- UA4(Quản lý đơn hàng)
  UA4 -.include.-> UA5(Xác nhận thanh toán)
  A --- UA6(Xử lý liên hệ)
```

## 3. ERD

```mermaid
erDiagram
  DanhMuc ||--o{ SanPham : "chứa"
  KhachHang ||--o{ HoaDon : "đặt"
  HoaDon ||--|{ ChiTietHoaDon : "gồm"
  SanPham ||--o{ ChiTietHoaDon : "được bán trong"

  DanhMuc { int MaDM PK  string TenDM  string MoTa }
  SanPham { int MaSP PK  int MaDM FK  string TenSP  text MoTa  decimal Gia  int SoLuongTon  string HinhAnh  datetime NgayTao }
  KhachHang { int MaKH PK  string HoTen  string Email  string SoDienThoai  string DiaChi }
  HoaDon { int MaHD PK  int MaKH FK  datetime NgayLap  decimal TongTien  enum PhuongThucThanhToan  string MaThanhToan  enum TrangThaiThanhToan  enum TrangThaiDon  string GhiChu }
  ChiTietHoaDon { int MaCT PK  int MaHD FK  int MaSP FK  int SoLuong  decimal DonGia }
  TaiKhoan { int MaTK PK  string TenDangNhap  string MatKhau  enum VaiTro }
  LienHe { int MaLH PK  string HoTen  string Email  text NoiDung  datetime NgayGui  bool DaXuLy }
```

`TaiKhoan` (tài khoản admin) và `LienHe` là hai bảng độc lập, không có khóa ngoại.

## 4. Luồng thanh toán QR

1. Khách chọn "Chuyển khoản quét mã QR" và đặt hàng.
2. Server tạo hóa đơn, gán `MaThanhToan = DH<MaHD>`, trả về link ảnh VietQR
   `img.vietqr.io/image/<BANK>-<STK>-compact2.png?amount=...&addInfo=DH<MaHD>`.
3. Khách quét bằng app ngân hàng, giữ nguyên nội dung chuyển khoản.
4. **Mức 1:** quản trị viên kiểm tra tiền về và bấm "Xác nhận đã thanh toán" ở trang Đơn hàng.
5. **Mức 2 (tùy chọn):** SePay/Casso gọi `POST /api/payment/sepay-webhook`; server tìm mã `DH<số>` trong nội dung,
   so số tiền với `TongTien`, nếu đủ thì chuyển `TrangThaiThanhToan` sang `da_thanh_toan`.
   Trang của khách hỏi `GET /api/orders/:id/status` mỗi 5 giây và tự hiện "Đã nhận thanh toán".

## 5. Danh sách API

| Method | Đường dẫn | Quyền |
|---|---|---|
| POST | /api/auth/login | công khai |
| GET | /api/categories, /api/products, /api/products/:id | công khai |
| POST/PUT/DELETE | /api/categories, /api/products | admin |
| POST | /api/orders, /api/contacts | công khai |
| GET | /api/orders/:id/status | công khai |
| GET/PUT/DELETE | /api/orders, /api/customers, /api/contacts | admin |
| POST | /api/payment/sepay-webhook | SePay (Apikey) |
