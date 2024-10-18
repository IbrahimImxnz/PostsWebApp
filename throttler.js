const slowDown = require("express-slow-down");

const throttler = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 20, // 20 requests per 15 minutes then delay
  delayMs: 500,
  message: "Too many requests, please slow down",
});

module.exports = throttler;
