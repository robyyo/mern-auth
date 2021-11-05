const express = require("express");
const router = express.Router();

//import controllers
const { signin, signup, accountActivation } = require("../controllers/auth");

//import validators
const {
  userSignUpValidator,
  userSigninValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators/");

router.post("/signup", userSignUpValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.post("/account-activation", accountActivation);

module.exports = router;
