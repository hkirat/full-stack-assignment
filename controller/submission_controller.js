const { v4: uuidv4 } = require("uuid");
const { USERS, validateUser } = require("../model/Users");
const { QUESTIONS } = require("../model/Questions");
const { SUBMISSIONS } = require("../model/Submission");

/* -------------------------------------------------------------------------- */
/*                                   SING UP                                   */
/* -------------------------------------------------------------------------- */
exports.getAllSubmissions = async (req, res) => {
  try {
    return res.status(200).send({
      status: "Pass",
      code: 200,
      data: SUBMISSIONS,
      message: "List of submissions",
    });
  } catch (error) {
    res.send({
      message: "Internal Server Error",
    });
  }
};
