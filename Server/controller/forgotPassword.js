const { isAsyncFunction } = require("util/types");
const UserModel = require("../models/UserModel");

async function forgotPassword(request, response) {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.generatePasswordReset();
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });

    const mailOptions = {
      to: user.email,
      from: "your-email@gmail.com",
      subject: "Password Reset",
      text: `Please click on the following link, or paste it into your browser to complete the process:\n\nhttp://${req.headers.host}/reset-password/${user.resetPasswordToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "Reset password email sent" });
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = forgotPassword;
