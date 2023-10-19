var db = require("../config/ConnectDB");
let mdCategory = require("../models/Category");

const productSchema = new db.mongoose.Schema(
  {
    store_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "store" },
    category_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "category"},
    name: { type: String },
    image:  { type: String },
    price: { type: Number },
    quantity: { type: Number },
    units_sold: { type: Number },
    discription: { type: String },
    is_active: { type: Boolean },
    status: { type: Number },
  },
  {
    timestamps: true,
  }
);

let product = db.mongoose.model("product", productSchema);
module.exports = { product };
