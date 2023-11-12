const express = require("express");
const models = require("../models/Cart");

//product
// [get] /api/cart/get-list
const listCart = async (req, res, next) => {
  try {
    const cart = await models.cart.find();
    if (!cart) {
      return res.status(404).json({ code: 404, message: "no data  " });
    }
    return res
      .status(200)
      .json({ code: 200, data: cart, message: "get data successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [post] /api/cart/add
const addToCart = async (req, res, next) => {
  try {
    let obj = new models.cart();
    
    obj.option_id = req.body.option_id;
    obj.user_id = req.body.user_id;
    obj.quantity = req.body.quantity;

    await obj.save();
    return res.status(200).json({ code: 200, message: "add successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [put] /api/cart/edit/:id
const editCart = async (req, res, next) => {
  try {
    let id = req.params.id;
    const cart = await models.cart.findById(id);
    if (!cart) {
      return res.status(404).json({ code: 404, message: "Cart not found" });
    }
    let obj = new models.cart();
    obj.option_id = req.body.option_id
    obj.user_id = req.body.user_id;
    obj._id = id;
    obj.quantity = req.body.quantity;

    await models.cart.findByIdAndUpdate({ _id: id }, obj);
    return res.status(200).json({ code: 200, message: "update successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [delete] /api/cart/delete/:id
const deleteCart = async (req, res, next) => {
  try {
    let id = req.params.id;
    const cart = await models.cart.findById(id);
    if (!cart) {
      return res.status(404).json({ code: 404, message: "Cart not found" });
    }
    await models.cart.findByIdAndDelete(id);
    return res.status(200).json({ code: 200, message: "delete successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  listCart,
  addToCart,
  editCart,
  deleteCart,
};
