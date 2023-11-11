var db = require("../config/ConnectDB");

const productSchema = new db.mongoose.Schema(
  {
    store_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "store" },
    category_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "category" },
    name: { type: String },
    description: { type: String },
    status: { type: String , required: true, enum: ["mới", "cũ"]},//mới, cũ
    discounted: { type: Boolean }, //có giảm giá hay không
    is_active: { type: Boolean },
    screen: { type: String },
    camera: { type: String },
    chipset: { type: String },
    cpu: { type: String },
    gpu: { type: String },
    operatingSystem: { type: String },
    battery: { type: String },
    weight: { type: Number },
    connection: { type: String },
    specialFeature: { type: String },
    manufacturer: { type: String },
    other: { type: String },
    option: [{ type: db.mongoose.Schema.Types.ObjectId, ref: "option" }],
    product_review: [{ type: db.mongoose.Schema.Types.ObjectId, ref: "productRate" }]
  },
  {
    timestamps: true,
  }
);

let product = db.mongoose.model("product", productSchema);
module.exports = { product };
