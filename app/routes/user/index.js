const express = require("express");
const {
  getCurrentUser,
  getAllUsers,
  getStatistics,
} = require("../../controller/user_controller");
const { authenticated } = require("../../middleware/authenticated");

const route = express.Router();

route.get("/current", authenticated, getCurrentUser);
route.get("/", getAllUsers);
route.get("/statistics", authenticated, getStatistics);

module.exports = route;
