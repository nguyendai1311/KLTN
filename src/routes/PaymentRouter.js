const express = require('express');
const router = express.Router();
const vnpayService = require('../services/vnpay.service');


router.post('/create-payment-url', vnpayService.createPaymentUrl);


module.exports = router;
