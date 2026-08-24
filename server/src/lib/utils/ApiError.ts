class ApiError extends Error {
    statusCode: number;
    message: string;
    isOperational: boolean;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = true;
    }
}

export default ApiError;