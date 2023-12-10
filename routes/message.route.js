var express = require("express");
var router = express.Router();
var controller = require("../controllers/message.controller");
var middleware = require("../middleware/auth.middleware");

router.get("/get-people-msg-list/:userId", controller.getPeopleMessageList);
router.get("/get-msg-list", controller.getMessageList);

module.exports = router;
