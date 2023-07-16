const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const { submit, list, get } = require("../controllers/problemController");
router.post("/submit", authenticationMiddleware, submit);
router.get("/list", authenticationMiddleware, list);
router.get("/get", get);
module.exports = router;