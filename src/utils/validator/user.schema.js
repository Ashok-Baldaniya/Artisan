import Joi from 'joi'

export const userValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('Artisan', 'Customer', 'Admin').default('Customer').optional(),
    phone: Joi.string().required(),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        zip: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
    profileImage: Joi.string(),
    isVerified: Joi.boolean(),
    verificationToken: Joi.string()
})