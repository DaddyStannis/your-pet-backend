import JWT from "jsonwebtoken";

import { User } from "../models/users.js";

const { ACCESS_SECRET_KEY } = process.env;

async function authenticateIfHasToken(req, res, next) {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next();
  }

  try {
    var { id } = JWT.verify(token, ACCESS_SECRET_KEY);
  } catch {
    return next();
  }

  const user = await User.findById(id);

  if (!user || !user.accessToken) {
    return next();
  }

  req.user = user;
  next();
}

export default authenticateIfHasToken;
