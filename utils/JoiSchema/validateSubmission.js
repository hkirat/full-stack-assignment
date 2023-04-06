const Joi = require("joi");
const ExpressError = require("../errors/ExpressError");


const validateSubmission = (req, res, next) => {
  const submissionJoiSchema = Joi.object({
    code: Joi.string().required(),
    language: Joi.string(),
  });

  const result = submissionJoiSchema.validate(req.body);

  if (result.error) {
    const message = result.error.details.map((el) => el.message);
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

module.exports = validateSubmission;
