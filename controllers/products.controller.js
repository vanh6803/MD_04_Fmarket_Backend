const categoryModel = require("../models/Category");
const productModel = require("../models/Products");
const optionModel = require("../models/Option");
const storeModel = require("../models/Store");
const productRateModel = require("../models/ProductRate");
const orderModel = require("../models/Orders");
const { sendEmail } = require("../utils/NodemailerService");

const addProduct = async (req, res, next) => {
  try {
    const store_id = req.store._id;
    const dataBody = req.body;
    const category = await categoryModel.category.findById(
      dataBody.category_id
    );
    if (!category) {
      return res.status(404).json({ code: 404, message: "no found category!" });
    }
    const store = await storeModel.store.findById(store_id);
    if (!store) {
      return res.status(404).json({ code: 404, message: "no found store!" });
    }
    if (!dataBody.name) {
      return res.status(404).json({ code: 404, message: "name is required" });
    }
    if (!dataBody.manufacturer) {
      return res
        .status(404)
        .json({ code: 404, message: "manufacturer is required" });
    }
    if (!dataBody.status) {
      return res.status(404).json({ code: 404, message: "status is required" });
    }
    const product = new productModel.product({ ...dataBody, store_id });
    await product.save();
    console.log(product);
    category.product.push(product._id);
    await category.save();
    return res.status(201).json({
      code: 201,
      result: product,
      message: "created product successfully",
    });
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

const addOption = async (req, res, next) => {
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
    if (dataBody.discount_value > 0) {
      await productModel.product.findByIdAndUpdate(product._id, {
        discounted: true,
      });
    }
    console.log(option);
    res.status(201).json({
      code: 201,
      result: option,
      message: "created option successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const updateOption = async (req, res, next) => {
  try {
    const { optionId } = req.params;
    const dataBody = req.body;

    const option = await optionModel.option.findById(optionId);

    if (!option) {
      return res.status(404).json({ code: 404, message: "option not found" });
    }

    await optionModel.option.findByIdAndUpdate(optionId, dataBody);

    const hasDiscountValueOption = await optionModel.option.exists({
      product_id: option.product_id,
      discount_value: { $gt: 0 },
    });

    console.log(hasDiscountValueOption);

    if (!hasDiscountValueOption) {
      await productModel.product.findByIdAndUpdate(option.product_id, {
        discounted: false,
      });
    } else {
      await productModel.product.findByIdAndUpdate(option.product_id, {
        discounted: true,
      });
    }

    return res
      .status(200)
      .json({ code: 200, message: "option updated successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const updateImageOption = async (req, res, next) => {
  try {
    const { optionId } = req.params;
    console.log("file: ", req.file);
    let image;
    if (req.file) {
      image = req.file.path;
    }
    await optionModel.option
      .findByIdAndUpdate(optionId, { image: image }, { new: true })
      .then(() => {
        return res
          .status(200)
          .json({ code: 200, message: "option image updated successfully" });
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
    const queryCategory = req.query.category;

    const categories = await categoryModel.category
      .find(queryCategory ? { _id: queryCategory } : null)
      .lean();

    const result = await Promise.all(
      categories.map(async (category) => {
        const limitedProducts = await productModel.product
          .find({ category_id: category._id, is_active: true })
          .populate("option")
          .limit(itemsPerPage)
          .lean();

        const formattedProducts = await Promise.all(
          limitedProducts.map(async (product) => {
            const totalSoldQuantity = await calculateTotalSoldQuantity(
              product.option
            );
            const { minPrice, maxPrice } = await getMinMaxPrices(product._id);
            const averageRate = await getAverageRate(product._id);
            const image = await getImageHotOption(product._id);

            return {
              _id: product._id,
              name: product.name,
              image,
              minPrice,
              discounted: product.discounted,
              averageRate,
              review: product.product_review.length,
              soldQuantity: totalSoldQuantity,
            };
          })
        );

        return {
          _id: category._id,
          nameCategory: category.name,
          product: formattedProducts,
        };
      })
    );

    return res.status(200).json({
      code: 200,
      result,
      message: "get product by category successful",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getAllProducts = async (req, res, next) => {
  const populateFields = ["store_id", "category_id", "option"];
  try {
    const {
      page = 1,
      itemsPerPage = 1000000000,
      category,
      store,
      discounted,
      isActive,
      sort,
    } = req.query;
    const skip = (page - 1) * itemsPerPage;

    let query = productModel.product.find().lean();

    if (category) {
      query.where("category_id").in(category);
    }

    if (store) {
      query.where("store_id").in(store);
    }

    if (discounted) {
      query.where("discounted").equals(true);
    }

    if (isActive) {
      query.where("is_active").equals(true);
    }

    query.sort(sort ? { updatedAt: sort } : { createAt: 1 });

    const totalProducts = await productModel.product.countDocuments();
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    const products = await query
      .skip(skip)
      .limit(itemsPerPage)
      .populate(populateFields)
      .exec();

    const result = await Promise.all(
      products.map(async (product) => {
        const { _id, name, discounted, store_id, category_id, option } =
          product;
        const { minPrice, maxPrice } = await getMinMaxPrices(product._id);
        const averageRate = await getAverageRate(product._id);
        const image = await getImageHotOption(product._id);
        const totalSoldQuantity = await calculateTotalSoldQuantity(
          product.option
        );

        return {
          _id,
          name,
          store_id,
          category_id,
          discounted,
          image,
          minPrice,
          averageRate,
          review: product.product_review.length,
          active: product.is_active,
          soldQuantity: totalSoldQuantity,
        };
      })
    );

    return res.status(200).json({
      code: 200,
      result,
      totalPages,
      message: "get all product successful",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getProductsByStore = async (req, res, next) => {
  try {
    const store_id = req.params.storeId;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const skip = (page - 1) * itemsPerPage;

    const products = await productModel.product
      .find({ store_id, is_active: true })
      .skip(skip)
      .limit(itemsPerPage)
      .lean();

    const result = await Promise.all(
      products.map(async (product) => {
        const { _id, name, discounted, store_id, category_id, option } = product;
        const { minPrice, maxPrice } = await getMinMaxPrices(product._id);
        const averageRate = await getAverageRate(product._id);
        const image = await getImageHotOption(product._id);
        const totalSoldQuantity = await calculateTotalSoldQuantity(
          product.option
        );
        return {
          _id,
          name,
          store_id,
          category_id,
          discounted,
          image,
          minPrice,
          averageRate,
          review: product.product_review.length,
          soldQuantity: totalSoldQuantity,
        };
      })
    );

    return res.status(200).json({
      code: 200,
      result,
      message: "get all product successful",
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

    const similarProducts = await productModel.product
      .find({
        category_id: product.category_id,
        _id: { $ne: productId },
        is_active: true,
      })
      .limit(5)
      .lean();

    const result = await Promise.all(
      similarProducts.map(async (similarProduct) => {
        const { _id, name, discounted, option } = similarProduct;
        const { minPrice, maxPrice } = await getMinMaxPrices(
          similarProduct._id
        );
        const averageRate = await getAverageRate(similarProduct._id);
        const image = await getImageHotOption(similarProduct._id);
        const totalSoldQuantity = await calculateTotalSoldQuantity(
          similarProduct.option
        );
        return {
          _id,
          name,
          discounted,
          image,
          minPrice,
          averageRate,
          review: similarProduct.product_review.length,
          soldQuantity: totalSoldQuantity,
        };
      })
    );

    return res.status(200).json({
      code: 200,
      result,
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

// Function to calculate total soldQuantity for all options of a product
const calculateTotalSoldQuantity = async (options) => {
  try {
    let totalSoldQuantity = 0;

    for (const optionId of options) {
      const option = await optionModel.option.findById(optionId);
      totalSoldQuantity += option.soldQuantity || 0;
    }

    return totalSoldQuantity;
  } catch (error) {
    console.log(error.message);
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

const deleteOption = async (req, res, next) => {
  try {
    const user = req.user;

    const { optionId } = req.params;
    console.log(user._id);

    const option = await optionModel.option
      .findById(optionId)
      .populate("product_id");

    if (!option) {
      return res.status(404).json({ code: 404, message: "option not found" });
    }

    const optionsOrder = await orderModel.order.find({
      "productsOrder.option_id": optionId,
    });

    if (
      (optionsOrder.status =
        "Chờ giao hàng" || optionsOrder.status == "Chờ xác nhận")
    ) {
      return res
        .status(409)
        .json({ code: 409, message: "you don't delete option" });
    }

    await optionModel.option.findByIdAndDelete(optionId);

    return res.status(200).json({
      code: 200,
      message: "delete option successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check if the product exists
    const product = await productModel.product.findById(productId);
    if (!product) {
      return res.status(404).json({ code: 404, message: "Product not found" });
    }

    const optionsInOrders = await orderModel.order.find({
      "productsOrder.option_id": { $in: product.option },
      status: { $in: ["Chờ giao hàng", "Chờ xác nhận"] },
    });

    if (optionsInOrders.length > 0) {
      return res.status(409).json({
        code: 409,
        message:
          "Cannot delete product. Options are in orders with status 'Chờ giao hàng' or 'Chờ xác nhận'.",
      });
    }

    // Delete the product
    await productModel.product.findByIdAndDelete(productId);

    // Remove the product reference from the associated category
    const category = await categoryModel.category.findOneAndUpdate(
      { product: productId },
      { $pull: { product: productId } },
      { new: true }
    );

    return res.status(200).json({
      code: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const changeActiveProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = req.user._id;
    if (!user.role_id == "admin" || !user.role_id == "staff") {
      return res.status(403).json({
        code: 403,
        message: "You do not have permission to use this function",
      });
    }
    const product = await productModel.product.findById(productId);
    if (!product) {
      return res.status(404).json({ code: 404, message: "Product not found" });
    }
    let active = !product.is_active;
    await productModel.product.findByIdAndUpdate(
      productId,
      { is_active: active },
      { new: true }
    );
    return res
      .status(200)
      .json({ code: 200, message: "change active product successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getTopProduct = async (req, res, next) => {
  try {
    const topSoldProducts = await optionModel.option
      .find({})
      .sort({ soldQuantity: -1 })
      .limit(10)
      .populate("product_id")
      .exec();

    return res.status(200).json({
      code: 200,
      result: topSoldProducts,
      message: "Get top sold products successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const sendEmailToStore = async (req, res, next) => {
  try {
    const user = req.user;
    const { storeId, productId, content } = req.body;

    if (user.role_id == "customer") {
      return res
        .status(403)
        .json({ code: 403, message: "you don't permission" });
    }

    const store = await storeModel.store
      .findById(storeId)
      .populate("account_id");
    if (!store) {
      return res.status(404).json({ code: 404, message: "store not found" });
    }

    const product = await productModel.product.findById(productId);
    if (!product) {
      return res.status(404).json({ code: 404, message: "product not found" });
    }
    sendEmail(store.account_id.email, "cảnh báo sản phẩm", content);
    return res.status(200).json({
      code: 200,
      message: "send email successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
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
  getTopProduct,
  updateImageOption,
  changeActiveProduct,
  deleteOption,
  deleteProduct,
  sendEmailToStore,
};
