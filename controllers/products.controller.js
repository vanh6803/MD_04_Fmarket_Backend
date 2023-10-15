let md = require('../models/Products');

exports.list = async (req, res, next) => {
    try {
        let listProduct = await md.product.find().populate("category_id");
        if(listProduct) {
            res.status(200).json({
                status: 200,
                msg: 'Lấy dữ liệu thành công!',
                result: listProduct
            });
        } else {
            res.status(204).json({
                status: 204,
                msg: 'Lấy data thất bại'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: 'Lỗi!'
        });
    }
}

exports.add = async (req, res, next) => {
    try {
        let {name} = req.body;
        // let image = req.file.path;
        console.log(`name: ${name}, image: ${image}`);
        console.log(req.body);
        let objProduct = new md.product();
        objProduct.store_id = req.body.store_id;
        objProduct.category_id = req.body.category_id;
        objProduct.name = req.body.name;
        console.log(req.body.name);
        objProduct.image = req.body.image;
        objProduct.price = req.body.price;
        objProduct.quantity = req.body.quantity;
        objProduct.units_sold = req.body.units_sold;
        objProduct.discription = req.body.discription;
        objProduct.is_active = req.body.is_active;
        objProduct.status = req.body.status;
        await objProduct.save();

        res.status(200).json({
            status: 200,
            msg: 'Thêm dữ liệu thành công!',
            result: objProduct
        });

    } catch(error) {
        res.status(500).json({
            status: 500,
            msg: 'Lỗi!'
        });
    }
}