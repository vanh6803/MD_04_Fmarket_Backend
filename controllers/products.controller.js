let productsModel = require('../models/products.model');

exports.list = (req, res, next) => {
    res.send("Hiển thị loại sản phẩm");
}