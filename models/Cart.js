var db = require("../config/ConnectDB");

const cartSchema = new db.mongoose.Schema(
  {
    product_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "product" },
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
  },
  {
    timestamps: true,
  }
);

let cart = db.mongoose.model("cart", cartSchema);
module.exports = { cart };
