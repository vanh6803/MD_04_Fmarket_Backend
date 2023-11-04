const categoryModel = require("../models/Category");
const productModel = require("../models/Products");
const optionModel = require("../models/Option");
const storeModel = require("../models/Store");

const addProduct = async (req, res) => {
  try {
    const dataBody = req.body;
    const category = await categoryModel.category.findById(
      dataBody.category_id
    );
    if (!category) {
      return res.status(404).json({ code: 404, message: "no found category!" });
    }
    const store = await storeModel.store.findById(dataBody.store_id);
    if (!store) {
      return res.status(404).json({ code: 404, message: "no found store!" });
    }
    console.log("file: ", req.files);
    console.log("image: ", req.body.image);
    if (req.files) {
      const images = req.files.map((file) => file.path);
      dataBody.image = images;
      console.log(images);
    }
    const product = new productModel.product(req.body);
    await product.save();
    console.log(product);
    category.product.push(product._id);
    await category.save();
    return res
      .status(201)
      .json({ code: 201, message: "created product successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const addOption = async (req, res) => {
  try {
    const dataBody = req.body;
    const product = await productModel.product.findById(dataBody.product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const option = new optionModel.option(req.body);
    await option.save();
    product.option.push(option._id);
    await product.save();
    console.log(option);
    res.status(201).json({ code: 201, message: "created option successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const detailProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    console.log(productId);
    const product = await productModel.product
      .findById(productId)
      .populate(["option", "store_id", "category_id", "product_review"]);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json({
      code: 200,
      result: product,
      message: "get detail product successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getProductsByCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.category
      .find()
      .populate("product")
    return res.status(200).json({
      code: 200,
      result: category,
      message: "get product by category successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const product = await productModel.product.find();
    return res.status(200).json({
      code: 200,
      result: product,
      message: "get all product successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  addOption,
  addProduct,
  detailProduct,
  getAllProducts,
  getProductsByCategory,
};
