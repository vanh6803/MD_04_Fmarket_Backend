const { cloudinary } = require("../config/SetupCloudinary");
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
    const data = await model.account.findByIdAndUpdate(uid, dataUpdate, {
      new: true,
    });
    return res
      .status(200)
      .json({ code: 200, data: data, message: "update successful" });
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

    console.log(req.file);
    if (!req.file) {
      return res.status(404).json({ code: 404, message: "file not found" });
    }

    if (user.avatar) {
      const public_id = user.avatar.split(
        "https://res.cloudinary.com/dwxavjnvc/image/upload/"
      );
      await cloudinary.uploader.destroy(public_id);
    }

    let image = req.file.path;
    const data = await model.account.findByIdAndUpdate(
      uid,
      { avatar: image },
      { new: true }
    );
    return res
      .status(200)
      .json({ code: 200, data: data, message: "upload avatar successful" });
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
    const user = req.user;
    if (user.role_id == "customer") {
      return res.status(403).json({
        code: 403,
        message: "You do not have permission to use this function",
      });
    }

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

const changeActiveUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role_id == "customer") {
      return res.status(403).json({
        code: 403,
        message: "You do not have permission to use this function",
      });
    }

    const { uid } = req.params;

    const account = await model.account.findById(uid);

    let active = !account.is_active;

    await model.account.findByIdAndUpdate(uid, { is_active: active });
    return res
      .status(200)
      .json({ code: 200, message: "change active user successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const createAccountStaff = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role_id != "admin") {
      return res.status(403).json({
        code: 403,
        message: "You do not have permission to use this function",
      });
    }
    const { email, password, role_id } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newAccount = await model.account.create({
      email: email,
      password: passwordHash,
      role_id: "staff",
      is_active: true,
      isVerify: true,
    });
    return res
      .status(201)
      .json({ code: 201, result: newAccount, message: "created successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const changeActiveStaff = async (req, res) => {
  try {
    const user = req.user;
    if (user.role_id != "admin") {
      return res.status(403).json({
        code: 403,
        message: "You do not have permission to use this function",
      });
    }
    const { staffId } = req.params;
    const staff = await model.account.findById(staffId);
    if (!staff) {
      return res.status(404).json({ code: 404, message: "not found" });
    }

    if (staff.role_id != "staff") {
      return res
        .status(409)
        .json({ code: 409, message: "account don't staff" });
    }

    await model.account.findByIdAndDelete(staffId);
    return res.status(204).json({ code: 204, message: "account deleted" });
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
  createAccountStaff,
  changeActiveUser,
  changeActiveStaff,
};
