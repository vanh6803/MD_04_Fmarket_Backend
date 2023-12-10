var db = require("../config/ConnectDB");

const messageSchema = new db.mongoose.Schema(
  {
    sender_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account", required: true},
    receiver_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    content: { type: String },
    image: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

let message = db.mongoose.model("message", messageSchema);
module.exports = { message };
