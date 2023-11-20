const orderModel = require("../models/Orders");
const optionModel = require("../models/Option");
const productModel = require("../models/Products");

const createOrder = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const { productsOrder, info_id } = req.body;

    // Sử dụng đối tượng để theo dõi store_id và productsOrder tương ứng
    const storeOrders = {};

    for (const productOrder of productsOrder) {
      const option = await optionModel.option
        .findById(productOrder.option_id)
        .populate("product_id");

      const store_id = option?.product_id.store_id;

      // Nếu store_id đã xuất hiện, thêm vào đơn đặt hàng tương ứng
      if (storeOrders[store_id]) {
        storeOrders[store_id].productsOrder.push({
          option_id: productOrder.option_id,
          quantity: productOrder.quantity,
        });
      } else {
        // Nếu store_id chưa xuất hiện, tạo một đơn đặt hàng mới
        storeOrders[store_id] = {
          user_id,
          productsOrder: [
            {
              option_id: productOrder.option_id,
              quantity: productOrder.quantity,
            },
          ],
          info_id,
        };
      }
    }

    // Tạo đơn đặt hàng từ các storeOrders
    const orderPromises = Object.values(storeOrders).map(async (orderData) => {
      orderData.total_price = 0;
      for (const productOrder of orderData.productsOrder) {
        const option = await optionModel.option
          .findById(productOrder.option_id)
          .populate("product_id");

        const productPrice = parseFloat(option.price) || 0;
        orderData.total_price +=
          parseFloat(productPrice) * parseInt(productOrder.quantity);
      }

      const newOrder = new orderModel.order({
        ...orderData,
      });

      await newOrder.save();
    });

    // Đợi tất cả các đơn đặt hàng được tạo xong
    await Promise.all(orderPromises);

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
    const { status } = req.query;

    const queryCondition = { user_id: userId };
    if (status) {
      queryCondition.status = status;
    }

    const orders = await orderModel.order
      .find(queryCondition)
      .sort({ updatedAt: -1 })
      .populate(["user_id", "info_id"]);

    const result = await Promise.all(
      orders.map(async (order) => {
        const productsOrder = await Promise.all(
          order.productsOrder.map(async (productOrder) => {
            const option = await optionModel.option
              .findById(productOrder.option_id)
              .lean()
              .populate("product_id"); // Use lean to convert Mongoose document to plain JavaScript object

            return {
              option_id: option,
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

const ordersForStore = async (req, res, next) => {
  try {
    const { store_id } = req.params;

    // Bước 1: Lấy danh sách sản phẩm thuộc cửa hàng
    const products = await productModel.product.find({ store_id }).lean();

    // Bước 2-4: Lấy danh sách đơn hàng
    const orders = [];

    for (const product of products) {
      const options = await optionModel.option
        .find({ product_id: product._id })
        .lean();

      for (const option of options) {
        const optionOrders = await orderModel.order
          .find({ "productsOrder.option_id": option._id })
          .sort({ updatedAt: -1 })
          .populate(["user_id", "info_id"])
          .lean();

        orders.push(...optionOrders);
      }
    }

    const result = await Promise.all(
      orders.map(async (order) => {
        const productsOrder = await Promise.all(
          order.productsOrder.map(async (productOrder) => {
            const option = await optionModel.option
              .findById(productOrder.option_id)
              .lean()
              .populate("product_id"); // Use lean to convert Mongoose document to plain JavaScript object

            return {
              option_id: option,
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
      message: "Retrieved orders successfully for the store",
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
  ordersForStore,
};
