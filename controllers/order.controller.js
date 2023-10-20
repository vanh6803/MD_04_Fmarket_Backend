let md = require('../models/Orders');

const create = async (req, res, next) => {
    try {
        let {
            user_id,
            address,
            phone_number,
            total_price,
            status
        } = req.body;

        let objOrder = new md.order({
            user_id,
            address,
            phone_number,
            total_price,
            status
        });

        // save data
        let obj = await objOrder.save();

        res.status(200).json({
            code: 200,
            message: 'Added data successfully!',
            data: [obj] // trả về object để app lấy đc ra id rồi thêm vào orderDetail
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