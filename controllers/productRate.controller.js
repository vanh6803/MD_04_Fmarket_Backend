const model = require("../models/ProductRate");
const productModel = require("../models/Products");
const userModel = require("../models/Account");
const orderModel = require("../models/Orders");
const optionModel = require("../models/Option");

const getAllReviewsForProduct = async (req, res, next) => {
  try {
    const idProduct = req.params.idProduct;
    const product = await productModel.product.findById(idProduct);
    if (!product) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    const allReviews = await model.productRate
      .find({ product_id: idProduct })
      .populate(["product_id", "user_id"]);

    return res
      .status(200)
      .json({ code: 200, data: allReviews, message: "get data successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const inserReview = async (cmt) => {
  try {
    if (cmt) {
      const { product_id, user_id, content, image, rate } = cmt;
      const newReview = new model.productRate({
        product_id: product_id || null,
        user_id: user_id || null,
        content: content || null,
        image: image || null,
        rate: rate || null,
      });
      await newReview.save();

      console.log("Review inserted successfully!");
    } else {
      console.log("Invalid review data");
    }
  } catch (error) {
    console.error(error.message);
  }
};

const addReview = async (req, res, next) => {
  try {
    const user = req.user
    const idProduct = req.params.idProduct;

    let { content, image, rate } = req.body;

    const product = await productModel.product.findById(idProduct);

    if (!product) {
      return res.status(404).json({ code: 404, message: "product not found" });
    }


    if (req.file) {
      image = req.file.path;
    }

    const newReview = new model.productRate({
      user_id: user._id,
      product_id: idProduct,
      image: image,
      content: content,
      rate: rate,
    });

    await newReview.save()

    return res
      .status(201)
      .json({ code: 201, message: "created review successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const editReview = async (req, res, next) => {
  try {
    const idComment = req.params.idComment;

    let { product_id, user_id, content, image, rate } = req.body;

    const product = await productModel.product.findById(product_id);
    if (!product) {
      return res.status(404).json({ code: 404, message: "product not found" });
    }

    const user = await userModel.account.findById(user_id);
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    if (req.file) {
      image = req.file.path;
    }

    await model.productRate
      .findByIdAndUpdate(
        idComment,
        {
          image: image,
          content: content,
          rate: rate,
        },
        { new: true }
      )
      .then(() => {
        return res
          .status(200)
          .json({ code: 200, message: "Update comment success" });
      })
      .catch((err) => {
        return res
          .status(404)
          .json({ code: 404, message: "commnet not found" });
      });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const idComment = req.params.idComment;
    await model.productRate
      .findByIdAndDelete(idComment)
      .then(() => {
        return res
          .status(200)
          .json({ code: 200, message: "Delete comment success" });
      })
      .catch((err) => {
        return res
          .status(404)
          .json({ code: 404, message: "commnet not found" });
      });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  addReview,
  editReview,
  deleteReview,
  inserReview,
  getAllReviewsForProduct,
};
