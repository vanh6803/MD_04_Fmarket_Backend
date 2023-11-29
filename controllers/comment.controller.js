const commentModel = require('../models/Comment');
const accountModel = require('../models/Account');
const productModel = require('../models/Products');

const dataProcessing = async (cmt) => {
    try {
        if(cmt){
            let obj = new commentModel.comment(cmt);
            await obj.save();
        }else{
            console.log('no data');
        }
    } catch (error) {
        console.log(error);
    }
}

const getCommentsByProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const comments = await commentModel.comment.find({ product_id: productId });
        if (!comments) {
            return res.status(404).json({ code: 404, message: "Product not found" });
        }
      
        const result = await Promise.all(comments.map(async (comment) => {
            const account = await accountModel.account.findOne({ _id: comment.account_id });
            return {
                comment,
                account
            }
        }));

        return res.status(200).json({
            code: 200,
            result: result,
            message: "Get people list message successfully",
        });
        
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message });
    }
}

module.exports = {
    getCommentsByProduct,
    dataProcessing
}