import path from "path";
import moment from "moment";
import { Notice } from "../models/notice.js";
import { ctrlWrapper } from "../decorators/index.js";
import { moveFile, HttpError } from "../helpers/index.js";

const PET_AVATARS_DIR = path.resolve("public", "pet-photos");

const DEFAULT_ICON_NAME = "no-pictures.png";

const AGE_CONDITIONS = {
  "1y": { from: 1, to: 2, period: "years" },
  "2y": { from: 2, to: 3, period: "years" },
  "3y": { from: 3, to: 4, period: "years" },
  "4y": { from: 4, to: 5, period: "years" },
  "5y": { from: 5, to: 6, period: "years" },
  "6y": { from: 6, to: 7, period: "years" },
  "7y": { from: 7, to: 8, period: "years" },
  "8plus": { from: 8, to: 1000, period: "years" },
  "3-12m": { from: 3, to: 13, period: "month" },
};

// для отримання оголошень по категоріям + по заголовку
const listNotices = async (req, res) => {
  const {
    sex,
    age,
    favorite = false,
    title,
    category,
    page = 1,
    limit = 10,
    "only-mine": onlyMine = false,
  } = req.query;
  const skip = (page - 1) * limit;

  const regex = new RegExp(title, "i");

  const filters = { title: regex };

  if (category && category !== "all") {
    filters.category = category;
  }

  if (sex && (sex === "male" || sex === "female")) {
    filters.sex = sex;
  }

  if (age) {
    const condition = AGE_CONDITIONS[age];
    const date = Date.now();
    filters.birth = {
      $lte: moment(date).subtract(condition.from, condition.period),
      $gte: moment(date).subtract(condition.to, condition.period),
    };
  }

  if (req.user && favorite) {
    filters._id = { $in: req.user.favorites };
  }

  if (req.user && onlyMine) {
    filters.owner = req.user;
  }

  let notices = await Notice.find(filters, null, { skip, limit });

  if (req.user) {
    notices = notices.map((notice) => {
      const favorite = req.user.favorites.includes(notice._id);
      const own = notice.owner.equals(req.user._id);
      return { ...notice.toObject(), favorite, own };
    });
  }

  res.json(notices);
};

const getUserNotices = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Notice.find({ owner }, "", { skip, limit });
  res.json(result);
};

// для отримання одного оголошення
const getNoticeById = async (req, res) => {
  const { id } = req.params;

  let notice = await Notice.findById(id).populate("owner", "email phone");

  if (!notice) {
    throw HttpError(404, `Notice with ${id} not found`);
  }

  if (req.user) {
    const favorite = req.user.favorites.includes(id);
    const own = notice.owner.equals(req.user._id);
    notice = { ...notice.toObject(), favorite, own };
  }

  res.json(notice);
};

// для додавання оголошень відповідно до обраної категорії
const addNotice = async (req, res) => {
  const { _id: owner } = req.user;
  const { file = {} } = req;

  if ("filename" in file) {
    await moveFile(req.file, PET_AVATARS_DIR);
  } else {
    file.filename = DEFAULT_ICON_NAME;
  }

  const photoURL = path.join("pet-photos", file.filename);

  const result = await Notice.create({ ...req.body, photoURL, owner });
  res.status(201).json(result);
};

// для видалення оголошення авторизованого користувача створеного цим же користувачем
const removeNotice = async (req, res) => {
  const { id } = req.params;

  const result = await Notice.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Notice with ${id} not found`);
  }
  res.status(204).json();
};

export default {
  getNoticeById: ctrlWrapper(getNoticeById),
  addNotice: ctrlWrapper(addNotice),
  listNotices: ctrlWrapper(listNotices),
  removeNotice: ctrlWrapper(removeNotice),
  getUserNotices: ctrlWrapper(getUserNotices),
};
