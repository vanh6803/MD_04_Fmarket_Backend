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
router.get("/topProduct", controller.getTopProduct);
//product
router.post(
  "/create-product",
  middleware.checkToken,
  middleware.checkStoreExits,
  controller.addProduct
);
router.put(
  "/update-product/:productId",
  middleware.checkToken,
  middleware.checkStoreExits,
  controller.updateProduct
);

router.put(
  "/change-active-product/:productId",
  middleware.checkToken,
  controller.changeActiveProduct
);

//option
router.post(
  "/create-option",
  middleware.checkToken,
  middleware.checkStoreExits,
  upload.single("image"),
  controller.addOption
);
router.put(
  "/update-option/:optionId",
  middleware.checkToken,
  middleware.checkStoreExits,
  controller.updateOption
);

router.put(
  "/update-option-image/:optionId",
  middleware.checkToken,
  middleware.checkStoreExits,
  upload.single("image"),
  controller.updateImageOption
);

router.delete(
  "/delete-option/:optionId",
  middleware.checkToken,
  controller.deleteOption
);
router.delete(
  "/delete-product/:productId",
  middleware.checkToken,
  controller.deleteProduct
);

module.exports = router;
