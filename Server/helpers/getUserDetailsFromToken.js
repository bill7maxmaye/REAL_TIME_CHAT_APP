const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decode.id).select("-password");
    return user;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return {
        message: "Token expired",
        logout: true,
      };
    } else {
      throw err; // Re-throw other errors
    }
  }
};

module.exports = getUserDetailsFromToken;
