const { ProductCode, VnpLocale, dateFormat, VNPay, ignoreLogger } = require('vnpay');

const vnpay = new VNPay({
  tmnCode: '3BM0ZW0H',
  secureSecret: 'LXI478RGLEFXGASLXK8E5YXLK2W3HD4X',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
  enableLog: true,
  loggerFn: ignoreLogger,
  endpoints: {
    paymentEndpoint: 'paymentv2/vpcpay.html',
    queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
    getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
  },
});

const createPaymentUrl = (req, res) => {
  try {
    const {
      amount,
      txnRef,
      orderInfo,
      bankCode = '',
      language = 'vn',
      redirectUrl = 'http://localhost:3000/order-success',
      email = '',
    } = req.body;

    // Validate thông tin đầu vào
    if (!amount || !orderInfo) {
      return res.status(400).json({ error: 'Thông tin thanh toán không đầy đủ' });
    }

    // Tạo mã giao dịch nếu chưa có
    const generatedTxnRef = txnRef || `ORD${Date.now()}`;

    // Ngày hết hạn (1 ngày sau)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const url = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: req.ip,
      vnp_TxnRef: generatedTxnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: redirectUrl,
      vnp_Locale: language === 'en' ? VnpLocale.EN : VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
      vnp_BankCode: bankCode || undefined, // không gửi nếu trống
      vnp_Email: email || undefined, // thêm nếu bạn custom lại SDK để hỗ trợ
    });

    return res.json({ paymentUrl: url });
  } catch (err) {
    console.error('Lỗi khi tạo URL thanh toán:', err);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo URL thanh toán' });
  }
};

module.exports = {
  createPaymentUrl,
};
