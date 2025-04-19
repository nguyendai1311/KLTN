const express = require('express');
const router = express.Router();
const vnpay = require('../services/vnpay.service'); // nơi chứa VNPay config và hàm verify

router.get('/vnpay-return', (req, res) => {
  let verifyResult;
  try {
    // Xác thực URL trả về bằng thư viện VNPay
    verifyResult = vnpay.verifyReturnUrl(req.query);

    if (!verifyResult.isVerified) {
      return res.send('❌ Xác thực chữ ký thất bại. Dữ liệu có thể đã bị thay đổi!');
    }

    if (!verifyResult.isSuccess) {
      return res.send('❌ Thanh toán thất bại. Vui lòng thử lại.');
    }

    // Nếu cần redirect đến frontend sau khi thanh toán:
    // return res.redirect(`http://localhost:3000/thanh-toan-thanh-cong?orderId=${req.query.vnp_TxnRef}`);

    // Nếu chỉ hiển thị trực tiếp trên trang backend:
    return res.send('✅ Thanh toán thành công. Cảm ơn bạn đã mua hàng!');
  } catch (error) {
    console.error('Lỗi khi xác thực VNPay:', error);
    return res.status(400).send('❌ Dữ liệu không hợp lệ hoặc thiếu tham số.');
  }
});

module.exports = router;
