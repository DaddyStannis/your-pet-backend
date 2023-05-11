import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/index.js";

const noticeSchema = new Schema({

})

const schemas = {
  
};

const Notice = model("notice", noticeSchema)

export { Notice, schemas }