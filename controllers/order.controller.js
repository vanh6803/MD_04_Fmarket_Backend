const orderModel = require("../models/Orders");
const optionModel = require("../models/Option");

const createOrder = async (req, res, next) => {
  try {
    const { user_id, productsOrder, status, info_id } = req.body;
    // Tính toán total_price dựa trên productsOrder
    let total_price = 0;
    for (const productOrder of productsOrder) {
      const option = await optionModel.option.findById(productOrder.option);

      if (option) {
        const optionPrice = option.price;
        const quantity = productOrder.quantity;
        total_price += optionPrice * quantity;
      }
    }
    const newOrder = new orderModel.order({
      user_id,
      productsOrder,
      total_price,
      status,
      info_id,
    });

    await newOrder.save();

    return res
      .status(201)
      .json({ code: 201, message: "created order successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getOrdersByUserId = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const orders = await orderModel.order.find({ user_id: userId });

    return res.status(200).json({
      code: 200,
      result: orders,
      message: "created order successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await orderModel.order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const detailOrders = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const orders = await orderModel.order.findById(orderId);

    return res.status(200).json({
      code: 200,
      result: orders,
      message: "created order successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  updateOrderStatus,
  detailOrders,
};
