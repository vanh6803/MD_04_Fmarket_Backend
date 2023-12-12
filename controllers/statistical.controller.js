const db = require("../config/ConnectDB");
const optionModel = require("../models/Option");
const orderModel = require("../models/Orders");

const calculateRevenueAllTime = async (req, res, next) => {
  try {
    // Extract store_id and month from the request
    const { store_id } = req.query;

    const revenueByMonth = await orderModel.order.aggregate([
      {
        $match: {
          "status": "Đã giao hàng",
        },
      },
      {
        $lookup: {
          from: "options",
          localField: "productsOrder.option_id",
          foreignField: "_id",
          as: "order_options",
        },
      },
      {
        $unwind: "$order_options",
      },
      {
        $lookup: {
          from: "products",
          localField: "order_options.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $match: {
          "product.store_id": new db.mongoose.Types.ObjectId(store_id),
        },
      },
      {
        $group: {
          _id: store_id,
          totalRevenue: { $sum: "$total_price" },
        },
      },
    ]);

    return res.status(200).json({
      code: 200,
      message: `Tất cả doanh thu của cửa hàng`,
      data: revenueByMonth,
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const calculateRevenueByMonth = async (req, res, next) => {
  try {
    // Extract store_id and month from the request
    const { store_id, month } = req.query;
    
    const revenueByMonth = await orderModel.order.aggregate([
      {
        $match: {
          "status": "Đã giao hàng",
          "createdAt": {
            $gte: new Date(`2023-${month}-01T00:00:00.000Z`),
            $lt: new Date(`2023-${month}-31T23:59:59.999Z`),
          }
        },
      },
      {
        $lookup: {
          from: "options",
          localField: "productsOrder.option_id",
          foreignField: "_id",
          as: "order_options",
        },
      },
      {
        $unwind: "$order_options",
      },
      {
        $lookup: {
          from: "products",
          localField: "order_options.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $match: {
          "product.store_id": new db.mongoose.Types.ObjectId(store_id),
        },
      },
      {
        $group: {
          _id: store_id,
          totalRevenue: { $sum: "$total_price" },
        },
      },
    ]);

    return res.status(200).json({
      code: 200,
      message: `Doanh thu của cửa hàng tháng ${month}`,
      data: revenueByMonth.length > 0 ? revenueByMonth : [{ _id: store_id, totalRevenue: 0 }],
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const calculateSoldQuantityByProductAndStore = async (req, res, next) => {
  try {
    const { store_id } = req.query;

    const soldQuantityByProductAndStore = await orderModel.order.aggregate([
      {
        $match: {
          "status": "Đã giao hàng",
        },
      },
      {
        $unwind: "$productsOrder",
      },
      {
        $lookup: {
          from: "options",
          localField: "productsOrder.option_id",
          foreignField: "_id",
          as: "order_options",
        },
      },
      {
        $unwind: "$order_options",
      },
      {
        $lookup: {
          from: "products",
          localField: "order_options.product_id",
          foreignField: "_id",
          as: "product_info",
        },
      },
      {
        $unwind: "$product_info",
      },
      {
        $match: {
          "product_info.store_id": new db.mongoose.Types.ObjectId(store_id),
        },
      },
      {
        $group: {
          _id: {
            product_id: "$product_info._id",
            store_id: "$product_info.store_id",
          },
          totalSoldQuantity: { $sum: "$productsOrder.quantity" },
          productDetails: { $first: "$product_info" },
        },
      },
      {
        $project: {
          _id: 0,
          product_id: "$_id.product_id",
          store_id: "$_id.store_id",
          totalSoldQuantity: "$totalSoldQuantity",
          productDetails: 1, // Include productDetails in the result
        },
      },
    ]).sort({totalSoldQuantity: -1});

    return res.status(200).json({
      code: 200,
      message: "Thống kê số lượng sản phẩm đã bán theo product_id và store_id",
      data: soldQuantityByProductAndStore,
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  calculateRevenueAllTime,
  calculateRevenueByMonth,
  calculateSoldQuantityByProductAndStore
};
