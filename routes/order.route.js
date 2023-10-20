var express = require('express');
var router = express.Router();
var orderController = require('../controllers/order.controller');

router.post('/create', orderController.create);

module.exports = router;