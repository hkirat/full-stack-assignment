const express = require("express");
const { signup, login } = require("../controllers/auth.controllers");

const router = express();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
