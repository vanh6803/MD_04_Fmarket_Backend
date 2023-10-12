var db = require("../config/ConnectDB");

const productRateSchema = new db.mongoose.Schema(
  {
    product_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "product" },
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    content: { type: String },
    image: { type: String },
    price: { type: Number },
    rate: { type: Number },
  },
  {
    timestamps: true,
  }
);

let productRate = db.mongoose.model("productRate", productRateSchema);
module.exports = { productRate };
