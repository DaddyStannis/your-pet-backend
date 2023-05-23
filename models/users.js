import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/index.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const regEx = /^[^\u0400-\u04FF]*$/;

const schema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      default: null,
    },
    birthday: {
      type: Date,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegexp,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    favorites: {
      type: Array,
      default: [],
    },
    refreshToken: { type: String, default: "" },
    accessToken: { type: String, default: "" },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const updateInfoSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp),
  name: Joi.string().pattern(regEx),
  birthday: Joi.date(),
  phone: Joi.string(),
  city: Joi.string().pattern(regEx),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateInfoSchema,
};

schema.post("save", handleMongooseError);
schema.post("update", handleMongooseError);
schema.post("findOneAndUpdate", handleMongooseError);
schema.post("insertMany", handleMongooseError);

const User = model("user", schema);

export { User, schemas };
