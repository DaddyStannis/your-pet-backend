import JWT from "jsonwebtoken";

import { User } from "../models/users.js";
import { HttpError } from "../helpers/index.js";

const { ACCESS_SECRET_KEY } = process.env;

async function authenticate(req, res, next) {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    var { id } = JWT.verify(token, ACCESS_SECRET_KEY);
  } catch {
    next(HttpError(401));
  }

  const user = await User.findById(id);

  if (!user || !user.accessToken) {
    next(HttpError(401));
  }
  req.user = user;
  next();
}

export default authenticate;
