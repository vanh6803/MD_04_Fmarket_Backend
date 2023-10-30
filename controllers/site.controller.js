const model = require("../models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendEmail,
  generateConfirmationCode,
  generateExpirationTime,
} = require("../utils/NodemailerService");

function generateUsername(email) {
  const atIndex = email.indexOf("@");
  if (atIndex !== -1) {
    return email.slice(0, atIndex);
  } else {
    // Xử lý trường hợp email không có ký tự '@'
    return email;
  }
}

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(`email: ${email}, password: ${password}`);

    //validate email password
    if (!email || !password) {
      return res
        .status(400)
        .json({ code: 400, message: "Email and password are required" });
    }

    // check email existing
    const existingUser = await model.account.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ code: 401, message: "Email already exists", isExit: true });
    }

    // create new account and hash password
    const newAccount = new model.account({
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    newAccount.password = await bcrypt.hash(password, salt);

    const confirmationCode = generateConfirmationCode();

    newAccount.confirmationCode = confirmationCode;
    newAccount.confirmationExpiration = generateExpirationTime();

    const username = generateUsername(email);
    newAccount.username = username;

    await newAccount.save();

    sendEmail(
      email,
      "Confirmation Code",
      `Your confirmation code: ${confirmationCode}`,
      (error, response) => {
        if (error) {
          console.error("error - send email - register: ", error.message);
          return res.status(400).json({ code: 400, message: error.message });
        }
        console.log("response: ", response);
        return res.status(200).json({
          code: 200,
          message:
            "Gửi lại mã xác nhận thành công, vui lòng kiểm tra email để xác nhận",
        });
      }
    );
  } catch (error) {
    console.error("error - register: ", error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validate email password
    if (!email || !password) {
      return res
        .status(400)
        .json({ code: 400, message: "Email and password are required" });
    }

    //find account
    const user = await model.account.findOne({ email });

    if (!user) {
      return res.status(404).json({ code: 404, message: "Email not found" });
    }

    if (user.isVerify == false) {
      return res
        .status(401)
        .json({ code: 401, message: "Unauthenticated email", isVerify: false });
    }

    // compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ code: 401, message: "Incorrect password" });
    }

    // if password matches, create a new token
    const token = jwt.sign({ userId: user._id }, process.env.KEY_TOKEN);

    // update token to db
    user.token = token;
    await user.save();

    // return token
    return res
      .status(201)
      .json({ code: 201, token, message: "login successful" });
  } catch (error) {
    console.error("error - login: ", error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const logout = async (req, res, next) => {
  try {
    // find user
    const user = await model.account.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    if (user.confirm_email == false) {
      return res
        .status(401)
        .json({ code: 401, message: "Unauthenticated email", isVerify: false });
    }

    // remove token
    user.token = null;

    await user.save();

    return res.status(200).json({ code: 200, message: "Logout successful" });
  } catch (error) {
    console.error("error - logout: ", error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const verifyEmail = async (req, res, next) => {
  try {
    const { code } = req.params;

    const user = await model.account.findOne({ confirmationCode: code });

    if (!user) {
      return res
        .status(400)
        .json({ code: 400, message: "Mã xác nhận không hợp lệ" });
    }

    const now = new Date();
    if (now > user.confirmationExpiration) {
      return res
        .status(400)
        .json({ code: 400, message: "Mã xác nhận đã hết hạn" });
    }

    user.isVerify = true;
    user.confirmationCode = null;
    user.confirmationExpiration = null;

    await user.save();

    return res
      .status(200)
      .json({ code: 200, message: "Xác nhận email thành công" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const resendConfirmationCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ code: 400, message: "Email requied" });
    }

    const existingUser = await model.account.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ code: 404, message: "not found" });
    }

    if (existingUser.isVerify) {
      return res.status(400).json({ code: 400, message: "Email is verify" });
    }

    const confirmationCode = generateConfirmationCode();

    existingUser.confirmationCode = confirmationCode;
    existingUser.confirmationExpiration = generateExpirationTime();

    await existingUser.save();

    sendEmail(
      email,
      "Confirmation Code",
      `Your confirmation code: ${confirmationCode}`,
      (error, response) => {
        if (error) {
          console.error(error.message);
          return res.status(400).json({ code: 400, message: error.message });
        }
        console.log("response: ", response);
        return res.status(200).json({
          code: 200,
          message: "Confirmation code resend successfully",
        });
      }
    );
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const loginWithGoogle = async (req, res, next) => {}

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resendConfirmationCode,
};
