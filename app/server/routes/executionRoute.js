const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const { execute, status } = require("../controllers/executionController");
router.post("/", authenticationMiddleware, execute);
router.get("/status/:id", status);
module.exports = router;