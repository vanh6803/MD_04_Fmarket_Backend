var express = require("express");
var router = express.Router();
var statisticalController = require("../controllers/statistical.controller");

router.get("/get-revenue-all-time", statisticalController.calculateRevenueAllTime);

module.exports = router;

