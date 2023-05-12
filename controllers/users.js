import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import path from "path";

import { User } from "../models/users.js";
import { ctrlWrapper } from "../decorators/index.js";
import {
  createToken,
  moveFile,
  resizeImg,
  HttpError,
} from "../helpers/index.js";

const avatarsDirPath = path.resolve("public", "avatars");

async function register(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const avatarURL = gravatar.url(email, { size: 250 });

  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashedPassword,
  });

  res.status(201).json({
    email: newUser.email,
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(409, "Email or password is wrong");
  }

  const passwordCompare = bcrypt.compareSync(password, user.password);

  if (!passwordCompare) {
    throw HttpError(409, "Email or password is wrong");
  }

  const token = createToken(user.id);
  user.token = token;
  user.save();

  res.json({
    token,
    email: user.email,
  });
}

async function logout(req, res) {
  await User.findByIdAndUpdate(req.user._id, { token: "" });
  res.status(204).json();
}

async function current(req, res) {
  res.json({ email: req.user.email });
}

async function updateAvatar(req, res) {
  await moveFile(req.file, avatarsDirPath);
  await resizeImg(path.join(avatarsDirPath, req.file.filename), 250);
  const { _id } = req.user;
  const avatarURL = path.join("avatars", req.file.filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
}

async function getUserInfo(req, res) {
  const { user } = req;
  res.json({
    name: user.email,
    birthday: user.birthday,
    phone: user.phone,
    city: user.city,
    email: user.email,
    avatarURL: user.avatarURL,
    favorites: user.favorites,
  });
}

async function updateUserInfo(req, res) {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true }
  );
  res.json({
    name: updatedUser.email,
    birthday: updatedUser.birthday,
    phone: updatedUser.phone,
    city: updatedUser.city,
    email: updatedUser.email,
    avatarURL: updatedUser.avatarURL,
  });
}

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateAvatar: ctrlWrapper(updateAvatar),
  getUserInfo: ctrlWrapper(getUserInfo),
  updateUserInfo: ctrlWrapper(updateUserInfo),
};
