const model = require("../models/Account");
const jwt = require("jsonwebtoken");
const storeModel = require("../models/Store");

const checkToken = async (req, res, next) => {
  let header_token = req.header("Authorization");
  if (typeof header_token == "undefined" || typeof header_token == null) {
    return res.status(403).json({ message: "unknown token" });
  }

  const token = header_token.replace("Bearer ", "");

  try {
    const data = jwt.verify(token, process.env.KEY_TOKEN);
    const user = await model.account.findById({ _id: data.userId });
    if (!user) {
      throw new Error("unknown user");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token has expired" });
    }
    console.error(error);
    res.status(401).json({ code: 401, message: error.message });
  }
};

const checkStoreExits = async (req, res, next) => {
  try {
    const uid = req.user._id;
    const store = await storeModel.store.findOne({ account_id: uid });
    if (!store) {
      return res.status(409).json({
        code: 409,
        message: "cửa hàng này chưa tồn tại",
        isExiting: true,
      });
    }
    if (store.is_active == false) {
      return res
        .status(403)
        .json({ code: 403, message: "your store is not active" });
    }
    req.store = store;
    next();
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  checkToken,
  checkStoreExits,
};
