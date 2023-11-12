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

const upload = multer({ storage });

router.post(
  "/create/:uid",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  controller.createStore
);
router.put("/update/:storeId", controller.editStore);
router.put(
  "/edit-avatar/:storeId",
  upload.single("avatar"),
  controller.uploadAvatar
);
router.put(
  "/edit-banner/:storeId",
  upload.single("banner"),
  controller.uploadBanner
);
router.get("/info/:storeId", middlware.checkToken, controller.detailStore);
router.get("/check-exiting", middlware.checkToken, controller.checkExitingStore);
// router.delete("/delete/:storeId", middlware.checkToken, controller.deleteStore);

module.exports = router;
