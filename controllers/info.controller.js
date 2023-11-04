const infoModel = require("../models/Info");
const accountModel = require("../models/Account");

const getInfo = async (req, res, next) => {
  try {
    const uid = req.user._id;
    const user = await accountModel.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "Account not found" });
    }
    const info = await infoModel.info.find({ user_id: uid });
    return res.status(200).json({
      code: 200,
      result: info ? info : [],
      message: "get info successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const addInfo = async (req, res, next) => {
  try {
    const uid = req.user._id;
    if (!uid) {
      return res
        .status(400)
        .json({ code: 400, message: "user id is required" });
    }
    const user = await accountModel.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "Account not found" });
    }
    const { address, phone_number } = req.body;
    if (!address || !phone_number) {
      return res
        .status(400)
        .json({ code: 400, message: "Address and phone are required" });
    }
    const phonePattern = /^(03|05|07|08|09)[0-9]{8}$/;
    if (!phonePattern.test(phone_number)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid phone number" });
    }

    console.log("phone: ", phone_number);

    const exitPhoneNumber = await infoModel.info.findOne({
      phone_number: phone_number,
    });
    console.log("exit: ", exitPhoneNumber);
    if (exitPhoneNumber) {
      console.log("a");
      return res
        .status(409)
        .json({ code: 409, message: "phone number already exists" });
    }

    const data = new infoModel.info({ user_id: uid, address, phone_number });

    await data.save();
    return res
      .status(201)
      .json({ code: 201, message: "created info successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const updateInfo = async (req, res, next) => {
  try {
    const { infoId } = req.params;
    const uid = req.user._id;
    if (!uid) {
      return res
        .status(400)
        .json({ code: 400, message: "user id is required" });
    }
    const user = await accountModel.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "Account not found" });
    }
    const { address, phone_number } = req.body;
    if (!address || !phone_number) {
      return res
        .status(400)
        .json({ code: 400, message: "Address and phone are required" });
    }
    const phonePattern = /^(03|05|07|08|09)[0-9]{8}$/;
    if (!phonePattern.test(phone_number)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid phone number" });
    }

    console.log("phone: ", phone_number);

    const exitPhoneNumber = await infoModel.info.findOne({
      phone_number: phone_number,
    });
    console.log("exit: ", exitPhoneNumber);
    if (exitPhoneNumber) {
      console.log("a");
      return res
        .status(409)
        .json({ code: 409, message: "phone number already exists" });
    }

    await infoModel.info
      .findByIdAndUpdate(infoId, { address, phone_number })
      .then(() => {
        return res
          .status(200)
          .json({ code: 200, message: "update info successfully" });
      })
      .catch(() => {
        return res.status(404).json({ code: 404, message: "info not found" });
      });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const deleteInfo = async (req, res, next) => {
  try {
    const { infoId } = req.params;
    const uid = req.user._id;
    if (!uid) {
      return res
        .status(400)
        .json({ code: 400, message: "user id is required" });
    }
    const user = await accountModel.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "Account not found" });
    }
    await infoModel.info
      .findByIdAndDelete(infoId)
      .then(() => {
        return res
          .status(200)
          .json({ code: 200, message: "delete info successfully" });
      })
      .catch(() => {
        return res.status(404).json({ code: 404, message: "info not found" });
      });
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
