import Joi from "joi";

/**
 * Create Schema
 */

export const registerUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    name: Joi.string().max(100).required(),
});

export const loginUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
});

export const getUserValidation = Joi.string().max(100).required();

export const updateUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).optional(),
    name: Joi.string().max(100).optional(),
});