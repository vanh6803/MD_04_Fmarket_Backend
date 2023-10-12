var express = require('express');
var router = express.Router();

var productsController = require('../controllers/products.controller');

router.get('/', productsController.list);

module.exports = router;