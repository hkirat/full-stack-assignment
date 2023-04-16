const crypto = require("crypto");
const passport = require("passport");
const LocatStrategy = require("passport-local");
const jsonWebToken = require("jsonwebtoken");
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");

const {
  JWT_SECRET,
  accessTokenValidityInSeconds,
  refreshTokenValidityInSeconds,
} = require("../../../env.json");
const { users } = require("../../specs/index");
// local strategy code
const localLoginWithEmail = new LocatStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    try {
      const user = users.find((u) => {
        return u.email === email && u.password === password;
      });

      // done(error,user);
      if (user) return done(null, user);
      //  if user is not found
      return done("User was not found in db", null);
    } catch (error) {
      error.status = 401;
      return done(error, null);
    }
  }
);
// jwt strategy code
const jwtOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: JWT_SECRET,
};
const userAuthenticationUsingJWT = new JWTStrategy(
  jwtOption,
  (payload, done) => {
    const user = users.find((u) => {
      return u.email === payload.email;
    });
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  }
);

// registering local and jwt starategies with passport
passport.use("local-login-with-email", localLoginWithEmail);
passport.use("user-authentication-using-jwt", userAuthenticationUsingJWT);

const requireUserloginWithEmail = passport.authenticate(
  "local-login-with-email",
  { session: false, failWithError: true }
);

const requireUserAuthenticationUsingJWT = passport.authenticate(
  "user-authentication-using-jwt",
  { session: false, failWithError: true }
);
/* 
    JWT Helpers 
*/

const createJwtTokens = (user) => {
  return {
    accessToken:
      "JWT " +
      jsonWebToken.sign(
        {
          email: user.email,
          id: user._id,
          key: user.key,
          accessTokenValidityInSeconds,
        },
        JWT_SECRET
      ),
    refreshToken:
      "JWT " +
      jsonWebToken.sign(
        {
          email: user.email,
          id: user._id,
          key: user.key,
          refreshTokenValidityInSeconds,
        },
        JWT_SECRET
      ),
  };
};

//
const requireAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  const error = new Error("You are not authorized to perform this Action");
  error.status = 403;
  next(error);
};

module.exports = {
  requireUserloginWithEmail,
  requireUserAuthenticationUsingJWT,
  requireAdmin,
  createJwtTokens,
};
