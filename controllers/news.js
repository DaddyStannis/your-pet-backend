import News from "../models/news.js";
import { ctrlWrapper } from "../decorators/index.js";

async function getNews(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await News.find({}, "", { skip, limit });
  res.json(result);
}

export default {
  getNews: ctrlWrapper(getNews),
};
