import { HttpError } from "../helpers/index.js";

function validateBody(schema) {
  return function (req, res, next) {
    const { error } = schema.validate(req.body);

    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
}

export default validateBody;
