const { validationResult } = require("express-validator");
const zarinpalService = require("../services/Zarinpal");
const ImageUpload = require("../services/ImageUpload");
const RemoveFile = require("../services/RemoveFile");

const db = require("../models");

//User manage information
exports.userGetUserInformation = async (req, res) => {
  const user = await db.User.findOne({ phone_number: req.user.phone_number });

  if (!user)
    return res.json({
      success: false,
      err: true,
      message: "اطلاعاتی در دیتابیس یافت نشد.",
    });

  return res.json({
    message: "عملیات با موفقیت انجام شد.",
    success: true,
    error: false,
    data: {
      phone_number: user.phone_number,
      reference_phone_number: user.reference_phone_number,
      name: user.name,
      lastname: user.lastname,
      name_english: user.name_english,
      lastname_english: user.lastname_english,
      father_name: user.father_name,
      grade_id: user.grade_id,
      school: user.school,
      province_id: user.province_id,
      city_id: user.city_id,
      image: user.image,
    },
  });
};
exports.userUpdateUserInformation = async (req, res) => {
  //Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      err: true,
      message: errors.errors[errors.errors.length - 1].msg,
      error: errors,
    });
  }

  const user = await db.User.findOne({ phone_number: req.user.phone_number });
  if (!user)
    return res.json({
      success: false,
      err: true,
      message: "اطلاعاتی در دیتابیس یافت نشد.",
    });

  if (req.files) {
    const previousImage = await RemoveFile(
      process.env.USER_IMAGE_PATH,
      user.image
    );
    console.log(previousImage);
    if (!previousImage.success)
      return res.json({
        success: uploadedImage.success,
        err: uploadedImage.err,
        message: uploadedImage.message,
        hello: "file removal error",
      });

    const uploadedImage = await ImageUpload(
      req,
      req.files.image,
      req.user.phone_number,
      process.env.USER_IMAGE_PATH
    );
    if (!uploadedImage.success)
      return res.json({
        success: uploadedImage.success,
        err: uploadedImage.err,
        message: uploadedImage.message,
        hello: "file upload error",
      });
  }

  // console.log("file seen", uploadedImage);

  user.name = req.body.name;
  user.lastname = req.body.lastname;
  user.name_english = req.body.name_english;
  user.lastname_english = req.body.lastname_english;
  user.father_name = req.body.father_name;
  user.grade_id = req.body.grade_id;
  user.city_id = req.body.city_id;
  user.province_id = req.body.province_id;
  user.email = req.body.email;
  user.school = req.body.school;

  if (uploadedImage) user.image = uploadedImage.image;

  const modifiedUser = await user.save();
  if (!modifiedUser)
    return res.json({
      success: false,
      err: true,
      message: "تکمیل عملیات در دیتابیس با موفقیت انجام نشد.",
    });

  return res.json({
    success: true,
    err: false,
    message: "عملیات با موفقیت انجام شد.",
  });
};
exports.userSubmitPhoneNumber = async (req, res) => {
  //Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      err: true,
      message: errors.errors[errors.errors.length - 1].msg,
      error: errors,
    });
  }

  const user = await db.User.findOne({ phone_number: req.user.phone_number });
  if (!user)
    return res.json({
      success: false,
      err: true,
      message: "اطلاعاتی در دیتابیس یافت نشد.",
    });

  if (user.phone_number)
    return res.json({
      success: false,
      err: true,
      message: "اطلاعاتی قبلا ثبت شده است.",
    });

  //check if Code exists
  const verifyCode = await db.VerifyCode.find()
    .limit(1)
    .sort({ updatedAt: -1 })
    .findOne({ phone_number: req.body.phone_number });

  if (verifyCode) {
    dateItem = new Date(verifyCode.updatedAt);
    dateNow = new Date();
    var diffMs = dateNow - dateItem; // milliseconds between now & Christmas
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    diffMins = Math.abs(diffMins);
    if (diffMins < process.env.SMS_RESEND_MINUNES) {
      return res.json({
        success: false,
        err: true,
        message: `لطفا برای استفاده از سرویس پیام کوتاه, ${
          process.env.SMS_RESEND_MINUNES - diffMins
        } دقیقه صبر کنید.`,
      });
    }
  }

  //Generate the code
  var code = Math.floor(100000 + Math.random() * 900000);

  const temp = await SMSService.sendVerifySms(req.body.phone_number, code);
  //If SMS was successfull create a record
  if (temp != 200) {
    return res.json({
      success: false,
      err: true,
      message: "تکمیل عملیات در دیتابیس با موفقیت انجام نشد.",
    });
  }

  return res.json({
    message: "عملیات با موفقیت انجام شد.",
    success: true,
    error: false,
    data: {
      phone_number: user.phone_number,
      reference_phone_number: user.reference_phone_number,
      name: user.name,
      lastname: user.lastname,
      name_english: user.name_english,
      lastname_english: user.lastname_english,
      father_name: user.father_name,
      grade_id: user.grade_id,
      school: user.school,
      province_id: user.province_id,
      city_id: user.city_id,
      image: user.image,
    },
  });
};
exports.userVerifyPhoneNumber = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      err: true,
      message: errors.errors[errors.errors.length - 1].msg,
      error: errors,
    });
  }

  //check if Code exists
  const code = await db.VerifyCode.find()
    .limit(1)
    .sort({ updatedAt: -1 })
    .findOne({ code: req.body.code });

  if (code) {
    dateItem = new Date(code.updatedAt);
    dateNow = new Date();
    var diffMs = dateNow - dateItem; // milliseconds between now & Christmas
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    diffMins = Math.abs(diffMins);
    if (diffMins > process.env.SMS_EXPIRATION_MINUTES) {
      return res.json({
        success: false,
        err: true,
        message: "کد منقضی شده است.",
      });
    }
  } else {
    return res.json({
      success: false,
      err: true,
      message: "کد اشتباه است.",
    });
  }

  let input = {};
  if (code.phone_number) input.phone_number = code.phone_number;
  if (!code.email)
    return res.json({
      success: false,
      err: true,
      message: "ایمیل برای این یوزر تعریف شده",
    });

  input.email = code.email;
  //check if User exists
  const user = await db.User.findOne(input);
  if (!user)
    return res.json({
      success: false,
      err: true,
      message: "یوزر در دیتابیس یافت نشد.",
    });

  user.phone_number = code.phone_number;

  const updatedUser = await db.User.save();
  if (!updatedUser)
    return res.json({
      success: false,
      err: true,
      message: "تکمیل عملیات در دیتابیس برای یوزر با موفقیت انجام نشد.",
    });

  return res.json({
    success: true,
    err: false,
    message: "عملیات با موفقیت انجام شد.",
  });
};

