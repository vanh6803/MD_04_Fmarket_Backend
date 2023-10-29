const storeModel = require("../models/Store");
const accountModel = require("../models/Account");

const createStore = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const user = await accountModel.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "Account not found" });
    }
    let { name, image, address } = req.body;
    if (req.file) {
      image = req.file.path;
    }
    const newStore = new storeModel.store({
      user_id: uid,
      name: name,
      address: address,
      image: image,
      is_active: true,
    });
    await newStore.save();
    return res
      .status(201)
      .json({ code: 201, message: "created store successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const editStore = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const storeId = req.params.storeId;
    const user = await accountModel.account.findById(uid);
    if (!user) {
      return res.status(404).json({ code: 404, message: "Account not found" });
    }

    const store = await storeModel.store.findById(storeId);
    if (!store) {
      return res.status(404).json({ code: 404, message: "Store not found" });
    }

    let { name, image, address } = req.body;
    if (req.file) {
      image = req.file.path;
    }

    await storeModel.store.findByIdAndUpdate(
      storeId,
      {
        name: name,
        address: address,
        image: image,
      },
      { new: true }
    );
    return res
      .status(201)
      .json({ code: 201, message: "update store successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const detailStore = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const store = await storeModel.store.findById(storeId).populate("user_id");
    if (!store) {
      return res.status(404).json({ code: 404, message: "Store not found" });
    }
    return res
      .status(200)
      .json({ code: 200, data: store, message: "get store successfully" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const deleteStore = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const store = await storeModel.store.findById(storeId);
    if (!store) {
      return res.status(404).json({ code: 404, message: "Store not found" });
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

module.exports = {
  createStore,
  detailStore,
  deleteStore,
  editStore,
};
