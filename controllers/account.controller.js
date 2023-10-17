const model = require("../models/Account");
const bcrypt = require("bcrypt");

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
    return res.status(200).json({ code: 200, message: "update successful" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const uploadAvatar = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const user = await model.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }
    let image;
    if (req.file) {
      image = req.file.path;
    }
    await model.account.findByIdAndUpdate(
      uid,
      { avatar: image },
      { new: true }
    );
    return res
      .status(200)
      .json({ code: 200, message: "upload avatar successful" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const user = await model.account.findById(uid);
    let {oldPassword, newPassword} = req.body
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    // compare password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ code: 401, message: "Incorrect password" });
    }

    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt) 
    await model.account.findByIdAndUpdate(
      uid,
      { password: newPassword },
      { new: true }
    );
    return res
      .status(200)
      .json({ code: 200, message: "update password successful" });
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
