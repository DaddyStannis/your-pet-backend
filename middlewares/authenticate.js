import JWT from "jsonwebtoken";

import { User } from "../models/users.js";
import { HttpError } from "../helpers/index.js";

const { SECRET_KEY } = process.env;

async function authenticate(req, res, next) {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    var { id } = JWT.verify(token, SECRET_KEY);
  } catch {
    next(HttpError(401));
  }

  const user = await User.findById(id);

  if (!user || !user.token) {
    next(HttpError(401));
  }
  req.user = user;
  next();
}

export default authenticate;
