const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

exports.SUBMISSIONS = [];

exports.validateSubmission = (submission) => {
  const submissionSchema = Joi.object({
    code: Joi.string().required().label("Code"),
  });

  return submissionSchema.validate(submission, {
    abortEarly: false,
  });
};
