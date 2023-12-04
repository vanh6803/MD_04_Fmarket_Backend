const model = require("../models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
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

function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

const register = async (req, res, next) => {
  try {
    const { email, password, role_id } = req.body;

    console.log(`email: ${email}, password: ${password}`);

    //validate email password
    if (!email || !password) {
      return res
        .status(400)
        .json({ code: 400, message: "Email and password are required" });
    }

    const salt = await bcrypt.genSalt(10);
    // check email existing
    const existingUser = await model.account.findOne({ email });
    if (existingUser) {
      console.log("Email already exists");
      if (existingUser.isVerify == false) {
        console.log("email don't verify");
        let newPassword = await bcrypt.hash(password, salt);
        let newConfirmationCode = generateConfirmationCode();
        let newConfirmationExpiration = generateExpirationTime();
        await model.account.findByIdAndUpdate(existingUser._id, {
          password: newPassword,
          confirmationCode: newConfirmationCode,
          confirmationExpiration: newConfirmationExpiration,
        });

        sendEmail(
          email,
          "Confirmation Code",
          `Your confirmation code: ${newConfirmationCode}`
        );
        return res.status(200).json({
          code: 200,
          message:
            "Email already exists, resend confirmation code successfully",
        });
      }

      return res
        .status(409)
        .json({ code: 409, message: "Email already exists", isExit: true });
    }

    // create new account and hash password
    const newAccount = new model.account({
      email,
      password,
      is_active: true,
      role_id: role_id,
    });

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
      `Your confirmation code: ${confirmationCode}`
    );
    return res.status(200).json({
      code: 200,
      message: "Send confirm code successfully, please check your email",
    });
  } catch (error) {
    console.error("error - register: ", error.message);
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    const userAgent = req.headers["user-agent"];

    // Kiểm tra platform
    const isMobile = userAgent.includes("Mobile");
    let platform;
    if (isMobile) {
      console.log("Client là mobile");
      platform = "Mobile";
    } else {
      console.log("Client là web");
      platform = "Web";
    }

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

    if(user.is_active == false){
      return res.status(403).json({ code: 403, message: "your account is inactive"})
    }

    // compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ code: 401, message: "Incorrect password" });
    }

    // if password matches, create a new token
    const token = jwt.sign({ userId: user._id }, process.env.KEY_TOKEN, {
      expiresIn: "14d",
    });

    // update token to db
    user.token = token;
    await user.save();

    // return token
    return res.status(200).json({
      code: 200,
      token,
      message: "login successful",
      role: user.role_id,
    });
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
      `Your confirmation code: ${confirmationCode}`
    );
    return res.status(200).json({
      code: 200,
      message: "Confirmation code resend successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const loginWithGoogle = async (req, res, next) => {
  // The token you received from the Android app
  const idToken = req.body.idToken; //token của google trả về

  if (!idToken) {
    return res
      .status(400)
      .json({ code: 400, message: "Google ID token is required" });
  }
  const client = new OAuth2Client(process.env.CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID, // Your Google Client ID for the web application
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    const existingUser = await model.account.findOne({ email });
    if (existingUser) {
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.KEY_TOKEN
      );
      existingUser.token = token;
      await existingUser.save();
      return res
        .status(200)
        .json({ code: 200, token, message: "Login successful" });
    } else {
      const username = name;
      const password = generateRandomPassword(12);

      const newUser = new model.account({
        email,
        password,
        username,
        isVerify: true,
        is_active: true,
      });

      // Save the new user to the database
      await newUser.save();

      // Perform the login logic for the new user and return a token
      const token = jwt.sign({ userId: newUser._id }, process.env.KEY_TOKEN);
      newUser.token = token;
      await newUser.save();
      return res.status(200).json({
        code: 200,
        token,
        message: "Login successful",
        isNewAccount: true,
      });
    }
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

// todo: chỉ dành cho đăng nhập với google
const createNewPassword = async (req, res, next) => {
  try {
    let { password } = req.body;

    if (!password) {
      return res.status(400).json({ code: 400, message: "passsword requied" });
    }

    const uid = req.user._id;

    const salt = await bcrypt.genSalt(10);
    let passwordHash = await bcrypt.hash(password, salt);

    await model.account
      .findByIdAndUpdate(uid, { password: passwordHash })
      .then(() => {
        return res.status(200).json({
          code: 201,
          message: "create new password successfully",
        });
      })
      .catch(() => {
        return res
          .status(400)
          .json({ code: 400, message: "Account not found" });
      });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ code: 400, message: "email requied" });
    }
    const user = await model.account.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ code: 400, message: "Account not found" });
    }
    const newPassword = generateRandomPassword(12);

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // save new password
    user.password = hashedPassword;
    await user.save();

    sendEmail(email, "New password", `New password for you: ${newPassword}`);
    return res.status(200).json({
      code: 200,
      message: "New pasword in your email ",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resendConfirmationCode,
  forgotPassword,
  loginWithGoogle,
  createNewPassword,
};
