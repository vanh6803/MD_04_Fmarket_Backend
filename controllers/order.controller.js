let mdOrder = require('../models/Orders');
let mdOrderDetail = require('../models/OrderDetail');


const list = async (req, res, next) => {
    try {
        let isCheck = null;
        // Lọc theo user_id
        let idUserSearch = req.query.user_id;
        console.log(idUserSearch);
        if(typeof(idUserSearch) != 'undefined') {
            isCheck = {user_id: idUserSearch}
            console.log(isCheck);
        }

        let listOrder = await mdOrder.order.find(isCheck);
        let clonedOrder = JSON.parse(JSON.stringify(listOrder)); // Nhân bản list order mới có thể thay đổi dữ liệu

        


        for (let index = 0; index < clonedOrder.length; index++) {
            const order = clonedOrder[index];
            let listOrderDetail = await mdOrderDetail.orderDetail
                .find({ order_id: order._id })
                .populate("product_id");

            order.dataOrderDetail = listOrderDetail;
        }


        if (listOrder.length > 0) {
            res.status(200).json({
                status: 200,
                message: 'Get data successfully!',
                data: clonedOrder
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No data!'
            });
        }
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
}

const create = async (req, res, next) => {
    try {
        let {
            user_id,
            address,
            phone_number,
            total_price,
            status
        } = req.body;

        let objOrder = new mdOrder.order({
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
    list
}