let md = require('../models/OrderDetail');

const create = async (req, res, next) => {
    try {
        let {
            order_id,
            product_id,
            unit_price,
            amount,
        } = req.body;

        let objOrderDetail = new md.orderDetail({
            order_id,
            product_id,
            unit_price,
            amount,
        });

        // save data
        let obj = await objOrderDetail.save();

        res.status(200).json({
            code: 200,
            message: 'Added data successfully!',
        });

    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
}

module.exports = {
    create,
}