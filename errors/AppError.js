class AppError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode || 500;
        this.message = message
            ? message
                .replaceAll("Validation error: ", "")
                .replaceAll("notNull Violation: ", "")
                .replaceAll("cannot be null", "não pode ser nulo")
                .replaceAll("\n", " ")
            : "Internal server error";
    }
}

module.exports = AppError;