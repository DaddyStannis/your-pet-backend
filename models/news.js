import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/index.js";

const schema = new Schema();
schema.post("save", handleMongooseError);

const News = model("news", schema);

export default News;
