const db = require("../config/ConnectDB");

const roleSchema = new db.mongoose.Schema(
  {
    name: { type: String, required: true },
    discription: { type: String },
  },
  {
    timestamps: true,
  }
);

let role = db.mongoose.model("role", roleSchema);
module.exports = {
  role,
};
