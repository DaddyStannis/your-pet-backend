import Sponsors from "../models/sponsors.js";
import { ctrlWrapper } from "../decorators/index.js";

async function getSponsors(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Sponsors.find({}, "", { skip, limit });
  res.json(result);
}

export default {
  getSponsors: ctrlWrapper(getSponsors),
};
