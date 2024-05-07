const express = require("express");
const registerUser = require("../controller/registeruser");
const router = express.Router();

//create the route to be used to register a user
router.post("/register", registerUser);

module.exports = router;
