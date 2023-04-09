const express = require("express");
const {
  getAllQuestions,
  addQuestions,
} = require("../../controller/question_controller");
const { isAdmin } = require("../../middleware/authenticated");

const route = express.Router();

route.get("/", getAllQuestions);
route.post("/", isAdmin, addQuestions);

module.exports = route;
