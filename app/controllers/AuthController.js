const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const db = require("../models");
const SMSService = require("../services/Sms");
const SendEmail = require("../services/SendEmail");
const SecureEncryption = require("../services/SecureEncryption");
const { createTokens } = require("../services/auth");

// Loggin user in
exports.SigninStart = async (req, res) => {
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

  let input = {};
  if (req.body.phone_number) input.phone_number = req.body.phone_number;
  if (req.body.email) input.email = req.body.email;

  if (!req.body.phone_number && !req.body.email)
    return res.json({
      success: false,
      err: true,
      message: "ایمیل یا شماره تلفن الزامیست.",
    });

  //check if User exists
  // const user = await db.User.findOne(input);
  // if (user)
  //   return res.json({
  //     success: false,
  //     err: true,
  //     message: "یوزر قبلا ثبت شده است.",
  //   });

  //check if Code exists
  const signInCode = await db.SigninCode.find()
    .limit(1)
    .sort({ updatedAt: -1 })
    .findOne(input);

  if (signInCode) {
    dateItem = new Date(signInCode.createdAt);
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

  if (input.phone_number) {
    const temp = await SMSService.sendLoginSms(req.body.phone_number, code);
    //If SMS was successfull create a record
    if (temp != 200) {
      return res.json({
        success: false,
        err: true,
        message: "تکمیل عملیات در دیتابیس با موفقیت انجام نشد.",
      });
    }
  }
  if (input.email) {
    const text = "خوش آمدید. کد ورود برای شما: " + code + " \nبیمه سینا ";
    const sendEmail = await SendEmail(input.email, "بیمه سینا", text);
    if (!sendEmail)
      return res.json({
        success: false,
        err: true,
        message: "ایمیل فرستاده نشد.",
      });
  }
  input.code = code;
  // Create a Code record
  const singInCode = await db.SigninCode.create(input);
  if (!singInCode)
    return res.json({
      success: false,
      err: true,
      message: "تکمیل عملیات در دیتابیس با موفقیت انجام نشد.",
    });

  //َAll Good
  return res.json({
    success: true,
    err: false,
    message: "کد برای شما با موفقیت ارسال شد.",
  });
};

// Loggin user in
exports.SigninComplete = async (req, res) => {
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
  const code = await db.SigninCode.find()
    .limit(1)
    .sort({ updatedAt: -1 })
    .findOne({ code: req.body.code });

  if (code) {
    dateItem = new Date(code.createdAt);
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

  //check if User exists
  let user = await db.User.findOne({ phone_number: code.phone_number });
  if (!user) {
    let input = {};
    if (code.phone_number) input.phone_number = code.phone_number;
    if (code.email) input.email = code.email;

    user = await db.User.create(input);
    if (!user)
      return res.json({
        success: false,
        err: true,
        message: "تکمیل عملیات در دیتابیس برای یوزر با موفقیت انجام نشد.",
      });
  }

  const [token, refreshToken] = await createTokens(user);
  if (!token || !refreshToken)
    return res.json({
      success: false,
      err: true,
      message: "امکان ایجاد token در حال حاظر نیست.",
    });

  const theTokenExpDate =
    Date.now() + process.env.JWT_TOKEN_COOKIE_EXPIRATION * 60000;
  const refreshTokenExpDate =
    Date.now() + process.env.JWT_REFRESH_COOKIE_EXPIRATION * 60000;

  const encryptedToken = SecureEncryption.encrypt(token);
  const encryptedRefreshToken = SecureEncryption.encrypt(refreshToken);

  return res
    .cookie("x-authorization", encryptedToken, {
      expires: new Date(theTokenExpDate),
      httpOnly: Boolean(process.env.COOKIE_IS_HTTP_ONLY),
      secure: Boolean(process.env.COOKIE_IS_SECURE),
    })
    .cookie("x-refresh", encryptedRefreshToken, {
      expires: new Date(refreshTokenExpDate),
      httpOnly: Boolean(process.env.COOKIE_IS_HTTP_ONLY),
      secure: Boolean(process.env.COOKIE_IS_SECURE),
    })
    .json({
      success: true,
      err: false,
      message: "خوش آمدید",
    });
};

// Log user out
exports.logout = async (req, res) => {
  return res.clearCookie("x-authorization").clearCookie("x-refresh").json({
    success: true,
    err: false,
    message: "عملیات با موفقیت انجام شد.",
  });
};

// Find a single User with an id
exports.isAuthenticated = async (req, res, next) => {
  var token = null;
  var refreshToken = null;
  try {
    const cookieArray = req.headers.cookie.split(";");

    cookieArray.map((item) => {
      if (item.includes("x-authorization="))
        token = item.split("x-authorization=")[1];
      else if (item.includes("x-refresh="))
        refreshToken = item.split("x-refresh=")[1];
    });
  } catch (e) {}

  if (!token || !refreshToken)
    return res.json({
      success: false,
      err: true,
      message: "یوزر مهمان است.",
    });

  try {
    token = SecureEncryption.decrypt(token);
    refreshToken = SecureEncryption.decrypt(refreshToken);

    let user = jwt.verify(token, process.env.JWT_THE_TOKEN_SECRET);
    console.log("the user is ", user);
    user = user.user;
    if (user.role != "student" && user.role != "admin")
      return res.json({
        success: false,
        err: true,
        message: "لطفا ابتدا Login کنید.",
      });

    return res.json({
      success: true,
      err: false,
      message: "خوش آمدید",
      data: user,
    });
  } catch (err) {
    return res.json({
      success: false,
      err: true,
      message: "کد منقضی شده است.",
      token,
      errMessage: err,
    });
  }
};

exports.jwtStudent = async (req, res) => {
  //check if User exists
  //code.phone_number
  const user = await db.User.findOne({ phone_number: "09127170126" });
  if (!user)
    return res.json({
      success: false,
      err: true,
      message: "اطلاعات با این مشخصات یافت نشد.",
    });

  const [token, refreshToken] = await createTokens(user);
  if (!token || !refreshToken)
    return res.json({
      success: false,
      err: true,
      message: "امکان ایجاد token در حال حاظر نیست.",
    });

  const theTokenExpDate =
    Date.now() + process.env.JWT_TOKEN_COOKIE_EXPIRATION * 60000;
  const refreshTokenExpDate =
    Date.now() + process.env.JWT_REFRESH_COOKIE_EXPIRATION * 60000;

  const encryptedToken = SecureEncryption.encrypt(token);
  const encryptedRefreshToken = SecureEncryption.encrypt(refreshToken);

  return res
    .cookie("x-authorization", encryptedToken, {
      expires: new Date(theTokenExpDate),
      httpOnly: Boolean(process.env.COOKIE_IS_HTTP_ONLY),
      secure: Boolean(process.env.COOKIE_IS_SECURE),
    })
    .cookie("x-refresh", encryptedRefreshToken, {
      expires: new Date(refreshTokenExpDate),
      httpOnly: Boolean(process.env.COOKIE_IS_HTTP_ONLY),
      secure: Boolean(process.env.COOKIE_IS_SECURE),
    })
    .redirect("/api/auth/is-authenticated");
};

exports.jwtAdmin = async (req, res) => {
  //check if User exists
  //code.phone_number
  const user = await db.User.findOne({ phone_number: "09120000000" });
  if (!user)
    return res.json({
      success: false,
      err: true,
      message: "اطلاعات با این مشخصات یافت نشد.",
    });

  const [token, refreshToken] = await createTokens(user);
  if (!token || !refreshToken)
    return res.json({
      success: false,
      err: true,
      message: "امکان ایجاد token در حال حاظر نیست.",
    });

  const encryptedToken = SecureEncryption.encrypt(token);
  const encryptedRefreshToken = SecureEncryption.encrypt(refreshToken);

  const theTokenExpDate =
    Date.now() + process.env.JWT_TOKEN_COOKIE_EXPIRATION * 60000;
  const refreshTokenExpDate =
    Date.now() + process.env.JWT_REFRESH_COOKIE_EXPIRATION * 60000;

  return res
    .cookie("x-authorization", encryptedToken, {
      expires: new Date(theTokenExpDate),
      httpOnly: Boolean(process.env.COOKIE_IS_HTTP_ONLY),
      secure: Boolean(process.env.COOKIE_IS_SECURE),
    })
    .cookie("x-refresh", encryptedRefreshToken, {
      expires: new Date(refreshTokenExpDate),
      httpOnly: Boolean(process.env.COOKIE_IS_HTTP_ONLY),
      secure: Boolean(process.env.COOKIE_IS_SECURE),
    })
    .redirect("/api/auth/is-authenticated");
};
