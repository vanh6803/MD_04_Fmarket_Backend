var express = require("express");
var router = express.Router();
var controller = require("../controllers/products.controller");
var middleware = require("../middleware/auth.middleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/SetupCloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Product",
    format: "png",
  },
});
const upload = multer({ storage });

router.get("/all-product", controller.getAllProducts);
router.get("/all-product-by-store/:storeId", controller.getProductsByStore);
router.get("/all-product-by-category", controller.getProductsByCategory);
router.get("/detail-product/:productId", controller.detailProduct);
router.get("/similar-product/:productId", controller.getSimilarProducts);
router.post(
  "/create-product",
  middleware.checkToken,
  upload.array("image"),
  controller.addProduct
);
router.post("/create-option", middleware.checkToken, controller.addOption);
router.post(
  "/update-product/:productId",
  middleware.checkToken,
  upload.array("image"),
  controller.updateProduct
);
router.post(
  "/update-option/:optionId",
  middleware.checkToken,
  controller.updateOption
);

module.exports = router;
