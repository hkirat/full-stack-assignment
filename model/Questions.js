const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

exports.QUESTIONS = [
  // {
  //   id: uuidv4(),
  //   title: "Two states",
  //   description: "Given an array , return the maximum of the array?",
  //   testCases: [
  //     {
  //       input: "[1,2,3,4,5]",
  //       output: "5",
  //     },
  //   ],
  // },
];

exports.validateQuestion = (question) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(18).max(99).required(),
    hobbies: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          description: Joi.string().required(),
        })
      )
      .required(),
  });

  const data = {
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    hobbies: [],
  };

  const result = schema.validate(data);

  if (result.error) {
    console.log(result.error.details);
  } else {
    console.log("Validation passed");
  }

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
