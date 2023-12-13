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
  "/create",
  middlware.checkToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  controller.createStore
);
router.put(
  "/update",
  middlware.checkToken,
  middlware.checkStoreExits,
  controller.editStore
);
router.put(
  "/edit-avatar",
  middlware.checkToken,
  middlware.checkStoreExits,
  upload.single("avatar"),
  controller.uploadAvatar
);
router.put(
  "/edit-banner",
  middlware.checkToken,
  middlware.checkStoreExits,
  upload.single("banner"),
  controller.uploadBanner
);
router.get(
  "/info/",
  middlware.checkToken,
  middlware.checkStoreExits,
  controller.detailStore
);
router.get(
  "/check-exiting",
  middlware.checkToken,
  controller.checkExitingStore
);

router.get("/all-store", middlware.checkToken, controller.getAllStore);

router.put(
  "/change-active/:storeId",
  middlware.checkToken,
  controller.changeActiveStore
);
// router.get(
//   "/get-store-id/:accountId",
//   middlware.checkToken,
//   controller.getStoreIdByAccountId
// );
// router.delete("/delete/:storeId", middlware.checkToken, controller.deleteStore);

module.exports = router;
