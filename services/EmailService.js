const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 587,
  auth: {
    user: "addieljaquez@gmail.com",
    pass: "gzgsngrfojsdcibv",
  },
  tls:{
    rejectUnauthorized: false,
  }
});

module.exports = transporter;