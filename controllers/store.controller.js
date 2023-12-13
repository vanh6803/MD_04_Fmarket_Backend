const storeModel = require("../models/Store");
const accountModel = require("../models/Account");

const createStore = async (req, res, next) => {
  try {
    const uid = req.user._id;
    const user = await accountModel.account.findById(uid);
    if (!user) {
      return res
        .status(404)
        .json({ code: 404, message: "tài khoản không tồn tại" });
    }
    const exitingStore = await storeModel.store.findOne({ account_id: uid });
    if (exitingStore) {
      return res
        .status(409)
        .json({ code: 409, message: "cửa hàng này đã tồn tại" });
    }
    let { name, address } = req.body;
    let avatar;
    let banner;
    console.log(req.files);
    if (req.files) {
      avatar = req.files["avatar"][0].path;
      banner = req.files["banner"][0].path;
    }

    const newStore = new storeModel.store({
      account_id: uid,
      name: name,
      address: address,
      avatar: avatar,
      banner: banner,
      is_active: true,
    });
    await newStore.save();
    return res
      .status(201)
      .json({ code: 201, message: "tạo cửa hàng thành công" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const editStore = async (req, res, next) => {
  try {
    const storeId = req.store._id;
    const store = await storeModel.store.findById(storeId);
    if (!store) {
      return res
        .status(404)
        .json({ code: 404, message: "không tìm thấy cửa hàng" });
    }

    let { name, address } = req.body;

    await storeModel.store.findByIdAndUpdate(
      storeId,
      {
        name: name,
        address: address,
      },
      { new: true }
    );
    return res
      .status(201)
      .json({ code: 201, message: "chỉnh sửa thông tin cửa hàng thành công" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const detailStore = async (req, res, next) => {
  try {
    const storeId = req.store._id;
    const store = await storeModel.store
      .findById(storeId)
      .populate("account_id");
    if (!store) {
      return res
        .status(404)
        .json({ code: 404, message: "không tìm thấy cửa hàng" });
    }
    const result = {};
    return res
      .status(200)
      .json({ code: 200, data: store, message: "get store successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const uploadBanner = async (req, res, next) => {
  try {
    const storeId = req.store._id;
    var banner;
    if (req.file) {
      banner = req.file.path;
    }
    await storeModel.store
      .findByIdAndUpdate(storeId, { banner: banner }, { new: true })
      .then(() => {
        return res
          .status(200)
          .json({ code: 200, message: "update banner successfully" });
      })
      .catch(() => {
        return res
          .status(404)
          .json({ code: 404, message: "không tìm thấy cửa hàng" });
      });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const storeId = req.store._id;
    var avatar;
    if (req.file) {
      avatar = req.file.path;
    }
    await storeModel.store
      .findByIdAndUpdate(storeId, { avatar: avatar }, { new: true })
      .then(() => {
        return res
          .status(200)
          .json({ code: 200, message: "update avatar successfully" });
      })
      .catch(() => {
        return res
          .status(404)
          .json({ code: 404, message: "không tìm thấy cửa hàng" });
      });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const deleteStore = async (req, res, next) => {
  try {
    const storeId = req.store._id;
    const store = await storeModel.store.findById(storeId);
    if (!store) {
      return res
        .status(404)
        .json({ code: 404, message: "không tìm thấy cửa hàng" });
    }
    await storeModel.store
      .findByIdAndDelete(storeId)
      .then(() => {
        console.log("delete success");
        return res.status(200).json({ code: 200, message: "delete success" });
      })
      .catch((error) => {
        return res.status(400).json({ code: 400, message: "delete fail" });
      });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const checkExitingStore = async (req, res, next) => {
  try {
    const uid = req.user._id;
    const exitingStore = await storeModel.store.findOne({ account_id: uid });
    if (exitingStore) {
      return res.status(409).json({
        code: 409,
        message: "cửa hàng này đã tồn tại",
        isExiting: true,
      });
    }
    return res.status(200).json({
      code: 200,
      message: "cửa hàng này chưa tồn tại",
      isExiting: false,
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getStoreIdByAccountId = async (req, res, next) => {
  try {
    const accountId = req.params.accountId;
    const store = await storeModel.store.findOne({ account_id: accountId });
    if (!store) {
      return res
        .status(404)
        .json({ code: 404, message: "không tìm thấy cửa hàng" });
    }
    return res.status(200).json({
      code: 200,
      data: store._id,
      message: "get id store successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const getAllStore = async (req, res) => {
  try {
    const stores = await storeModel.store.find().populate("account_id");
    return res.status(200).json({
      code: 200,
      data: stores,
      message: "get all stores successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const changeActiveStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const user = req.user._id;
    if (!user.role_id == "admin" || !user.role_id == "staff") {
      return res.status(403).json({
        code: 403,
        message: "You do not have permission to use this function",
      });
    }
    const store = await storeModel.store.findById(storeId);
    if (!store) {
      return res.status(404).json({ code: 404, message: "Store not found" });
    }
    let active = !store.is_active;
    await storeModel.store.findByIdAndUpdate(storeId, { is_active: active });
    return res
      .status(200)
      .json({ code: 200, message: "change active product successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  createStore,
  detailStore,
  deleteStore,
  editStore,
  uploadBanner,
  uploadAvatar,
  checkExitingStore,
  getStoreIdByAccountId,
  getAllStore,
  changeActiveStore,
};
