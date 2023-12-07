var express = require("express");
var router = express.Router();
var controller = require("../controllers/notification.controller");

router.get("/get-notifi-list/:userId", controller.allNotificationByUser);
router.put("/update-status/:notificationId", controller.updateStatusNotifi);

module.exports = router;