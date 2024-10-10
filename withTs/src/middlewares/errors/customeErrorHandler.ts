import { NextFunction, Request, Response } from "express";

const error = new Error()

//cutom error interface
interface CustomError extends Error {
    status?: number; //we made optional to flag it on every error
}

// we created a custom middleware to hadle all errors
const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500
    const errorMessage = error.message || "Internal server error"
    res.status(statusCode).json({
        status: statusCode,
        message: errorMessage
    })
}

export { CustomError, errorHandler };
