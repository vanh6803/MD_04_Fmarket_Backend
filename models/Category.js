const db  = require('../config/ConnectDB');

const Category = new db.mongoose.Schema({
    name: { type: String, require: true },
    image: { type: String },
}, {
    timestamps: true,
});

let category = db.mongoose.model('category', Category);

module.exports = {
    category,
};