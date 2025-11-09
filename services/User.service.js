const User = require("../db/models/user");

class UserService {
    async register({
        username,
        email,
        password,
        githubId = null,
        role = 'cliente'
    }) {
        try {
            const user = await User.create({
                username,
                email,
                password,
                githubId,
                role,
            });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async changePassword(userId, newPassword) {
        try {
            // Usa individualHooks para disparar o hook beforeSave em update
            const [affected] = await User.update(
                { password: newPassword },
                { where: { id: userId }, individualHooks: true }
            );
            return affected > 0;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new UserService();