var express = require("express");
var router = express.Router();
var statisticalController = require("../controllers/statistical.controller");

router.get("/get-revenue-all-time", statisticalController.calculateRevenueAllTime);
router.get("/get-revenue-by-month", statisticalController.calculateRevenueByMonth);
router.get("/get-sold-quantity-by-productandstore", statisticalController.calculateSoldQuantityByProductAndStore);
router.get("/get-top-store-by-revenue", statisticalController.getTopStoreByRevenue);
router.get("/get-top-product-by-revenue", statisticalController.getTopProductByRevenue);
router.get("/get-revenue-all-store-by-month", statisticalController.revenueAllStoreByMonth);

module.exports = router;

