const { check } = require("express-validator");

const persianCharecters = /^[\u0622\u0627\u0628\u067E\u062A-\u062C\u0686\u062D-\u0632\u0698\u0633-\u063A\u0641\u0642\u06A9\u06AF\u0644-\u0648\u06CC\s]+$/;

const englishCharecters = /^[A-Za-z\d]+$/;

module.exports.id = [
  check("id")
    .isString()
    .isMongoId()
    .withMessage("ID وارد شده باید عدد یاشد.")
    .trim()
    .escape(),
];

module.exports.phone_number = [
  check("phone_number")
    .isString()
    .isInt()
    .withMessage("شماره موبایل وارد شده باید عدد یاشد.")
    .isLength({ min: 11, max: 11 })
    .withMessage("شماره موبایل خود را بررسی مجدد کنید.")
    .optional()
    .trim()
    .escape(),
];
// module.exports.reference_phone_number = [
//   check("reference_phone_number")
//     .isString()
//     .isInt()
//     .withMessage("شماره موبایل وارد شده باید عدد یاشد.")
//     .isLength({ min: 11, max: 11 })
//     .withMessage("شماره موبایل معرف خود را بررسی مجدد کنید.")
//     .custom((value, { req }) => {
//       if (value == req.body.phone_number) {
//         throw new Error("شماره تلفن با شماره تلفن معرف یکی است");
//       }
//       // Indicates the success of this synchronous custom validator
//       return true;
//     })
//     .optional()
//     .trim()
//     .escape(),
// ];

module.exports.code = [
  check("code")
    .isString()
    .isInt()
    .withMessage("کد وارد شده باید عدد یاشد.")
    .isLength({
      min: parseInt(process.env.SMS_CODE_LENGTH),
      max: parseInt(process.env.SMS_CODE_LENGTH),
    })
    .withMessage("کد وارد شده صحیح نیست.")
    .trim()
    .escape(),
];

module.exports.name = [
  check("name")
    .isString()
    .withMessage("نام وارد شده را بررسی مجدد کنید.")
    .matches(persianCharecters, "g")
    .withMessage("نام وارد شده فارسی نیست.")
    .trim()
    .escape(),
];

module.exports.lastname = [
  check("lastname")
    .isString()
    .withMessage("نام خانوادگی وارد شده را بررسی مجدد کنید.")
    .matches(persianCharecters, "g")
    .withMessage("نام خانوادگی وارد شده فارسی نیست.")
    .trim()
    .escape(),
];

module.exports.email = [
  check("email")
    .isString()
    .isEmail()
    .withMessage("ایمیل وارد شده را بررسی مجدد نمایید")
    .trim()
    .optional()
    .escape(),
];

module.exports.balance = [
  check("balance")
    .isString()
    .isInt()
    .withMessage("مبلغ وارد شده را بررسی مجدد کنید.")
    .trim()
    .escape(),
];

module.exports.image = [
  check("image")
    .isString()
    .withMessage("عکس آپلود شده خود را بررسی مجدد کنید.")
    .optional()
    .trim()
    .escape(),
];
