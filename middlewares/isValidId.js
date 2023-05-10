import isValidObjectId from "mongoose";
import { HttpError } from "../helpers/index.js";

function isValidId(req, res, next) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    next(HttpError(404, `"${id}" is not valid id format.`));
  }
  next();
}

export default isValidId;
