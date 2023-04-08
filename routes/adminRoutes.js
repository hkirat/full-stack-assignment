const express = require("express");
const {
  emailValidation,
  passwordValidation,
} = require("../middlewares/validators");
const { signup, login } = require("../controllers/adminController");

const router = express.Router();

router.post("/admin/signup", [emailValidation, passwordValidation], signup);

router.post("/admin/login", [emailValidation, passwordValidation], login);

module.exports = router;
