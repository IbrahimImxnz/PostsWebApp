const { validationResult } = require("express-validator");
// const { param, body } = require("express-validator");

const validateError = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success: false, message: result.array() });
  }
  next();
};

module.exports = validateError;
