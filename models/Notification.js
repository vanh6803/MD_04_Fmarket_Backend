var db = require("../config/ConnectDB");

const notificationSchema = new db.mongoose.Schema(
  {
    sender_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    receiver_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    content: { type: String },
    status: { type: String, enum: ['unread', 'read'], default: 'unread' },
    type: { type: String, required: true } // msg la tin nhắn cmt là comment
  },
  {
    timestamps: true,
  }
);

let notifi = db.mongoose.model("notification", notificationSchema);
module.exports = { notifi };