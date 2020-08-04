const { check } = require("express-validator");

module.exports.amount = [
  check("amount")
    .isString()
    .isInt()
    .isLength({ min: 4 })
    .withMessage("مبلغ وارد شده را بررسی مجدد نمایید")
    .trim()
    .escape(),
];
