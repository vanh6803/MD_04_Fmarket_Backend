const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOULDINARY,
  api_secret: process.env.API_SECRET_KEY_CLOULDINARY,
});

module.exports = {
  cloudinary,
};
