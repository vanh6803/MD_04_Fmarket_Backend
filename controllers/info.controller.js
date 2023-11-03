const infoModel = require("../models/Info");
const accountModel = require("../models/Account");

const getInfo = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await accountModel.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "Account not found" });
    }
    const info = await infoModel.info.findOne({ user_id: uid });
    return res.status(200).json({
      code: 200,
      result: info,
      message: "get info successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
// const addInfo = async (req, res, next) => {
//   try {
//     const uid = req.user._id;
//     const user = await accountModel.account.findById(uid);
//     if (!user) {
//       return res.status(404).json({ code: 404, message: "Account not found" });
//     }
    
//   } catch (error) {
//     return res.status(500).json({ code: 500, message: error.message });
//   }
// };
const updateInfo = async (req, res, next) => {
  try {
    const uid = req.user._id;
    const user = await accountModel.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "Account not found" });
    }
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const deleteInfo = async (req, res, next) => {
  try {
    const uid = req.user._id;
    const user = await accountModel.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "Account not found" });
    }
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  getInfo,
  addInfo,
  updateInfo,
  deleteInfo,
};
