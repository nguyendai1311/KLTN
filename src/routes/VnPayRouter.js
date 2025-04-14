const express = require("express");
const router = express.Router()
const vnPayController = require('../services/vnpay.service');

router.post('/create_payment_url', vnPayController.createVNPayUrl); 


module.exports = router


