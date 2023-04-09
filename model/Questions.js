const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

exports.QUESTIONS = [];

exports.validateQuestion = (question) => {
  const questionSchema = Joi.object({
    title: Joi.string().required().label("Title"),
    description: Joi.string().required().label("Description"),
    testCases: Joi.array()
      .items(
        Joi.object({
          input: Joi.string().required().label("Test Case Input"),
          output: Joi.string().required().label("Test Case Output"),
        })
      )
      .required()
      .label("Test Case"),
  });

  return questionSchema.validate(question, {
    abortEarly: false,
  });
};
