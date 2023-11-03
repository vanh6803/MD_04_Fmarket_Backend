var express = require("express");
var router = express.Router();
var controller = require("../controllers/info.controller");
var middleware = require("../middleware/auth.middleware");

router.get("/uid", middleware.checkToken, controller.getInfo);
router.post("/", middleware.checkToken, controller.addInfo);
router.put("/", middleware.checkToken, controller.updateInfo);
router.delete("/", middleware.checkToken, controller.deleteInfo);

module.exports = router;
