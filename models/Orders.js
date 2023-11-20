var db = require("../config/ConnectDB");

const orderSchema = new db.mongoose.Schema(
  {
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    productsOrder: [
      {
        option_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "option" },
        quantity: { type: Number },
      },
    ],
    total_price: { type: Number }, //tổng tiền tất cả mặt hàng
    status: {
      type: String,
      enum: ["Chờ xác nhận", "Chờ giao hàng", "Đã giao hàng", "Đã hủy"],
      default: "Chờ xác nhận",
    },
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
