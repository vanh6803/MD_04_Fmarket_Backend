var db = require("../config/ConnectDB");

const storeSchema = new db.mongoose.Schema(
  {
    account_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    name: { type: String, required: true },
    avatar: { type: String },
    banner: { type: String },
    address: { type: String },
    is_active: { type: Boolean },
    product: [{ type: db.mongoose.Schema.Types.ObjectId, ref: "product" }],
  },
  {
    timestamps: true,
  }
);

let store = db.mongoose.model("store", storeSchema);
module.exports = { store };
