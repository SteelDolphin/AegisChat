const handleError = (res, message, statusCode = 500) => {
    console.error('Error:', message);
    res.status(statusCode).json({
        success: false,
        error: message
    });
};

module.exports = { handleError }; 