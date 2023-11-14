var db = require("../config/ConnectDB");

const infoSchema = new db.mongoose.Schema(
  {
    user_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String, required: true },
    checked: { type: Boolean, default: false}
  },
  {
    timestamps: true,
  }
);

let info = db.mongoose.model("info", infoSchema);
module.exports = { info };
