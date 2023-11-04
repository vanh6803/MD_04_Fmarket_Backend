var express = require("express");
var router = express.Router();
var controller = require("../controllers/info.controller");
var middleware = require("../middleware/auth.middleware");

router.get("/", middleware.checkToken, controller.getInfo);
router.post("/", middleware.checkToken, controller.addInfo);
router.put("/edit-info/:infoId", middleware.checkToken, controller.updateInfo);
router.delete("/delete/:infoId", middleware.checkToken, controller.deleteInfo);

module.exports = router;
