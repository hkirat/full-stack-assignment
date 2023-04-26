const { v4: uuidv4 } = require("uuid");
const { USERS } = require("../model/Users");
const { formatStatistics, formatUsersList } = require("../utils/format");
const { RES_STATUS } = require("../utils/constants");

/* -------------------------------------------------------------------------- */
/*                                GET CURRENT USER                            */
/* -------------------------------------------------------------------------- */
exports.getCurrentUser = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const user = USERS.find((user) => user.id === userId);
    if (!user)
      return res.status(400).send({
        status: RES_STATUS.FAIL,
        code: 400,
        data: {},
        message: "User Not Found",
      });

    return res.status(200).send({
      status: RES_STATUS.PASS,
      code: 200,
      data: user,
      message: "User Found",
    });
  } catch (error) {
    res.status(500).send({
      status: RES_STATUS.FAIL,
      code: 500,
      message: "Internal Server Error",
    });
  }
};
/* -------------------------------------------------------------------------- */
/*                                GET ALL USERS                               */
/* -------------------------------------------------------------------------- */
exports.getAllUsers = async (req, res) => {
  try {
    const formattedUser = formatUsersList();

    return res.status(200).send({
      status: RES_STATUS.PASS,
      code: 200,
      data: formattedUser,
      message: "List of users",
    });
  } catch (error) {
    res.status(500).send({
      status: RES_STATUS.FAIL,
      code: 500,
      message: "Internal Server Error",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                            GET USER STATISTICS                            */
/* -------------------------------------------------------------------------- */
exports.getStatistics = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const updatedStatistics = formatStatistics(userId);

    return res.status(200).send({
      status: RES_STATUS.PASS,
      code: 200,
      data: updatedStatistics,
      message: "User Statistics",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: user_controller.js:41 ~ exports.getStatistics= ~ error:",
      error
    );
    res.status(500).send({
      status: RES_STATUS.FAIL,
      code: 500,
      message: "Internal Server Error",
    });
  }
};
