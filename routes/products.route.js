var express = require('express');
var router = express.Router();
var productsController = require('../controllers/products.controller');
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/SetupCloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ProductImage",
    format: "png",
  },
});
const upload = multer({ storage });
router.get('/', productsController.list)
router.post('/create', upload.single("image"), productsController.create);

router.put('/update/:uid', upload.single("image"), productsController.update);

router.delete('/delete/:uid', productsController.remove);

router.get('/detail/:uid', productsController.detail);

module.exports = router;