const express = require("express");
const models = require("../models/Category");

//product
// [get] /category/get-list
const listCategory = async (req, res, next) => {
  try {
    const category = await models.category.find();
    if (!category) {
      return res.status(404).json({ code: 404, message: "no data  " });
    }
    return res
      .status(200)
      .json({ code: 200, data: category, message: "get data successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [post] /category/add
const addCategory = async (req, res, next) => {
  try {
    let obj = new models.category();
    obj.name = req.body.name;
    if (req.file) {
      obj.image = req.file.path;
    }
    await obj.save();
    return res.status(200).json({ code: 200, message: "add successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [put] /category/edit/:id
const editCategory = async (req, res, next) => {
  try {
    let id = req.params.id;
    const category = await models.category.findById(id);
    if (!category) {
      return res.status(404).json({ code: 404, message: "Category not found" });
    }
    let obj = new models.category();
    obj.name = req.body.name;
    obj._id = id;

    if (req.file) {
      obj.image = req.file.path;
    }

    await models.category.findByIdAndUpdate({ _id: id }, obj);
    return res.status(200).json({ code: 200, message: "update successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [delete] /category/delete/:id
const deleteCategory = async (req, res, next) => {
  try {
    let id = req.params.id;
    const category = await models.category.findById(id);
    if (!category) {
      return res.status(404).json({ code: 404, message: "Category not found" });
    }
    await models.category.findByIdAndDelete(id);
    return res.status(200).json({ code: 200, message: "delete successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  listCategory,
  addCategory,
  editCategory,
  deleteCategory,
};
