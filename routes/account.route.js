var express = require("express");
var router = express.Router();
const controller = require("../controllers/account.controller");
const middleware = require("../middleware/auth.middleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/SetupCloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user",
    format: "png",
  },
});

const upload = multer({ storage });

router.get(
  "/detail-profile/:uid",
  middleware.checkToken,
  controller.detailProfile
);
router.put("/edit-profile/:uid", middleware.checkToken, controller.editProfile);
router.put(
  "/change-password/:uid",
  middleware.checkToken,
  controller.resetPassword
);
router.put(
  "/upload-avatar/:uid",
  middleware.checkToken,
  upload.single("avatar"),
  controller.uploadAvatar
);

// router.delete("/delete-account/:uid", middleware.checkToken, controller.deleteAccount)

module.exports = router;
