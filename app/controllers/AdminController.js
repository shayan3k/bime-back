const { validationResult } = require("express-validator");
const db = require("../models");
const ImageUpload = require("../services/ImageUpload");
const RemoveFile = require("../services/RemoveFile");

//User Manage
exports.adminGetAllUser = async (req, res) => {
  const [users, itemCount] = await Promise.all([
    db.User.find({ role: "user" })
      .limit(parseInt(process.env.PAGE_ITEM_COUNT))
      .skip(parseInt(req.body.page - 1) * parseInt(process.env.PAGE_ITEM_COUNT))
      .sort({ createdAt: -1 })
      .lean()
      .exec(),
    db.User.find({ role: "user" }).countDocuments({}),
  ]);

  if (!users)
    return res.json({
      success: false,
      err: true,
      message: "اطلاعاتی در دیتابیس یافت نشد.",
    });

  const pageCount = Math.ceil(itemCount / process.env.PAGE_ITEM_COUNT);

  return res.json({
    success: true,
    error: false,
    message: "عملیات با موفقیت انجام شد.",
    data: {
      hasMore: !(pageCount == req.body.page),
      itemCount: itemCount,
      pageCount: pageCount,
      data: users,
    },
  });
};
exports.adminGetSingleUser = async (req, res) => {
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

  const theUser = await db.User.findOne({
    _id: req.body.id,
  });

  if (!theUser)
    return res.json({
      success: false,
      err: true,
      message: "اطلاعاتی در دیتابیس یافت نشد.",
    });

  return res.json({
    success: true,
    error: false,
    message: "عملیات با موفقیت انجام شد.",
    data: theUser,
  });
};
exports.adminUserBlockUpdate = async (req, res) => {
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

  const user = await db.User.findOne({
    _id: req.body.id,
  });
  if (!user)
    return res.json({
      success: false,
      err: true,
      message: "یوزری با این مشخصات یافت نشد.",
    });

  user.is_active = !user.is_active;

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
exports.adminUpdateSingleUser = async (req, res) => {
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

  const user = await db.User.findOne({
    _id: req.body.id,
  });
  if (!user)
    return res.json({
      success: false,
      err: true,
      message: "یوزری با این مشخصات یافت نشد.",
    });

  user.phone_number = req.body.phone_number;
  user.name = req.body.name;
  user.lastname = req.body.lastname;
  user.email = req.body.email;
  user.balance = req.body.balance;

  if (user.image != req.body.image) user.image = "default.png";

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
