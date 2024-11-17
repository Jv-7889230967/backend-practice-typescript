export class ApiError extends Error {
    message: string;
    statusCode: number;
    status: string;
    isOperational: boolean;
    errors:any;
    success:any;

    constructor(message: string, statusCode: number) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;

        // Ensure the error stack trace includes the class name for debugging
        Error.captureStackTrace(this, this.constructor);
    }
}
