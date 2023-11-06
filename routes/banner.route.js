var express = require("express");
var router = express.Router();
const multer = require("multer");
var bannerController = require("../controllers/banner.controller");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/SetupCloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "banner",
    format: "png",
  },
});

const upload = multer({ storage });

router.get("/get-list", bannerController.list);
router.post("/add", upload.single("image"), bannerController.addBanner); //add
router.put(
  "/edit/:id",
  upload.single("image"),
  bannerController.editBanner
); //edit
router.delete("/delete/:id", bannerController.deleteBanner); //delete

module.exports = router;
