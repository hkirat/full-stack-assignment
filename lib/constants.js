module.exports = Object.freeze({
  STATUS_CODES: {
    200: "OK",
    400: "Bad Request",
    401: "Unauthorized",
  },
  TOKEN_SECRET: require("crypto").randomBytes(64).toString("hex"),
  AUTH_COOKIE: "access_token",
  ADMIN_ROUTES: { questions: "POST" },
});
