export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            res.status(400).json({ Error: error.details.map(ele => ele.message) });
            return;
        }
        next();
    }
};