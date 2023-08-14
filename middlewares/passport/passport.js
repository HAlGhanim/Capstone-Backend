const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const config = require("../../config/keys");
const User = require("../../models/User");

exports.localStrategy = new LocalStrategy(
  {
    usernameField: "email",
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return done({ message: "Email isn't registered" }, false);
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done({ message: "Invalid credentials" }, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp * 1000) {
      return done(null, false);
    }
    try {
      const user = await User.findById(jwtPayload._id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
