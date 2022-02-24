const express = require("express");
const router = express.Router();

//import controllers
const {
  signin,
  signup,
  accountActivation,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

//import validators
const {
  userSignUpValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators/");

router.post("/signup", userSignUpValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.post("/account-activation", accountActivation);
router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

module.exports = router;
