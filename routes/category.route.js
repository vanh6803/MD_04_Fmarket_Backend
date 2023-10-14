var express = require('express');
var router = express.Router();
const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const {cloudinary} = require('../config/SetupCloudinary');

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params: {
        folder: "something",
        format: "png"
    }
});

const upload = multer({ storage });

var categoryController = require('../controllers/category.controller');

router.get('/get-list', categoryController.listCategory);
router.post('/add', 
    upload.single('image'),
    categoryController.addCategory);//add
router.post('/edit/:id',
    upload.single('image'),
    categoryController.editCategory); //edit
router.post('/delete/:id', categoryController.deleteCategory); //delete

module.exports = router;