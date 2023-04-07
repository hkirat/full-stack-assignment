const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { USERS, validateUser } = require("../model/Users");
const {
  hashPassword,
  comparePasswords,
  generateToken,
} = require("../utils/common");

/* -------------------------------------------------------------------------- */
/*                                   SING UP                                   */
/* -------------------------------------------------------------------------- */
exports.signup = async (req, res) => {
  try {
    //
    const { error } = validateUser(req.body);
    if (error)
      return res.status(400).send({
        status: "Fail",
        code: 400,
        message: error.details.map((error, index) => ({
          error: error.message,
        })),
      });

    const { email, password } = req.body;

    const userExist = USERS.find((user) => user.email === email);

    if (userExist)
      return res.status(400).send({
        status: "Fail",
        code: 400,
        message: "Email already in use",
      });

    const hashedPassword = await hashPassword(password);

    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      isAdmin: Math.random() < 0.5,
    };

    USERS.push(newUser);

    const { password: updatedPassword, ...resUser } = newUser;

    return res.status(200).send({
      status: "Pass",
      code: 200,
      data: resUser,
      message: "User successfully signed",
    });
  } catch (error) {
    res.status(500).send({
      status: "Fail",
      code: 500,
      message: "Internal Server Error",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */
exports.login = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error)
      return res.status(400).send({
        status: "Fail",
        code: 400,
        message: error.details.map((error, index) => ({
          error: error.message,
        })),
      });

    const { email, password } = req.body;

    const userExist = USERS.find((user) => user.email === email);

    if (!userExist)
      return res.status(401).send({
        status: "Fail",
        code: 401,
        message: "Email or password is not correct",
      });

    const isPasswordValid = await comparePasswords(
      password,
      userExist.password
    );

    if (!isPasswordValid)
      return res.status(401).send({
        status: "Fail",
        code: 401,
        message: "Email or password is not correct",
      });

    const { password: userPassword, ...restUser } = userExist;

    const payload = { user: restUser };

    const token = generateToken(payload);

    return res.status(200).send({
      status: "Pass",
      code: 200,
      data: { user: restUser, token },
      message: "User successfully logged in",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: auth_controller.js:105 ~ exports.login= ~ error:",
      error
    );
    res.status(500).send({
      status: "Fail",
      code: 500,
      message: "Internal Server Error",
    });
  }
};
