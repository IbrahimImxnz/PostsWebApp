const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // window time
  max: 5, // max 5 login attempts in a 10 min window
  message: "Too many login attempts, try again later",
});

const postLimiter = postLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "You passed your hourly post limit",
});

module.exports = { loginLimiter, postLimiter };
