var express = require("express");
var router = express.Router();
const controller = require("../controllers/productRate.controller");
var middleware = require("../middleware/auth.middleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/SetupCloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "store",
    format: "png",
  },
});

const upload = multer({ storage });

router.get("/:idProduct", controller.getAllReviewsForProduct);
router.post(
  "/create-review/:idProduct",
  middleware.checkToken,
  upload.single("image"),
  controller.addReview
);
router.put(
  "/update-review/:idComment",
  middleware.checkToken,
  upload.single("image"),
  controller.editReview
);
router.delete(
  "/delete-review/:idComment",
  middleware.checkToken,
  controller.deleteReview
);

module.exports = router;
