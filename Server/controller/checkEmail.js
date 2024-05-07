const UserModel = require("../models/UserModel");

async function checkEmail(request, response) {
  try {
    const { email } = request.body;
    //this checkEmail var is used to find the user document except the password from the User table, we ignored the password because down there we send checkEmail as response data and we dont want the password to be seen in the user(frontend) side
    const checkEmail = await UserModel.findOne({ email }).select("-password");

    if (!checkEmail) {
      return response.status(400).json({
        message: "user not exit",
        error: true,
      });
    }

    return response.status(200).json({
      message: "email verified",
      success: true,
      data: checkEmail,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = checkEmail;
