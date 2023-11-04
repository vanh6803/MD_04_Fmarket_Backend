var express = require("express");
var router = express.Router();
const controller = require("../controllers/site.controller");
const middlware = require("../middleware/auth.middleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/login-with-google", controller.loginWithGoogle);
router.get("/logout", middlware.checkToken, controller.logout);
router.get("/verify/:code", controller.verifyEmail);
router.post("/resend-code", controller.resendConfirmationCode);
router.post("/forgot-password", controller.forgotPassword);
router.put(
  "/create-new-password",
  middlware.checkToken,
  controller.createNewPassword
);

module.exports = router;
