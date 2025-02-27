import Joi from 'joi'

export const userSignupSchema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().trim().min(5).required(),
    role: Joi.string().valid('Artisan', 'Customer', 'Admin').default('Customer').optional(),
    phone: Joi.string().length(10).pattern(/^(?!0)[0-9]{10}$/).required(),
    address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        zip: Joi.string(),
        country: Joi.string(),
    }),
    profileImage: Joi.string(),
    isVerified: Joi.boolean(),
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
    email: Joi.string().email().required(),
    password: Joi.string().trim().min(5).required(),
    newPassword: Joi.string().trim().min(5).required()
})
