var express = require('express');
var router = express.Router();
var orderDetailController = require('../controllers/orderDetail.controller');

router.post('/create', orderDetailController.create);


module.exports = router;