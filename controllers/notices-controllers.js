import path from "path";
import { Notice } from "../models/notice.js";
import { ctrlWrapper } from "../decorators/index.js";
import { moveFile, resizeImg, HttpError } from "../helpers/index.js";

// для пошуку оголошеннь по заголовку
const getNoticesByTitleandKeyword = async (req, res) => {
    const { title, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const regex = new RegExp(title, "i");
    const result = await Notice.find({ title: regex }, '', { skip, limit }).populate("owner")

    if (result.length === 0) {
        throw HttpError(404, "Not found");
    }

    res.json(result);
}

// для отримання оголошень по категоріям
const getNoticesByCategory = async (req, res) => {
    const { category, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const notices = await Notice.find({
        category: category ? category : "sell",
    }, '',  { skip, limit }).populate("owner")

    res.json(notices)
}

// для отримання одного оголошення
const getNoticeById = async (req, res) => {
    const { noticeId } = req.params
    const result = await Notice.findById(noticeId).populate("owner")
    if (!result) {
      throw HttpError(404, `Notice with ${noticeId} not found`)
    }
    res.json(result)
}

// для додавання оголошення до обраних
// для видалення оголошення авторизованого користувача доданих цим же до обраних
const updateFavoriteNotice = async (req, res) => {
  const { noticeId } = req.params
  const result = await Notice.findByIdAndUpdate(noticeId, req.body, { new: true })
  if (!result) {
    throw HttpError(404, 'Not found')
  }
   if (JSON.stringify(req.body) === '{}') {
      throw HttpError(400, 'missing field favorite')
    }
  res.json(result)
}

// для отримання оголошень авторизованого користувача доданих ним же в обрані
const listFavoriteNotices = async (req, res) => {
  const { _id: owner } = req.user
  const { page = 1, limit = 10, favorite} = req.query;
  const skip = (page - 1) * limit
  const result = await Notice.find({ owner, favorite: true }, '', { skip, limit })
  res.json(result)
}


// для додавання оголошень відповідно до обраної категорії
const petAvatarsDirPath = path.resolve("public", "petPhotos");

const addNotice = async (req, res) => {
    const { _id: owner } = req.user
    
    await moveFile(req.file, petAvatarsDirPath);
    await resizeImg(path.join(petAvatarsDirPath, req.file.filename), 300);
    const file = path.join("petPhotos", req.file.filename)

    const result = await Notice.create({...req.body, file, owner})
    res.status(201).json(result);
}

// для отримання оголошень авторизованого кристувача створених цим же користувачем
const listNotices = async (req, res) => {
  const { _id: owner } = req.user
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit
  const result = await Notice.find({ owner }, '', { skip, limit })
  res.json(result)
}

// для видалення оголошення авторизованого користувача створеного цим же користувачем 
const removeNotice = async (req, res) => {
    const { noticeId } = req.params

    const result = await Notice.findByIdAndDelete(noticeId)
    if (!result) {
      throw HttpError(404, `Notice with ${noticeId} not found`)
    }
    res.status(200).json({message: "Notice deleted"})
  }

export default {
    getNoticesByTitleandKeyword: ctrlWrapper(getNoticesByTitleandKeyword),
    getNoticesByCategory: ctrlWrapper(getNoticesByCategory),
    getNoticeById: ctrlWrapper(getNoticeById),
    updateFavoriteNotice: ctrlWrapper(updateFavoriteNotice),
    listFavoriteNotices: ctrlWrapper(listFavoriteNotices),
    addNotice: ctrlWrapper(addNotice),
    listNotices: ctrlWrapper(listNotices),
    removeNotice: ctrlWrapper(removeNotice),
}