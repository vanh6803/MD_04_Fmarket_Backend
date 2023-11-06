const db  = require('../config/ConnectDB');

const Banner = new db.mongoose.Schema({
    note: { type: String, require: true },
    image: { type: String }
}, {
    timestamps: true,
});

let banner = db.mongoose.model('banner', Banner);

module.exports = {
    banner,
};