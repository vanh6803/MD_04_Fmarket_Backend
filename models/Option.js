var db = require("../config/ConnectDB");

const optionSchema = new db.mongoose.Schema(
  {
    product_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "product" },
    name_color: { type: String },
    color_code: { type: String },
    image: { type: String },
    ram: { type: Number },
    rom: { type: Number },
    price: { type: Number },
    discount_value: { type: Number },
    quantity: { type: Number },
    soldQuantity: { type: Number, default: 0 },
    hot_option: { type: String },
  },
  { timestamps: true }
);

let option = db.mongoose.model("option", optionSchema);

module.exports = {
  option,
};
