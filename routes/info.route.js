var express = require("express");
var router = express.Router();
var controller = require("../controllers/info.controller");
var middleware = require("../middleware/auth.middleware");

router.get("/", middleware.checkToken, controller.getInfo);
router.post("/add", middleware.checkToken, controller.createInfo);
router.put(
  "/edit-info/:infoId",
  middleware.checkToken,
  controller.updateInfoByUserId
);
router.delete("/delete/:infoId", middleware.checkToken, controller.deleteInfo);

module.exports = router;
