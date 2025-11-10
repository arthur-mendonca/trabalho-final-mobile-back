const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../db/models/user");
const AuthService = require("../services/Auth/Auth.service");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "Usuário não encontrado" });
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
          return done(null, false, { message: "Credenciais inválidas" });
        }
        // Retorna o usuário;
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["user:email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const username = profile.username || profile.displayName || `github_${profile.id}`;
        const email = Array.isArray(profile.emails) && profile.emails.length > 0
          ? profile.emails[0].value
          : `${username}@github.local`;

        const user = await AuthService.upsertGithubUser({
          githubId: String(profile.id),
          username,
          email,
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);
