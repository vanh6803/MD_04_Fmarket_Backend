var db = require("../config/ConnectDB");

const orderSchema = new db.mongoose.Schema(
  {
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    product: [
      {
        option: { type: db.mongoose.Schema.Types.ObjectId, ref: "option" },
        quantity: { type: Number },
        price: { type: Number }, //tiền  x sản phẩm
      },
    ],
    total_price: { type: Number }, //tổng tiền tất cả mặt hàng
    status: { type: Number },
    info_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "info",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let order = db.mongoose.model("order", orderSchema);
module.exports = { order };
