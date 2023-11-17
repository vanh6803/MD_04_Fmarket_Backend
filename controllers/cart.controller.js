const models = require("../models/Cart");
const optionModels = require("../models/Option");

const listCartForUser = async (req, res, next) => {
  try {
    const uid = req.user._id;
    const carts = await models.cart
      .find({ user_id: uid })
      .populate(["option_id", "user_id"]);
    const result = await Promise.all(
      carts.map(async (cart) => {
        const options = await optionModels.option
          .findById(cart.option_id._id)
          .populate("product_id");
        return {
          ...cart._doc,
          option_id: {
            ...options._doc,
            product_id: {
              _id: options.product_id._id,
              name: options.product_id.name,
            },
          },
        };
      })
    );
    return res.status(200).json({
      code: 200,
      data: result || [],
      message: "get data successfully!",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const createCartItem = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const { option_id, quantity } = req.body;

    // Check if a cart item with the given option_id already exists for the user
    const existingCartItem = await models.cart.findOne({ user_id, option_id });

    if (existingCartItem) {
      // If the cart item exists, update the quantity
      const updatedCartItem = await models.cart.findOneAndUpdate(
        { user_id, option_id },
        {
          $set: {
            quantity: parseInt(existingCartItem.quantity) + parseInt(quantity),
          },
        },
        { new: true }
      );

      return res.status(200).json({
        code: 200,
        data: updatedCartItem,
        message: "Cart item updated successfully!",
      });
    } else {
      // If the cart item doesn't exist, create a new one
      const newCartItem = await models.cart.create({
        user_id,
        option_id,
        quantity,
      });

      return res.status(201).json({
        code: 201,
        data: newCartItem,
        message: "Cart item created successfully!",
      });
    }
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const updateCartItemQuantity = async (req, res, next) => {
  try {
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    const updatedCartItem = await models.cart.findByIdAndUpdate(
      cartItemId,
      { $set: { quantity } },
      { new: true }
    );

    if (!updatedCartItem) {
      return res
        .status(404)
        .json({ code: 404, message: "Cart item not found" });
    }

    return res.status(200).json({
      code: 200,
      message: "Cart item updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const deleteCartItem = async (req, res, next) => {
  try {
    const cartItemId = req.params.id;

    const deletedCartItem = await models.cart.findByIdAndDelete(cartItemId);

    if (!deletedCartItem) {
      return res
        .status(404)
        .json({ code: 404, message: "Cart item not found" });
    }

    return res.status(200).json({
      code: 200,
      message: "Cart item deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  listCartForUser,
  createCartItem,
  updateCartItemQuantity,
  deleteCartItem,
};
