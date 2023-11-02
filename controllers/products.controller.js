const categoryModel = require("../models/Category");
const productModel = require("../models/Products");
const optionModel = require("../models/Option");

const addProduct = async (req, res) => {
  try {
    const dataBody = req.body;
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
      .populate("option");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    //   _id: product._id,
    //   store_id: product.store_id,
    //   category_id: product.category_id,
    //   name: product.name,
    //   image: product.image,
    //   description: product.description,
    //   status: product.status,
    //   discounted: product.discounted,
    //   is_active: product.is_active,
    //   camera: product.camera,
    //   cpu: product.cpu,
    //   gpu: product.gpu,
    //   battery: product.battery,
    //   weight: product.weight,
    //   connection: product.connection,
    //   specialFeature: product.specialFeature,
    //   manufacturer: product.manufacturer,
    //   other: product.other,
    //   option: option,
    // };

    // console.log(result);
    return res
      .status(200)
      .json({ code: 200, result: product, message: "get product successfull" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const productForCategory = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = { addOption, addProduct, detailProduct };
