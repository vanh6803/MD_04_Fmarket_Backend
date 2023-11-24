var express = require("express");
var router = express.Router();
var controller = require("../controllers/message.controller");
var middleware = require("../middleware/auth.middleware");

router.get("/get-msg-list/:senderId", controller.getPeopleMessageList);

module.exports = router;
