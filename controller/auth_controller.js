const { USERS, validateUser } = require("../model/Users");

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
        code: 401,
        message: "Email already in use",
      });

    USERS.push({
      email,
      password,
    });

    return res.status(200).send({
      status: "Pass",
      code: 200,
      data: USERS,
      message: "User successfully signed",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: auth_controller.js:19 ~ exports.signup= ~ error:",
      error
    );
    res.send({
      message: "Internal Server Error",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */
exports.login = async (req, res) => {
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

  const userExist = USERS.find(
    (user) => user.email === email && user.password == password
  );

  if (!userExist)
    return res.status(401).send({
      status: "Pass",
      code: 401,
      message: "Email or password is not correct",
    });

  return res.status(200).send({
    status: "Fail",
    code: 200,
    data: userExist,
    message: "User successfully logged in",
  });
};
