var express = require("express");
var router = express.Router();
var controller = require("../controllers/order.controller");
var middleware = require("../middleware/auth.middleware");

router.post("/create-order", middleware.checkToken, controller.createOrder);
router.put(
  "/update-order-status/:orderId",
  middleware.checkToken,
  middleware.checkStoreExits,
  controller.updateOrderStatus
);
router.get("/", middleware.checkToken, controller.getOrdersByUserId);
router.get(
  "/detail-order/:orderId",
  middleware.checkToken,
  controller.detailOrders
);
router.get(
  "/order-for-store",
  middleware.checkToken,
  middleware.checkStoreExits,
  controller.ordersForStore
);

router.get('/collect-order/:storeId', controller.collectOrders);

module.exports = router;
