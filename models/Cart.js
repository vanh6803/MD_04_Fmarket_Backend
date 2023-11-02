var db = require("../config/ConnectDB");

const cartSchema = new db.mongoose.Schema(
  {
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    option_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "option" },
    quantity: {type: Number}
  },
  {
    timestamps: true,
  }
);

let cart = db.mongoose.model("cart", cartSchema);
module.exports = { cart };
