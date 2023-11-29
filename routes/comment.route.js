var express = require("express");
var router = express.Router();
var commentController = require("../controllers/comment.controller");
var middleware = require("../middleware/auth.middleware");

router.get(
  "/get-comments-by-product/:productId", commentController.getCommentsByProduct
);

module.exports = router;
