function buildErrorResponse(errorCode, errorMessage, messageVars, numericErrorCode, error, statusCode, res) {
    res.set({
        'X-Epic-Error-Name': errCode,
        'X-Epic-Error-Code': numErrorCode
    });

    res.status(statusCode).json({
        errCode,
        errorMessage,
        messageVars,
        numErrorCode,
        originatingService: "any",
        intent: "prod",
        error_description: errorMessage,
        error
    });
}

module.exports = {
    buildErrorResponse
};
