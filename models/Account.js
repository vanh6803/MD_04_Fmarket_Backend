const db = require("../config/ConnectDB");

const accountSchema = new db.mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    username: { type: String },
    full_name: { type: String },
    birthday: { type: String },
    token: { type: String },
    isVerify: { type: Boolean, default: false },
    confirmationCode: { type: String },
    confirmationExpiration: { type: Date },
    is_active: { type: Boolean, default: true },
    role_id: {
      type: String,
      enum: ["admin", "customer", "staff"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

let account = db.mongoose.model("account", accountSchema);
module.exports = {
  account,
};
