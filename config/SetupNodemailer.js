const nodemailer = require("nodemailer");

// config transporter
const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_EMAIL,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

module.exports = transporter;
