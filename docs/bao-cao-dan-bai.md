# Dàn ý báo cáo (3 chương theo đề HUBT)

Hạn nộp: 20/10/2026, 18:00. Điền vào template Google Docs của trường; ảnh chụp lấy khi chạy web.

## Chương 1. Tổng quan lập trình website
- 1.1 Website thương mại điện tử là gì; mô hình client–server, REST API
- 1.2 Công nghệ: React + Vite (giao diện), Node.js + Express (API), MySQL (CSDL), JWT (đăng nhập admin), VietQR (thanh toán)
- 1.3 Công cụ: VS Code, XAMPP/phpMyAdmin, Git/GitHub

## Chương 2. Phân tích & thiết kế website
- 2.1 Khảo sát, mục tiêu, phạm vi → dùng mục 1 của `phan-tich-thiet-ke.md`
- 2.2 Use Case Diagram (mục 2)
- 2.3 Thiết kế CSDL: ERD (mục 3), mô tả từng bảng (lấy từ `schema.sql`), các khóa ngoại
- 2.4 Thiết kế API (mục 5) và luồng thanh toán QR (mục 4)
- 2.5 Thiết kế giao diện: sơ đồ site (Trang chủ, Sản phẩm, Chi tiết, Giỏ hàng, Đặt hàng, Liên hệ, Quản trị)

## Chương 3. Phần mềm thử nghiệm
- 3.1 Hướng dẫn cài đặt & chạy (README)
- 3.2 Ảnh chụp từng trang: trang chủ, danh sách/lọc, chi tiết, giỏ hàng, đặt hàng, trang QR, liên hệ, đăng nhập admin, CRUD sản phẩm/danh mục, đơn hàng
- 3.3 Bảng kiểm thử:

| # | Chức năng | Thao tác | Kết quả mong đợi |
|---|---|---|---|
| 1 | Thêm sản phẩm | Admin nhập đủ thông tin, Lưu | Sản phẩm xuất hiện ở danh sách và trang khách |
| 2 | Sửa / xóa sản phẩm | Sửa giá; xóa sản phẩm chưa có đơn | Cập nhật đúng; xóa thành công |
| 3 | Xóa sản phẩm đã có đơn | Xóa "Áo thun basic trắng" | Báo lỗi, không xóa (ràng buộc khóa ngoại) |
| 4 | Đặt hàng COD | Thêm giỏ, điền thông tin, Đặt hàng | Tạo đơn, trừ tồn kho |
| 5 | Đặt hàng vượt tồn kho | Đặt số lượng > tồn | Báo lỗi, không tạo đơn |
| 6 | Đặt hàng QR | Chọn QR | Hiện mã QR đúng số tiền, nội dung DH<mã> |
| 7 | Xác nhận thanh toán | Admin bấm xác nhận | Trạng thái "Đã thanh toán"; trang khách tự cập nhật |
| 8 | Gửi liên hệ | Điền form | Xuất hiện ở trang admin Liên hệ |
| 9 | Truy cập admin khi chưa đăng nhập | Vào /admin | Chuyển về trang đăng nhập |

- 3.4 Kết luận, hạn chế, hướng phát triển (tài khoản khách hàng, tự động xác nhận QR, deploy)
