var db = require("../config/ConnectDB");

const productRateSchema = new db.mongoose.Schema(
  {
    product_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "product" },
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    content: { type: String },
    image: [{ type: String }],
    rate: { type: Number, min: 1, max: 5 },
  },
  {
    timestamps: true,
  }
);

let productRate = db.mongoose.model("productRate", productRateSchema);
module.exports = { productRate };
