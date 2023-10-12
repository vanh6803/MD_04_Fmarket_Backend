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
    confirm_email: { type: Boolean },
    is_active: { type: Boolean },
    role_id: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "role",
      required: true,
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

