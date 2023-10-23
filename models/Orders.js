var db = require("../config/ConnectDB");
let mdAccount = require("../models/Account");

const orderSchema = new db.mongoose.Schema(
  {
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    address: {type: String},
    phone_number: {type: String},
    total_price: { type: Number },
    status: { type: Number },
  },
  {
    timestamps: true,
  }
);

let order = db.mongoose.model("order", orderSchema);
module.exports = { order };
