import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/index.js";

const regEx = /^[^\u0400-\u04FF]*$/;

const petSchema = new Schema(
  {
    type: {
      type: String,
      required: [true, "Set type of your pet"],
    },
    name: {
      type: String,
      maxLength: 32,
      required: [true, "Set name for your pet"],
    },
    birth: {
      type: Date,
      default: null,
    },
    breed: {
      type: String,
      maxLength: 32,
      required: [true, "Set breed of your pet"],
    },
    photoURL: {
      type: String,
    },
    comments: {
      type: String,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

petSchema.post("save", handleMongooseError);

const addPetSchema = Joi.object({
  type: Joi.string().pattern(regEx).required().messages({
    "any.required": "missing required type field",
  }),
  name: Joi.string().pattern(regEx).max(32).required().messages({
    "any.required": "missing required name field",
  }),
  birth: Joi.date(),
  breed: Joi.string().pattern(regEx).max(32).required().messages({
    "any.required": "missing required breed field",
  }),
  photoURL: Joi.string(),
  comments: Joi.string().pattern(regEx),
});

const schemas = {
  addPetSchema,
};

const Pet = model("pet", petSchema);

export { Pet, schemas };
