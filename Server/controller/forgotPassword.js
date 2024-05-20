const crypto = require("crypto");
const UserModel = require("../models/UserModel");
import sendEmail from "../helpers/sendEmail";
//const jwt = require("jsonwebtoken");

async function forgotPassword(request, response) {
  const { email } = request.body;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; //10 min
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/resetpasssword/${resetToken}`;
    const message = `<h1>You have requested a password reset</h1>
    <p>Please Click On The Following Link To Reset Your Password</p>
    <a href=${resetUrl} clicktracking=off> ${resetUrl}</a>`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    response.status(200).json({ message: "Email Sent" });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = forgotPassword;
