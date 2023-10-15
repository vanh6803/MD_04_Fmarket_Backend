const express = require('express');
const models = require('../models/Category');  

//product
// [get] /category/get-list
const listCategory = async (req, res, next) => {
  try {
    const category = await models.category.find();
    if(!category){
      return res.status(404).json({ code: 404, message: "no data  " });
    }
    return res.status(200)
        .json({ code: 200, data: category, message: "get data successfully!" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [post] /category/add
const addCategory = async (req, res, next) => {
  try {
    if (req.method == "POST") {
      let obj = new models.category();
      obj.name = req.body.name;
      if(req.file){
        obj.image = req.file.path;
      }else{
        return res.status(500).json({ code: 500, message: 'no file uploaded!' });
      }

      await obj.save();
      return res.status(200).json({ code: 200, message: "add successfully!" });
    }
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [post] /category/edit/:id
const editCategory = async (req, res, next) => {
  try {
    let id = req.params.id;
    if (req.method == "POST") {
      let obj = new models.category();
      obj.name = req.body.name;
      obj._id = id;

      if(req.file){
        obj.image = req.file.path;
      }else{
        return res.status(500).json({ code: 500, message: 'no file uploaded!' });
      }

      await models.category.findByIdAndUpdate({ _id: id }, obj);
      return res.status(200).json({ code: 200, message: "update successfully!" });
      // res.redirect("layout-list_product");
     
    } else {
        let id = req.params.id;
        let obj = await models.category.findById(id);
        // res.render("layout", { obj });
    }
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// [delete] /category/delete/:id
const deleteCategory = async (req, res, next) => {
  try {
    let id = req.params.id;

    await models.category.findByIdAndDelete({ _id: id });
    return res.status(200).json({ code: 200, message: "delete successfully!" });
    
    //   res.redirect("layout-list_product");
  }catch(error){
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  listCategory,
  addCategory,
  editCategory,
  deleteCategory
}