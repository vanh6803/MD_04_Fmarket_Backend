var express = require("express");
var router = express.Router();
const multer = require("multer");
var middleware = require("../middleware/auth.middleware");
var categoryController = require("../controllers/category.controller");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/SetupCloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "categories",
    format: "png",
  },
});

const upload = multer({ storage });

router.get("/get-list", categoryController.listCategory);
router.post(
  "/add",
  middleware.checkToken,
  upload.single("image"),
  categoryController.addCategory
); //add
router.put(
  "/edit/:id",
  middleware.checkToken,
  upload.single("image"),
  categoryController.editCategory
); //edit
router.delete(
  "/delete/:id",
  middleware.checkToken,
  categoryController.deleteCategory
); //delete

module.exports = router;
