const express = require("express");
const {
  getAllQuestions,
  addQuestions,
} = require("../../controller/question_controller");
const { authenticated } = require("../../middleware/authenticated");

const route = express.Router();

route.get("/", authenticated, getAllQuestions);
route.post("/", authenticated, addQuestions);

module.exports = route;
