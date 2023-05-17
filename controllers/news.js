import News from "../models/news.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";
async function getNews(req, res) {
  const { title, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const regex = new RegExp(title, "i");

  const count = await News.count({ title: regex });

  const result = await News.find({ title: regex }, "", {
    skip,
    limit,
  });

  if (result.length === 0) {
    throw HttpError(404, "Not found");
  }

  res.json({
    total: count,
    data: result,
  });
}

export default {
  getNews: ctrlWrapper(getNews),
};
