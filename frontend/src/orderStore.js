// Lưu tạm (MaHD, SĐT) của các đơn vừa đặt trên máy này, để nếu khách thoát trang QR
// giữa lúc thanh toán thì mở lại link đơn vẫn tự tra cứu được, không cần gõ lại SĐT.
// Chỉ lưu SĐT + mã đơn (không lưu tên/địa chỉ), và chỉ dùng để tự động điền lại trên CHÍNH máy này.
const KEY = 'recentOrders';

export function getRecentOrders() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}

export function saveRecentOrder({ MaHD, SoDienThoai }) {
  try {
    const list = getRecentOrders().filter((o) => String(o.MaHD) !== String(MaHD));
    localStorage.setItem(KEY, JSON.stringify([{ MaHD, SoDienThoai }, ...list].slice(0, 5)));
  } catch { /* trình duyệt chặn localStorage (chế độ ẩn danh...) thì bỏ qua, không ảnh hưởng chức năng chính */ }
}

export function findRecentOrder(id) {
  return getRecentOrders().find((o) => String(o.MaHD) === String(id));
}
