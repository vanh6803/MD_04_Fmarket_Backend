var db = require("../config/ConnectDB");

const storeSchema = new db.mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
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
