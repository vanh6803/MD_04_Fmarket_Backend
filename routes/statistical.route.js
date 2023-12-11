var express = require("express");
var router = express.Router();
var statisticalController = require("../controllers/statistical.controller");

router.get("/get-revenue-by-month", statisticalController.calculateRevenueByMonth);

module.exports = router;

