const transporter = require("../config/SetupNodemailer");

// send confirm code to email user
const sendEmail = (to, subject, text, callback) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions);
};
// Confirmation code generator (5 chars)
function generateConfirmationCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}
// The function generates the expiration time for the confirmation code (60 seconds)
function generateExpirationTime() {
  const expirationTime = new Date();
  expirationTime.setSeconds(expirationTime.getSeconds() + 60);
  return expirationTime;
}

module.exports = {
  sendEmail,
  generateExpirationTime,
  generateConfirmationCode,
};
