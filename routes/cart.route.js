var express = require("express");
var router = express.Router();
var cartController = require("../controllers/cart.controller");

router.get("/get-list", cartController.listCart);
router.post("/add", cartController.addToCart); //add
router.put("/edit/:id", cartController.editCart); //edit
router.delete("/delete/:id", cartController.deleteCart); //delete

module.exports = router;
