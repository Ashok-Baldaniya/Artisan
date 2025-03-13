export const sendResponse = (res, statusCode = 200, message = '', data = null, error = null) => {
    const response = {
        success: statusCode < 400,
        message
    };

    if (data) {
        response.data = data;
    }

    if (error) {
        response.error = process.env.NODE_ENV === 'production'
            ? error.message
            : {
                message: error.message,
                stack: error.stack
            };
    }

    return res.status(statusCode).json(response);
};