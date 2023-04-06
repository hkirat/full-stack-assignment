const Joi = require("joi");
const ExpressError = require("../errors/ExpressError");

const validateProblem = (req, res, next) => {
  const ProblemJoiSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    testCases: Joi.array().items(
      Joi.object({
        input: Joi.string(),
        output: Joi.string(),
      })
    ),
  });

  const result = ProblemJoiSchema.validate(req.body);

  if (result.error) {
    const message = result.error.details.map((el) => el.message);
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

module.exports = validateProblem;
