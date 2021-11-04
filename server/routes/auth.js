const express = require("express");
const router = express.Router();

//import controllers
const { signup } = require("../controllers/auth");

//import validators
const { userSignUpValidator } = require("../validators/auth");
const { runValidation } = require("../validators/");

router.post("/signup", userSignUpValidator, runValidation, signup);

module.exports = router;
