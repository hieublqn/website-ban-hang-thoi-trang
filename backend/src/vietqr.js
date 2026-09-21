// Dựng link ảnh QR VietQR (miễn phí, không cần đăng ký)
function qrUrl(amount, addInfo) {
  const { BANK_ID, BANK_ACCOUNT_NO, BANK_ACCOUNT_NAME } = process.env;
  const q = new URLSearchParams({ amount: String(amount), addInfo, accountName: BANK_ACCOUNT_NAME || '' });
  return `https://img.vietqr.io/image/${BANK_ID}-${BANK_ACCOUNT_NO}-compact2.png?${q}`;
}

module.exports = { qrUrl };
