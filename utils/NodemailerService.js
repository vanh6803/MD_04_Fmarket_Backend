const transporter = require("../config/SetupNodemailer");

const sendEmail = (to, subject, text, callback) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error);
    } else {
      callback(null, "Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
