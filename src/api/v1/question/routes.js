const express = require("express");
const { authError } = require("../../../helpers/api/index");
const { requireAdmin } = require("../../../helpers/authentication.js/index");
const question = require("./question");

const questionRoutesV1 = express.Router();

questionRoutesV1.get("/", question.fetchAll);
questionRoutesV1.post("/", requireAdmin, question.create, authError);

module.exports = { questionRoutesV1 };
