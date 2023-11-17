var express = require("express");
var router = express.Router();
var controller = require("../controllers/order.controller");
var middleware = require("../middleware/auth.middleware");

router.post("/create-order", middleware.checkToken, controller.createOrder);
router.put(
  "/update-order-status/:orderId",
  middleware.checkToken,
  controller.updateOrderStatus
);
router.get("/", middleware.checkToken, controller.getOrdersByUserId);
router.post(
  "/detail-order/:orderId",
  middleware.checkToken,
  controller.detailOrders
);

module.exports = router;
