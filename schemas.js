const Joi = require('joi');

const signup_schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().required()
});

const login_schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const question_schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  testCases:  Joi.array().items(
    Joi.object({
    input: Joi.string().required(),
    output: Joi.string().required()
  })
  ).required()
})

module.exports = { signup_schema, login_schema, question_schema }