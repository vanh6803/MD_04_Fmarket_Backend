const db  = require('../config/ConnectDB');

const Comment = new db.mongoose.Schema({
    account_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    product_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "product" },
    content: { type: String, require: true },
    image: { type: String }
}, {
    timestamps: true,
});

let comment = db.mongoose.model('comment', Comment);

module.exports = {
    comment,
};