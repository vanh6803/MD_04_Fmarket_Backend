var express = require("express");
var router = express.Router();
var controller = require("../controllers/products.controller");
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
router.get("/all-product-by-category", controller.getProductsByCategory);
router.get("/detail-product/:productId", controller.detailProduct);
router.post("/create-product", upload.array("image"), controller.addProduct);
router.post("/create-option", controller.addOption);

module.exports = router;
