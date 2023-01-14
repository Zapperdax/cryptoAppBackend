const nodeMailer = require("nodemailer");
require("dotenv").config();

const sendOTP = async (otp, email) => {
  let transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP Verification",
    text: "Verify Your OTP",
    html: `${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
    console.log(info);
  });
};

module.exports = sendOTP;
