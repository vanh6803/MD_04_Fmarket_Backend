const orderModel = require("../models/Orders");
const optionModel = require("../models/Option");

const createOrder = async (req, res, next) => {
  try {
    const { user_id, productsOrder, status, info_id } = req.body;
    // Tính toán total_price dựa trên productsOrder

    // Step 1: Lọc các option theo cửa hàng
    const storeOptions = {};
    for (const productOrder of productsOrder) {
      const option = await optionModel.option
        .findById(productOrder.option_id)
        .populate("product_id");

      if (option) {
        const store_id = option.product_id.store_id.toString();
        console.log(store_id); // Chuyển store_id sang kiểu string để sử dụng như key trong đối tượng
        if (!storeOptions[store_id]) {
          storeOptions[store_id] = [];
        }
        storeOptions[store_id].push({
          option,
          quantity: productOrder.quantity,
        });
      }
    }

    // Step 2: Tính toán total_price cho từng cửa hàng và lưu đơn hàng
    for (const store_id in storeOptions) {
      let total_price = 0;
      const storeProductsOrder = storeOptions[store_id];

      for (const { option, quantity } of storeProductsOrder) {
        const optionPrice = option.price;
        total_price += optionPrice * quantity;
      }

      // Step 3: Lưu đơn hàng vào cơ sở dữ liệu
      const newOrder = new orderModel.order({
        user_id,
        productsOrder: storeProductsOrder,
        total_price,
        status,
        info_id,
      });

      await newOrder.save();
    }

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

    const orders = await orderModel.order
      .find({ user_id: userId })
      .populate(["user_id", "info_id"]);

    const result = await Promise.all(
      orders.map(async (order) => {
        const productsOrder = await Promise.all(
          order.productsOrder.map(async (productOrder) => {
            const option = await optionModel.option
              .findById(productOrder.option_id)
              .lean(); // Use lean to convert Mongoose document to plain JavaScript object

            return {
              option,
              quantity: productOrder.quantity,
            };
          })
        );

        return {
          _id: order._id,
          user_id: order.user_id,
          info_id: order.info_id,
          productsOrder,
          total_price: order.total_price,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      })
    );

    return res.status(200).json({
      code: 200,
      result: result,
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