//submit deposit transaction
exports.userSubmitPaymentRequest = async (req, res) => {
  //Validation request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      err: true,
      message: errors.errors[errors.errors.length - 1].msg,
      error: errors,
    });
  }

  const user = await db.User.findOne({ phone_number: req.user.phone_number });
  if (!user)
    return res.json({
      success: false,
      err: true,
      message: "اطلاعاتی در دیتابیس یافت نشد.",
    });

  let input = {
    Amount: req.body.amount, // In Tomans
    CallbackURL: `${process.env.REACT_APP_URL}/${process.env.REACT_PEYMENT_CALLBACK_URI}`,
    Description:
      " پرداخت " + req.body.amount + " تومان بابت افزایش اعتبار پنل ",
    Email: user.email,
    Mobile: user.phone_number,
  };

  let pid = Math.floor(100000 + Math.random() * 900000).toString();

  const response = await zarinpalService.PaymentRequest({ ...input });
  if (!response || response.status != 100)
    return res.json({
      success: false,
      err: true,
      message: "عملیات با موفقیت انجام نشد.",
    });

  const peymentCreated = await db.Peyment.create({
    transaction_id: "pending",
    phone_number: input.Mobile,
    amount: input.Amount,
    email: input.Email,
    description: input.Description,
    authority: response.authority,
    pid: pid,
  });
  if (!peymentCreated)
    return res.json({
      success: false,
      err: true,
      message: "خطا در ارتباط با زرین پال.",
    });

  sessionObject = req.session;
  sessionObject.pid = pid;
  sessionObject.phone_number = req.user.phone_number;

  return res.json({
    success: true,
    err: false,
    message: "عملیات با موفقیت انجام شد.",
    data: response,
  });
};
