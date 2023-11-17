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
    let { oldPassword, newPassword } = req.body;
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    // compare password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ code: 401, message: "Incorrect password" });
    }

    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);
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

const allUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageItem = parseInt(req.query.pageItem) || 100000;
    const role = req.query.role;

    const totalUsers = await model.account.countDocuments();
    const totalPages = Math.ceil(totalUsers / pageItem);

    const users = await model.account
      .find(role ? { role_id: role } : null)
      .skip((page - 1) * pageItem)
      .limit(pageItem);
    const result = users.map((user) => {
      return {
        _id: user._id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar: user.avatar,
        role: user.role_id,
        is_active: user.is_active,
      };
    });
    return res.status(200).json({
      code: 200,
      result: result,
      totalPages: totalPages,
      currentPage: page,
      message: "get all success",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const changeActiveUser = (req, res, next) => {
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
  allUser,
};
