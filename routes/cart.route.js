var express = require("express");
var router = express.Router();
var cartController = require("../controllers/cart.controller");
var middleware = require("../middleware/auth.middleware");

router.get(
  "/all-cart-user",
  middleware.checkToken,
  cartController.listCartForUser
);
router.post(
  "/create-cart-item",
  middleware.checkToken,
  cartController.createCartItem
); //add
router.put(
  "/update-quantity/:id",
  middleware.checkToken,
  cartController.updateCartItemQuantity
); //edit
router.delete(
  "/delete-cart-item/:id",
  middleware.checkToken,
  cartController.deleteCartItem
); //delete

module.exports = router;
