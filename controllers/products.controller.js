const categoryModel = require("../models/Category");
const productModel = require("../models/Products");
const optionModel = require("../models/Option");
const storeModel = require("../models/Store");
const productRateModel = require("../models/ProductRate");

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

const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const dataBody = req.body;

    await productModel.product
      .findByIdAndUpdate(productId, dataBody, { new: true })
      .then(() => {
        return res
          .status(200)
          .json({ code: 200, message: "Product updated successfully" });
      })
      .catch(() => {
        return res
          .status(404)
          .json({ code: 404, message: "Product not found" });
      });
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
    console.log("file: ", req.file);
    if (req.file) {
      dataBody.image = req.file.path;
    }
    const option = new optionModel.option(dataBody);
    await option.save();
    product.option.push(option._id);
    await product.save();
    console.log(option);
    res.status(201).json({ code: 201, message: "created option successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const updateOption = async (req, res, next) => {
  try {
    const { optionId } = req.params;
    const dataBody = req.body;
    console.log("file: ", req.file);
    if (req.file) {
      dataBody.image = req.file.path;
    }
    await optionModel.option
      .findByIdAndUpdate(optionId, dataBody)
      .then(() => {
        return res
          .status(200)
          .json({ code: 200, message: "option updated successfully" });
      })
      .catch(() => {
        return res.status(404).json({ code: 404, message: "option not found" });
      });
  } catch (error) {
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
    const optionImages = product.option.map((option) => option.image);
    let result = {
      ...product._doc,
      image: optionImages,
    };
    return res.status(200).json({
      code: 200,
      result: result,
      message: "get detail product successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getProductsByCategory = async (req, res, next) => {
  try {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 1000000;
    const categories = await categoryModel.category.find();

    // format data returned
    const result = categories.map(async (category) => {
      const limitedProducts = await productModel.product
        .find({
          category_id: category._id,
        })
        .populate("option")
        .limit(itemsPerPage);

      const formattedProducts = [];

      for (const product of limitedProducts) {
        const { minPrice, maxPrice } = await getMinMaxPrices(product._id);
        const averageRate = await getAverageRate(product._id);
        const image = await getImageHotOption(product._id);
        formattedProducts.push({
          _id: product._id,
          name: product.name,
          image: image,
          minPrice: minPrice,
          discounted: product.discounted,
          averageRate: averageRate,
          review: product.product_review.length,
        });
      }

      return {
        _id: category._id,
        nameCategory: category.name,
        product: formattedProducts,
      };
    });

    // Đợi cho tất cả các danh mục được xử lý và trả về
    const finalResult = await Promise.all(result);
    return res.status(200).json({
      code: 200,
      result: finalResult,
      message: "get product by category successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    // Get the page number and items per page from query parameters (default values if not provided)
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 1000000000; // You can adjust this value as needed

    // Calculate the skip value based on page number and items per page
    const skip = (page - 1) * itemsPerPage;
    const totalProducts = await productModel.product.countDocuments();
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    const products = await productModel.product
      .find()
      .skip(skip)
      .limit(itemsPerPage);

    const result = products.map(async (product) => {
      const { _id, name, discounted } = product;

      // Lấy giá lớn nhất và giá nhỏ nhất của sản phẩm
      const { minPrice, maxPrice } = await getMinMaxPrices(product._id);

      // Lấy sao trung bình của sản phẩm
      const averageRate = await getAverageRate(product._id);
      const image = await getImageHotOption(product._id);

      return {
        _id,
        name,
        discounted,
        image: image,
        minPrice,
        averageRate,
        review: product.product_review.length,
        active: product.is_active,
      };
    });
    const finalResult = await Promise.all(result);
    return res.status(200).json({
      code: 200,
      result: finalResult,
      totalPages: totalPages,
      message: "get all product successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getProductsByStore = async (req, res, next) => {
  try {
    const store_id = req.params.storeId;
    // Get the page number and items per page from query parameters (default values if not provided)
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10; // You can adjust this value as needed

    // Calculate the skip value based on page number and items per page
    const skip = (page - 1) * itemsPerPage;

    const products = await productModel.product
      .find({ store_id: store_id })
      .skip(skip)
      .limit(itemsPerPage);

    const result = products.map(async (product) => {
      const { _id, name, discounted } = product;

      // Lấy giá lớn nhất và giá nhỏ nhất của sản phẩm
      const { minPrice, maxPrice } = await getMinMaxPrices(product._id);

      // Lấy sao trung bình của sản phẩm
      const averageRate = await getAverageRate(product._id);
      const image = await getImageHotOption(product._id);

      return {
        _id,
        name,
        discounted,
        image: image,
        minPrice,
        averageRate,
        review: product.product_review.length,
      };
    });
    const finalResult = await Promise.all(result);
    return res.status(200).json({
      code: 200,
      result: finalResult,
      message: "get all product successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.product.findById(productId);

    if (!product) {
      return res.status(404).json({ code: 404, message: "Product not found" });
    }

    // Lấy danh sách các sản phẩm cùng danh mục (category) với sản phẩm hiện tại, giới hạn chỉ 5 sản phẩm
    const similarProducts = await productModel.product
      .find({ category_id: product.category_id, _id: { $ne: productId } })
      .limit(5);

    const result = similarProducts.map(async (similarProduct) => {
      const { _id, name, discounted } = similarProduct;
      const { minPrice, maxPrice } = await getMinMaxPrices(similarProduct._id);
      const averageRate = await getAverageRate(similarProduct._id);
      const image = await getImageHotOption(product._id);
      return {
        _id,
        name,
        discounted,
        image: image,
        minPrice,
        averageRate,
        review: similarProduct.product_review.length,
      };
    });

    const similarProductsList = await Promise.all(result);

    return res.status(200).json({
      code: 200,
      result: similarProductsList,
      message: "get similar products successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getAverageRate = async (product_id) => {
  try {
    const rates = await productRateModel.productRate.find(
      { product_id: product_id },
      "rate"
    );

    if (rates.length === 0) {
      return 0; // Trả về 0 nếu không có đánh giá nào
    }

    const totalRate = rates.reduce((sum, rate) => sum + rate.rate, 0);
    const averageRate = totalRate / rates.length;
    return averageRate;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

const getMinMaxPrices = async (product_id) => {
  try {
    const options = await optionModel.option.find(
      { product_id: product_id },
      "price"
    );
    const prices = options.map((option) => option.price);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return { minPrice, maxPrice };
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

const getImageHotOption = async (product_id) => {
  try {
    const options = await optionModel.option.find(
      { product_id: product_id, hot_option: true },
      "image"
    );
    if (options.length > 0) {
      return options[0].image;
    } else {
      return "don't not value";
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

module.exports = {
  addOption,
  addProduct,
  detailProduct,
  getAllProducts,
  getProductsByCategory,
  updateProduct,
  updateOption,
  getProductsByStore,
  getSimilarProducts,
};
