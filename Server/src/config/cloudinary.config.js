require("dotenv").config();
const cloudinary = require("cloudinary").v2;

console.log(process.env.CLOUD_NAME , "llll");


cloudinary.config({
    cloud_name : `${process.env.CLOUD_NAME}`,
    api_key : `${process.env.CLOUDINARY_API_KEY}`,
    api_secret : `${process.env.CLOUDINARY_SECRET_KEY}`
});

module.exports = cloudinary;