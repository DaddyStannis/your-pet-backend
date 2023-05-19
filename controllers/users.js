import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import path from "path";
import JWT from "jsonwebtoken";

import { User } from "../models/users.js";
import { Notice } from "../models/notice.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

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

  res.status(201).json({ email: newUser.email });
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

  user.accessToken = JWT.sign({ id: user._id }, ACCESS_SECRET_KEY, {
    expiresIn: "1D",
  });
  user.refreshToken = JWT.sign({ id: user._id }, REFRESH_SECRET_KEY, {
    expiresIn: "7D",
  });
  user.save();

  res.json({
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  });
}

async function logout(req, res) {
  await User.findByIdAndUpdate(req.user._id, { token: "" });
  res.status(204).json();
}

async function current(req, res) {
  const { refreshToken } = req.body;

  try {
    var { id } = JWT.verify(refreshToken, REFRESH_SECRET_KEY);
  } catch (error) {
    throw HttpError(403);
  }

  const isExist = User.findOne({ refreshToken });

  if (!isExist) {
    throw HttpError(403);
  }

  const updatedAccessToken = JWT.sign({ id }, ACCESS_SECRET_KEY, {
    expiresIn: "1D",
  });
  const updatedRefreshToken = JWT.sign({ id }, REFRESH_SECRET_KEY, {
    expiresIn: "7D",
  });

  res.json({
    accessToken: updatedAccessToken,
    refreshToken: updatedRefreshToken,
  });
}

async function updateAvatar(req, res) {
  const avatarURL = req.file.path;
  await User.findByIdAndUpdate(req.user._id, { avatarURL });
  res.json({ avatarURL });
}

async function getUserInfo(req, res) {
  const { user } = req;
  res.json({
    name: user.name,
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
    name: updatedUser.name,
    birthday: updatedUser.birthday,
    phone: updatedUser.phone,
    city: updatedUser.city,
    email: updatedUser.email,
    avatarURL: updatedUser.avatarURL,
    favorites: updatedUser.favorites,
  });
}

const addToFavorites = async (req, res) => {
  const { noticeId } = req.params;
  const { _id } = req.user;

  const user = await User.findById(_id);

  const notice = await Notice.findById(noticeId);
  if (!notice) {
    throw HttpError(404, `Notice with ${noticeId} not found`);
  }

  if (user.favorites.includes(noticeId)) {
    throw HttpError(400, "The notice is already in yours favorites");
  }

  user.favorites.push(noticeId);

  await user.save();

  return res.status(200).json({ message: "The notice is in yours favorites" });
};

const removeFromFavorites = async (req, res) => {
  const { noticeId } = req.params;

  req.user.favorites = req.user.favorites.filter(
    (favorite) => favorite !== noticeId
  );

  await req.user.save();

  return res.status(204).json();
};

const getUserFavorites = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const count = await Notice.count({
    _id: { $in: req.user.favorites },
  });
  const favoriteNotices = await Notice.find(
    {
      _id: { $in: req.user.favorites },
    },
    "",
    { skip, limit }
  );
  return res.status(200).json({
    total: count,
    notices: favoriteNotices,
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateAvatar: ctrlWrapper(updateAvatar),
  getUserInfo: ctrlWrapper(getUserInfo),
  updateUserInfo: ctrlWrapper(updateUserInfo),
  addToFavorites: ctrlWrapper(addToFavorites),
  removeFromFavorites: ctrlWrapper(removeFromFavorites),
  getUserFavorites: ctrlWrapper(getUserFavorites),
};
