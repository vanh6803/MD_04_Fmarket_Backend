var db = require("../config/ConnectDB");

const infoSchema = new db.mongoose.Schema(
  {
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    address: {type: String},
    phone_number: {type: String},
  },
  {
    timestamps: true,
  }
);

let info = db.mongoose.model("info", infoSchema);
module.exports = { info };
