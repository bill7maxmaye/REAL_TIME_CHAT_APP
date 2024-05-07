const express = require("express");
const registerUser = require("../controller/registeruser");
const checkEmail = require("../controller/checkEmail");
const checkPassword = require("../controller/checkPassword");
const userDetails = require("../controller/userDetails");
const router = express.Router();

//create the route to be used to register a user
router.post("/register", registerUser);
//check user email
router.post("/email", checkEmail);
//check user password
router.post("/password", checkPassword);
//log in user details
router.get("/user-details", userDetails);

module.exports = router;
