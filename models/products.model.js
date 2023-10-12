var db = require('../config/ConnectDB');

const productSchema = new db.mongoose.Schema(
    {
        store_id:{type: db.mongoose.Schema.Types.ObjectId, ref: 'storeModel'},
        category_id:{type: db.mongoose.Schema.Types.ObjectId, ref: 'categoriesModel'},
        name:{type: String},
        image:{type: String},
        price:{type: Number},
        quantity:{type: Number},
        units_sold:{type: Number},
        discription:{type: String},
        is_active:{type: Boolean},
        status:{type: Number},
        created_at: {type: Date, required: true, default: Date.now},
        update_at: {type: Date, required: true, default: Date.now}
    },
    {
        collection: 'products'
    }
)

let productModel = db.mongoose.model('productsModel', productSchema);
module.exports = {productModel}