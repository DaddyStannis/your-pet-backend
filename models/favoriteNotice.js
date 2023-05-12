import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/index.js";

const favoriteNoticeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  noticeId: {
    type: Schema.Types.ObjectId,
    ref: 'notice',
    required: true,
  }
}, { versionKey: false })

favoriteNoticeSchema.post('save', handleMongooseError)


const schemas = {
}

const FavoriteNotice = model('favoriteNotice', favoriteNoticeSchema);

export { FavoriteNotice, schemas }