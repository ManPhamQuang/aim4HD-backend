const AppError = require("../utils/appError");

module.exports = (error, req, res, next) => {
    let errorMsgObj = error.isOperational ? error : undefined;
    if (error.name === "CastError") {
        errorMsgObj = new AppError(
            `ID: ${error.value} can not be parsed. Try again !!!`,
            400
        );
    }

    if (error.name === "ValidationError") {
        let message = "";
        Object.values(error.errors).forEach((m) => (message += `${m}. `));
        errorMsgObj = new AppError(message, 404);
    }

    if (error.name === "MongoError" && error.code === 11000) {
        console.log(error);
        errorMsgObj = new AppError(
            `Duplicate value (${Object.keys(error.keyPattern)[0]}: ${
                error.keyValue[Object.keys(error.keyPattern)[0]]
            }). Please use another value`,
            404
        );
    }

    if (errorMsgObj)
        res.status(errorMsgObj.statusCode).json({
            status: errorMsgObj.status,
            message: errorMsgObj.message,
        });
    else {
        console.log(error);
        res.status(500).json({
            status: "error",
            message:
                "Something went wrong with a server. Please try again later",
            error,
            stack: error.stack,
            name: error.name,
        });
    }
};
