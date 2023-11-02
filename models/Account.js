const db = require("../config/ConnectDB");

const accountSchema = new db.mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    username: { type: String },
    full_name: { type: String },
    phone: { type: String },
    address: { type: String },
    birthday: { type: String },
    token: { type: String },
    isVerify: { type: Boolean, default: false },
    confirmationCode: { type: String },
    confirmationExpiration: { type: Date },
    is_active: { type: Boolean },
    role_id: {
      type: Number,
      required: true,
      default: 0,
    },
    info: [{ type: db.mongoose.Schema.Types.ObjectId, ref: "info" }]
  },
  {
    timestamps: true,
  }
);

let account = db.mongoose.model("account", accountSchema);
module.exports = {
  account,
};
