class ValidationUtils {
    async isEmailValid(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(String(email || ""));
    }
}

module.exports = new ValidationUtils();