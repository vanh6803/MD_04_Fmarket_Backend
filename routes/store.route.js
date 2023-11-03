var express = require("express");
var router = express.Router();
const controller = require("../controllers/store.controller");
const middlware = require("../middleware/auth.middleware");
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

const uploadAvatar = multer({ storage });
const uploadBanner = multer({ storage });

router.post(
  "/create/:uid",
  uploadAvatar.single("avatar"),
  uploadBanner.single("banner"),
  controller.createStore
);
router.put(
  "/update/:storeId",
  uploadAvatar.single("avatar"),
  controller.editStore
);
router.put(
  "/upload-banner/:storeId",
  uploadBanner.single("banner"),
  controller.uploadBanner
);
router.get("/info/:storeId", middlware.checkToken, controller.detailStore);
// router.delete("/delete/:storeId", middlware.checkToken, controller.deleteStore);

module.exports = router;
