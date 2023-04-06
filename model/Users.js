const Joi = require("joi");

exports.USERS = [];

exports.validateUser = (user) => {
  const userSchema = Joi.object({
    email: Joi.string().email().required().label("Email ID"),
    // password: Joi.string().min(5).max(250).required().label("Password"),
    password: Joi.string().required().label("Password"),
  });

  return userSchema.validate(user, {
    abortEarly: false,
  });
};
