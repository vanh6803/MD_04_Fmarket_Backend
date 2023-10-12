var db = require("../config/ConnectDB");

const orderSchema = new db.mongoose.Schema(
  {
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    total_price: { type: Number },
    status: { type: Number },
  },
  {
    timestamps: true,
  }
);

let order = db.mongoose.model("order", orderSchema);
module.exports = { order };
