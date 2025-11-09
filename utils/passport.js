const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../db/models/user');


passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return done(null, false, { message: 'Usuário não encontrado' });
            }
            const ok = await bcrypt.compare(password, user.password);
            if (!ok) {
                return done(null, false, { message: 'Credenciais inválidas' });
            }
            // Retorne o usuário; em seguida você pode emitir um JWT na rota
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));