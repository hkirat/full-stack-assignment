const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const { submit } = require("../controllers/problemController");
router.post("/submit", authenticationMiddleware, submit);
module.exports = router;