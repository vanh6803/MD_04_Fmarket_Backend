var db = require("../config/ConnectDB");

const billHistorySchema = new db.mongoose.Schema(
  {
    order_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "order" },
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
  },
  {
    timestamps: true,
  }
);

let billHistory = db.mongoose.model("billHistory", billHistorySchema);
module.exports = { billHistory };
