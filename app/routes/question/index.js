const express = require("express");
const {
  getAllQuestions,
  addQuestions,
  getSingleQuestions,
} = require("../../controller/question_controller");
const { isAdmin } = require("../../middleware/authenticated");

const route = express.Router();

route.get("/", getAllQuestions);
route.get("/:questionId", getSingleQuestions);
route.post("/", isAdmin, addQuestions);

module.exports = route;
