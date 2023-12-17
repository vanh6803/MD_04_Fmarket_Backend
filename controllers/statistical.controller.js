const db = require("../config/ConnectDB");
const optionModel = require("../models/Option");
const orderModel = require("../models/Orders");

const calculateRevenueAllTime = async (req, res, next) => {
  try {
    // Extract store_id and month from the request
    const { store_id } = req.query;

    const revenue = await orderModel.order.aggregate([
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

    const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

    return res.status(200).json({
      code: 200,
      message: `Tất cả doanh thu của cửa hàng`,
      data: totalRevenue,
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const calculateRevenueByMonth = async (req, res, next) => {
  try {
    // Extract store_id and month from the request
    const { store_id, month } = req.query;
    const currentYear = new Date().getFullYear();//năm hiện tại
    const revenueByMonth = await orderModel.order.aggregate([
      {
        $match: {
          "status": "Đã giao hàng",
          "createdAt": {
            $gte: new Date(`${currentYear}-${month}-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear}-${month}-31T23:59:59.999Z`),
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

    const totalRevenue = revenueByMonth.length > 0 ? revenueByMonth[0].totalRevenue : 0;

    return res.status(200).json({
      code: 200,
      message: `Doanh thu của cửa hàng tháng ${month}`,
      data: totalRevenue,
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
          productImages: { $push: "$order_options.image" }, // Lấy danh sách link ảnh sản phẩm
        },
      },
      {
        $project: {
          _id: 0,
          product_id: "$_id.product_id",
          store_id: "$_id.store_id",
          totalSoldQuantity: "$totalSoldQuantity",
          productDetails: {
            name: "$productDetails.name",
            image: { $arrayElemAt: ["$productImages", 0] }, // Lấy link ảnh đầu tiên
            // Thêm các trường khác nếu cần
          },
        },
      },
    ]).sort({ totalSoldQuantity: -1 });

    return res.status(200).json({
      code: 200,
      message: "Thống kê số lượng sản phẩm đã bán",
      data: soldQuantityByProductAndStore,
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};


const getTopStoreByRevenue = async (req, res, next) => {
  try {
    const top5Stores = await orderModel.order.aggregate([
      {
        $match: {
          status: 'Đã giao hàng',
        },
      },
      {
        $unwind: '$productsOrder',
      },
      {
        $lookup: {
          from: 'options', // Tên bảng option trong mô hình của bạn
          localField: 'productsOrder.option_id',
          foreignField: '_id',
          as: 'optionInfo',
        },
      },
      {
        $unwind: '$optionInfo',
      },
      {
        $lookup: {
          from: 'products', // Tên bảng product trong mô hình của bạn
          localField: 'optionInfo.product_id',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      {
        $unwind: '$productInfo',
      },
      {
        $lookup: {
          from: 'stores', // Tên bảng store trong mô hình của bạn
          localField: 'productInfo.store_id',
          foreignField: '_id',
          as: 'storeInfo',
        },
      },
      {
        $unwind: '$storeInfo',
      },
      {
        $group: {
          _id: '$storeInfo._id',
          storeName: { $first: '$storeInfo.name' },
          totalRevenue: { $sum: '$total_price' },
        },
      },
      {
        $project: {
          store_id: '$_id',
          storeName: 1,
          totalRevenue: 1,
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return res.status(200).json({
      code: 200,
      message: "Top 5 cửa hàng có doanh thu cao nhất!",
      data: top5Stores,
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
}

const getTopProductByRevenue = async (req, res, next) => {
  try {
    const top5Products = await orderModel.order.aggregate([
      {
        $match: {
          status: 'Đã giao hàng',
        },
      },
      {
        $unwind: '$productsOrder',
      },
      {
        $lookup: {
          from: 'options', 
          localField: 'productsOrder.option_id',
          foreignField: '_id',
          as: 'optionInfo',
        },
      },
      {
        $unwind: '$optionInfo',
      },
      {
        $lookup: {
          from: 'products', // Tên bảng product trong mô hình của bạn
          localField: 'optionInfo.product_id',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      {
        $unwind: '$productInfo',
      },
      {
        $group: {
          _id: '$productInfo._id',
          productName: { $first: '$productInfo.name' },
          totalRevenue: { $sum: '$total_price' },
          productImage: { $first: '$optionInfo.image' }, 
        },
      },
      {
        $project: {
          product_id: '$_id',
          productName: 1,
          totalRevenue: 1,
          productImage: 1, // Bao gồm thông tin ảnh trong kết quả
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return res.status(200).json({
      code: 200,
      message: "Top 5 sản phẩm có doanh thu cao nhất!",
      data: top5Products,
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
}

// 2023-11-29T16:15:29.307+00:00

const getTotalRevenueByTimePeriodAndStatus = async (year, month, quarter) => {
  try {
    const matchStage = {
      $match: {
        status: "Đã giao hàng",
        createdAt: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 0),
        },
      },
    };

    if (quarter) {
      matchStage.$match.createdAt.$gte = new Date(year, (quarter - 1) * 3, 1);
      matchStage.$match.createdAt.$lt = new Date(year, (quarter - 1) * 3 + 3, 31);
    }

    const result = await orderModel.order.aggregate([
      matchStage,
      {
        $unwind: "$productsOrder",
      },
      {
        $lookup: {
          from: "options",
          localField: "productsOrder.option_id",
          foreignField: "_id",
          as: "optionInfo",
        },
      },
      {
        $unwind: "$optionInfo",
      },
      {
        $lookup: {
          from: "products",
          localField: "optionInfo.product_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $lookup: {
          from: "stores",
          localField: "productInfo.store_id",
          foreignField: "_id",
          as: "storeInfo",
        },
      },
      {
        $unwind: "$storeInfo",
      },
      {
        $group: {
          _id: "$storeInfo._id",
          storeName: { $first: "$storeInfo.name" },
          totalRevenue: { $sum: { $ifNull: ["$total_price", 0] } },
        },
      },
      {
        $sort: { totalRevenue: -1 } 
      }
    ]);

    return result;
  } catch (error) {
    console.error("Error fetching total revenue with store info:", error);
    throw error;
  }
};

const revenueAllStoreByMonth = async (req, res, next) => {
  const currentYear = new Date().getFullYear();
  const { month } = req.query;
  try {
    const result = await getTotalRevenueByTimePeriodAndStatus(currentYear, month);
    console.log('result: ', result);

    if (result === null || result.length === 0) {
      return res.status(200).json({
        code: 200,
        message: `Không có doanh thu của store nào trong tháng ${month} `,
        data: result
      });
    }

    return res.status(200).json({
      code: 200,
      message: `Doanh thu các store theo tháng ${month} năm ${currentYear}`,
      data: result
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
}

const revenueAllStoreByQuarter = async (req, res, next) => {
  const currentYear = new Date().getFullYear();
  const { quarter } = req.query;
  try {
    const result = await getTotalRevenueByTimePeriodAndStatus(currentYear, null, quarter);
    console.log('result: ', result);

    if (result === null || result.length === 0) {
      return res.status(200).json({
        code: 200,
        message: `Không có doanh thu theo quí ${quarter}.`,
        data: result
      });
    }

    return res.status(200).json({
      code: 200,
      message: `Doanh thu các store theo quý thứ ${quarter}`,
      data: result
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
}

module.exports = {
  calculateRevenueAllTime,
  calculateRevenueByMonth,
  calculateSoldQuantityByProductAndStore,
  getTopStoreByRevenue,
  getTopProductByRevenue,
  revenueAllStoreByMonth,
  revenueAllStoreByQuarter,
};
