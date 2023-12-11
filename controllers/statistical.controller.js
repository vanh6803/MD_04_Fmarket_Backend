const db = require("../config/ConnectDB");
const optionModel = require("../models/Option");
const orderModel = require("../models/Orders");

const calculateRevenueByMonth = async (req, res, next) => {
  try {
    // Đường ống tập hợp dữ liệu để tính toán doanh thu theo tháng
    const revenueByMonth = await orderModel.order.aggregate([
      {
        $match: {
          // Thêm bất kỳ bộ lọc bổ sung nếu cần
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$total_price" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    return res.status(200).json({
      code: 200,
      message: "Thống kê doanh thu theo tháng",
      data: revenueByMonth,
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  calculateRevenueByMonth,
};
