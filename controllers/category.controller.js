const e = require('express');
const models = require('../models/Category');  

//product
// [get] /category/get-list
exports.listCategory = async (req, res, next) => {
    await models.category.find()
                        .then(category => {
                            res.json(category)
                        }).catch(next);
};

// [post] /category/add
exports.addCategory = async (req, res, next) => {
  if (req.method == "POST") {

    let obj = new models.category();
    obj.name = req.body.name;
    if(req.file){
      obj.image = req.file.path;
    }else{
      obj.image = "imgage errpr"
    }
    try {
      let newData = await obj.save();
      console.log(newData);
    } catch (error) {
      console.log(error);
    }
  }
};

// [post] /category/edit/:id
exports.editCategory = async (req, res, next) => {

    let id = req.params.id;
    if (req.method == "POST") {
      let obj = new models.category();
      obj.name = req.body.name;
      obj._id = id;
      if(req.file){
        obj.image = req.file.path;
      }else{
        obj.image = "imgage errpr"
      }
  
      try {
        await models.category.findByIdAndUpdate({ _id: id }, obj);
        console.log(newData);
        // res.redirect("layout-list_product");
      } catch (error) {
        console.log(error);
      }
    } else {
        let id = req.params.id;
        let obj = await models.category.findById(id);
        res.render("layout", { obj });
    }
};

// [delete] /category/delete/:id
exports.deleteCategory = async (req, res, next) => {
  let id = req.params.id;

  if(req.method == 'POST'){
    try {
        await models.category.findByIdAndDelete({ _id: id });
      } catch (error) {
        console.log(error);
      }
  }
  

//   res.redirect("layout-list_product");
};