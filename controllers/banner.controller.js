const express = require("express");
const models = require("../models/Banner");

// [get] /api/banner/get-list
const list = async (req, res, next) => {
  try {
    const banner = await models.banner.find();
    return res
      .status(200)
      .json({ code: 200, data: banner, message: "get data successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [post] /api/banner/add
const addBanner = async (req, res, next) => {
  try {
    const data = req.body;
    if (req.file) {
      data.image = req.file.path;
    }

    let obj = new models.banner(data);

    await obj.save();
    return res.status(200).json({ code: 200, message: "add successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [put] /api/banner/edit/:id
const editBanner = async (req, res, next) => {
  try {
    let id = req.params.id;
    const banner = await models.banner.findById(id);
    if (!banner) {
      return res.status(404).json({ code: 404, message: "Banner not found" });
    }
    const data = req.body;
    if (req.file) {
      data.image = req.file.path;
    }
    await models.banner.findByIdAndUpdate({ _id: id }, data, { new: true });
    return res.status(200).json({ code: 200, message: "update successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [delete] /api/banner/delete/:id
const deleteBanner = async (req, res, next) => {
  try {
    let id = req.params.id;
    const banner = await models.banner.findById(id);
    if (!banner) {
      return res.status(404).json({ code: 404, message: "Banner not found" });
    }
    await models.banner.findByIdAndDelete(id);
    return res.status(200).json({ code: 200, message: "delete successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  list,
  addBanner,
  editBanner,
  deleteBanner,
};
