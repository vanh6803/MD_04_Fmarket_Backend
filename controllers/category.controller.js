const express = require("express");
const models = require("../models/Category");

//product
// [get] /api/category/get-list
const listCategory = async (req, res, next) => {
  try {
    const category = await models.category.find();
    return res
      .status(200)
      .json({ code: 200, data: category, message: "get data successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [post] /api/category/add
const addCategory = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    if (req.file) {
      data.image = req.file.path;
    }

    const existingCategory = await models.category.findOne({ name: data.name });
    if (existingCategory) {
      return res
        .status(409)
        .json({ code: 409, message: "category already exists" });
    }

    let obj = new models.category(data);

    await obj.save();
    return res.status(200).json({ code: 200, message: "add successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [put] /api/category/edit/:id
const editCategory = async (req, res, next) => {
  try {
    let id = req.params.id;
    const category = await models.category.findById(id);
    if (!category) {
      return res.status(404).json({ code: 404, message: "Category not found" });
    }
    const data = req.body;
    if (req.file) {
      data.image = req.file.path;
    }
    await models.category.findByIdAndUpdate({ _id: id }, data, { new: true });
    return res.status(200).json({ code: 200, message: "update successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [delete] /api/category/delete/:id
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
