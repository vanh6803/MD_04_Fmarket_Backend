const model = require("../models/Account");

const detailProfile = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const user = await model.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }
    return res
      .status(200)
      .json({ code: 200, data: user, message: "get user success" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const editProfile = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const user = await model.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }
    const dataUpdate = req.body;
    await model.account.findByIdAndUpdate(uid, dataUpdate, { new: true });
    return res
      .status(200)
      .json({ code: 200, data: dataUpdate, message: "update successful" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const uploadAvatar = async (req, res, next) => {
  try {

  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const resetPassword = async (req, res, next) => {
  try {
    
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  detailProfile,
  resetPassword,
  editProfile,
  uploadAvatar,
};
