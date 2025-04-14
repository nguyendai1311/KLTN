const qs = require('qs');
const crypto = require('crypto');
const moment = require('moment');
const config = require('./../../config/default.json'); // ✅ Sửa dòng này

// ✅ Nếu bạn đang dùng CommonJS, dùng module.exports thay vì export
const createVNPayUrl = (req, res) => {
  const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const tmnCode = config.vnp_TmnCode;
  const secretKey = config.vnp_HashSecret;
  const vnpUrl = config.vnp_Url;
  const returnUrl = config.vnp_ReturnUrl;

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const orderId = moment(date).format('HHmmss');
  const amount = req.body.amount * 100;

  const bankCode = req.body.bankCode || '';

  let locale = req.body.language;
  if (!locale) locale = 'vn';

  const currCode = 'VND';
  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: 'Thanh toan don hang',
    vnp_OrderType: 'other',
    vnp_Amount: amount,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  // Bước 1: Sort lại object theo thứ tự chữ cái
  vnp_Params = sortObject(vnp_Params);

  // Bước 2: Tạo chuỗi query và hash
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;

  const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: true })}`;

  return res.json({ paymentUrl });
};

// Hàm sắp xếp object theo thứ tự chữ cái A-Z
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

// ✅ Export đúng kiểu CommonJS
module.exports = {
  createVNPayUrl
};
