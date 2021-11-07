const express = require("express");
const { requireSignin } = require("../controllers/auth");
const router = express.Router();

//import controllers
const { read } = require("../controllers/user");

router.get("/user/:id", requireSignin, read);

module.exports = router;
