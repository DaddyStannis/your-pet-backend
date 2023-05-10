import JWT from "jsonwebtoken";

const { SECRET_KEY } = process.env;

function createToken(id) {
  console.log(SECRET_KEY);
  return JWT.sign({ id }, SECRET_KEY, { expiresIn: "7D" });
}

export default createToken;
