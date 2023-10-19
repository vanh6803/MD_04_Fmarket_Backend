let md = require('../models/Products');

const list = async (req, res, next) => {
    try {
        // get list data and ref category
        let listProduct = await md.product.find().sort({_id: -1}).populate("category_id");

        if (listProduct) {
            res.status(200).json({
                status: 200,
                message: 'Get data successfully!',
                data: listProduct
            });
        } else {
            res.status(204).json({
                status: 204,
                message: 'No data!'
            });
        }
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
}

const create = async (req, res, next) => {
    try {
        let image = req.file.path;

        let {
            store_id,
            category_id,
            name,
            price,
            quantity,
            units_sold,
            discription,
            is_active,
            status
        } = req.body;

        let objProduct = new md.product({
            store_id,
            category_id,
            name,
            price,
            quantity,
            units_sold,
            discription,
            is_active,
            status,
            image
        });

        // save data
        await objProduct.save();

        res.status(200).json({
            code: 200,
            message: 'Added data successfully!',
        });

    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
}

const update = async (req, res, next) => {
    try {
        try {
            let uid = req.params.uid;
            let objProduct = await md.product.findById(uid); // ko tìm thấy id thì error
            let productUpdate = req.body;
            console.log(objProduct);
            console.log(productUpdate);
            await md.product.findByIdAndUpdate({_id: uid}, productUpdate, {new: true});
            res.status(200).json({
                code: 200,
                message: "Update successful product!"
            });
        } catch (error) {
            res.status(404).json({
                code: 404,
                message: "Not found product!"
            });
        }
        
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
}

const remove = async (req, res, next) => {
    try {
        let uid = req.params.uid;
        let productRemove = await md.product.findByIdAndDelete({_id: uid});
        if(productRemove) {
            res.status(200).json({
                code: 200,
                message: "Delete successful product!"
            });    
        } else {
            res.status(404).json({
                code: 404,
                message: "Not found product!"
            });   
        }
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
}


module.exports = {
    list,
    create,
    update,
    remove
}