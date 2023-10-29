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

router.post("/create/:uid", upload.single("image"), controller.createStore);
router.put(
  "/create/:uid/:storeId",
  upload.single("image"),
  controller.editStore
);
router.get("/info/:storeId", middlware.checkToken, controller.detailStore);
router.delete("/delete/:storeId", middlware.checkToken, controller.deleteStore);

module.exports = router;
