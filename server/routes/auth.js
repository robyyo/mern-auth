const express = require("express");
const router = express.Router();

//import controllers
const { signup } = require("../controllers/auth");

router.get("/signup", signup);

module.exports = router;
