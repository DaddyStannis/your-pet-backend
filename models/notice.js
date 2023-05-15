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
        required: true
    },
    breed: {
        type: String,
        minLength: 2,
        maxLength: 16,
        required: [true, "Set breed of your pet"]
    },
    photoURL: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        minLength: 8,
        maxLength: 120,
        default: null
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
    title: Joi.string().pattern(/^[A-Za-z ]+$/),
    type: Joi.string().pattern(/^[A-Za-z ]+$/).required().messages({
        'any.required': 'missing required type field'
    }),
    name: Joi.string().min(2).max(16).required().messages({
        'any.required': 'missing required name field'
    }),
    birth: Joi.date().required().messages({
        'any.required': 'missing required birth field'
    }),
    breed: Joi.string().min(2).max(16).required().messages({
        'any.required': 'missing required breed field'
    }),
    photoURL: Joi.string(),
    comments: Joi.string().min(8).max(120).regex(/^[\s\S]*.*[^\s][\s\S]*$/),
})


const schemas = {
    addNoticeSchema,
};

const Notice = model("notice", noticeSchema)

export { Notice, schemas }