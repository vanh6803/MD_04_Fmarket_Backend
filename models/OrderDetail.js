var db = require("../config/ConnectDB");

const orderDetailSchema = new db.mongoose.Schema(
  {
    order_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "order" },
    product_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "product" },
    unit_price: { type: Number},
    amount: { type: Number },
  },
  {
    timestamps: true,
  }
);

let orderDetail = db.mongoose.model("orderDetail", orderDetailSchema);
module.exports = { orderDetail };
