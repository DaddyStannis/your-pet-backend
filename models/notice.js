import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/index.js";

const noticeSchema = new Schema({
    category: {
        type: String,
        enum: ["my pet", "sell", "lost-found", "for-free"],
        required: [true, "Set category for your pet"]
    },
    title: {
        type: String,
        require: [true, "Set the title to your notice"]
    },
    type: {
        type: String,
        required: [true, "Set type of your pet"]
    },
    name: {
        type: String,
        minLength: 2,
        maxLength: 16,
        required: [true, "Set name for your pet"]
    },
    birth: {
        type: Date,
        default: null
    },
    breed: {
        type: String,
        minLength: 2,
        maxLength: 16,
        required: [true, "Set breed of your pet"]
    },
    file: {
        type: String,
    },
    sex: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Set sex of your pet (male or female)"]
    },
    location: {
        type: String,
        required: [true, "Set the city of your pet. Where your pet is now"]
    },
    price: {
        type: Number
    },
    comments: {
        type: String,
        minLength: 8,
        maxLength: 120,
        default: null
    },
    favorite: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
}, { versionKey: false })

noticeSchema.post('save', handleMongooseError)

const addNoticeSchema = Joi.object({
    category: Joi.string().regex(/^(my pet|sell|lost-found|for-free)$/).required().messages({
        'any.required': 'missing field category'
    }),
    title: Joi.string().pattern(/^[A-Za-z ]+$/).required().messages({
        'any.required': 'missing required title field'
    }),
    type: Joi.string().pattern(/^[A-Za-z ]+$/).required().messages({
        'any.required': 'missing required type field'
    }),
    name: Joi.string().min(2).max(16).required().messages({
        'any.required': 'missing required name field'
    }),
    birth: Joi.date(),
    breed: Joi.string().min(2).max(16).required().messages({
        'any.required': 'missing required breed field'
    }),
    file: Joi.string(),
    sex: Joi.string().regex(/^(male|female)$/).required().messages({
        'any.required': 'missing required sex field'
    }),
    location: Joi.string().pattern(/^[A-Za-z ]+$/).when("category", {
      is: Joi.valid("sell", "lost-found", "for-free"),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }).messages({
        'any.required': 'missing required location field'
    }),
    price: Joi.number().min(0).when("category", {
      is: "sell",
      then: Joi.number().min(1).required(),
      otherwise: Joi.optional(),
    }).messages({
        'any.required': 'missing required price field'
  }),
    comments: Joi.string().min(8).max(120).regex(/^[\s\S]*.*[^\s][\s\S]*$/),
    favorite: Joi.boolean()
})

const patchNoticeFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required().messages({
        'any.required': 'missing field favorite'
    })
})

const schemas = {
    addNoticeSchema,
    // patchNoticeFavoriteSchema,
};

const Notice = model("notice", noticeSchema)

export { Notice, schemas }