import Joi from "joi";

const createContactValidation = Joi.object({
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).optional(),
    email: Joi.string().max(100).email().optional(),
    phone: Joi.string().max(100).optional(),
});

const getContactValidation = Joi.number().required();

const updateContactValidation = Joi.object({
    id: Joi.number().positive().required(),
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).optional(),
    email: Joi.string().max(100).email().optional(),
    phone: Joi.string().max(100).optional(),
});

export {
    createContactValidation,
    getContactValidation,
    updateContactValidation
}