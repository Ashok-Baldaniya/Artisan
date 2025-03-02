import Joi from 'joi'

export const userSignupSchema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().trim().min(5).required(),
    isSeller: Joi.boolean().default(false).optional(),
    phone: Joi.string().length(10).pattern(/^(?!0)[0-9]{10}$/).required(),
    address: Joi.object({
        street: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        zip: Joi.string().length(6).trim().required(),
        country: Joi.string().trim().required(),
    }).required(),
    profileImage: Joi.string(),
    isVerified: Joi.boolean().default(false),
    verificationToken: Joi.string()
})

export const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().trim().min(5).required(),
})

export const userForgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
})

export const userConfirmForgotPasswordSchema = Joi.object({
    password: Joi.string().trim().min(5).required()
})

export const userResetPasswordSchema = Joi.object({
    password: Joi.string().trim().required(),
    newPassword: Joi.string().trim().min(5).required()
})
