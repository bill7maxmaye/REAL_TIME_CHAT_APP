// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const UserModel = require("../models/UserModel");

// //const crypto = require("crypto");

// async function resetPassword(request, response) {
//   const resetToken = request.params.resetToken;
//   // const hashedToken = crypto
//   //   .createHash("sha256")
//   //   .update(resetToken)
//   //   .digest("hex");

//   try {
//     const verify = jwt.verify(resetToken, process.env.JWT_SECRET_KEY);
//     if (!verify) {
//       return response.status(400).json({ message: "Invalid or Expired token" });
//     }
//     const user = await UserModel.findOne({
//       //resetToken: hashedToken,
//       //resetToken: resetToken,
//       resetToken: verify.resetToken,
//       resetTokenExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//       return response
//         .status(400)
//         .json({ message: "*****Invalid or Expired token***" });
//     }

//     const { password } = request.body;
//     // user.name =user.name,
//     // user.email =user.email,
//     user.password = await bcrypt.hash(password, 10);
//     user.resetToken = undefined;
//     user.resetTokenExpire = undefined;
//     await user.save();

//     response.status(200).json({ message: "Password reset successful" });
//   } catch (error) {
//     response.status(500).json({ message: "Server Error" });
//   }
// }

// module.exports = resetPassword;

//===========================================================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

async function resetPassword(request, response) {
  const resetToken = request.params.resetToken;

  try {
    // Verify the JWT token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return response.status(400).json({ message: "Invalid or Expired token" });
    }

    // Find the user by ID and ensure the reset token and expiration are valid
    const user = await UserModel.findOne({
      _id: decoded.id,
      resetToken: resetToken,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return response.status(400).json({ message: "Invalid or Expired token" });
    }

    const { password } = request.body;

    // Hash the new password and save the user
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    response.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    response.status(500).json({ message: "Server Error" });
  }
}

module.exports = resetPassword;
