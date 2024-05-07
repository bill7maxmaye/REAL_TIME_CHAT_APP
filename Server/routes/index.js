const express = require("express");
const registerUser = require("../controller/registeruser");
const checkEmail = require("../controller/checkEmail");
const checkPassword = require("../controller/checkPassword");
const router = express.Router();

//create the route to be used to register a user
router.post("/register", registerUser);
router.post("/email", checkEmail);
router.post("/password", checkPassword);

module.exports = router;
