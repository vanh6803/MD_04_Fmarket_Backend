var express = require('express');
var router = express.Router();

var productsController = require('../controllers/products.controller');

router.get('/', (req, res, next) => {
    res.send("hehe");
});

module.exports = router;