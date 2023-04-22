const Joi = require("joi");

exports.USERS = [
  {
    id: "c37af7de-b815-4bb5-8cb4-8f74972b424d",
    email: "admin@gmail.com",
    password: "$2b$10$qSFM09oxgriIYS1zCpLdL.7kyIq2onyA.1Eez2gvXLE1ZzYveM5xG",
    isAdmin: true,
  },
  {
    id: "797f9825-b685-4dc8-b6aa-2b3d8a8689c7",
    email: "ankit@gmail.com",
    password: "$2b$10$ukwtxpfjZRkqYuxu5vOOpey3Mho6KwIZIsrRVWRUwBb7wIpWPuZJW",
    isAdmin: false,
  },
];

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
