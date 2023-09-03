import Joi from "joi";

const createAddressValidation = Joi.object({
    street: Joi.string().min(1).max(100).optional(),
    city: Joi.string().min(1).max(100).optional(),
    province: Joi.string().min(1).max(100).optional(),
    country: Joi.string().min(1).max(100).required(),
    postal_code: Joi.string().min(1).max(10).required(),
});

const getAddressValidation = Joi.number().min(1).positive().required();

export {
    createAddressValidation,
    getAddressValidation
}