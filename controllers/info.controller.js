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
// Create new info
const createInfo = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const { name, address, phone_number, checked } = req.body;

    // If checked is true, update other info items for the user to false
    if (checked) {
      await infoModel.info.updateMany(
        { user_id },
        { $set: { checked: false } }
      );
    }

    const newInfo = new infoModel.info({
      user_id,
      name,
      address,
      phone_number,
      checked: checked || false,
    });

    await newInfo.save();
    res.status(201).json({
      code: 201,
      message: "Info created successfully!",
    });
  } catch (error) {
    console.error("Error in createInfo:", error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
};

// Update info by user ID
const updateInfoByUserId = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const updateData = req.body;
    const { infoId } = req.params;

    // If checked is true, update other info items for the user to false
    if (updateData.checked) {
      await infoModel.info.updateMany(
        { user_id: user_id },
        { $set: { checked: false } }
      );
    }

    const updatedInfo = await infoModel.info.findByIdAndUpdate(
      { _id: infoId },
      updateData,
      { new: true }
    );

    if (!updatedInfo) {
      return res.status(404).json({ code: 404, message: "Info not found" });
    }

    res.status(200).json({
      code: 200,
      message: "Info updated successfully!",
    });
  } catch (error) {
    console.error("Error in updateInfoByUserId:", error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
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
  createInfo,
  updateInfoByUserId,
  deleteInfo,
};
