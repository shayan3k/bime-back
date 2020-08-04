const { validationResult } = require("express-validator");
const zarinpalService = require("../services/Zarinpal");
const db = require("../models");

// Submit a validation request
exports.verifyPaymentRequest = async (req, res) => {
  //get session instance
  sessionObject = req.session;

  //throw error if somthing went wrong
  if (!req.body.authority || !req.body.status || !sessionObject.pid)
    return res.json({
      success: false,
      err: true,
      message: "عملیات موفقیت آمیز نبود",
    });

  //if returned status is not OK
  if (req.body.status != "OK")
    return res.json({
      success: false,
      err: true,
      message: "خطا در اجرای زرین پال. عملیات با موقیت انجام نشد",
    });

  //get the current user phone number
  const phone_number = sessionObject.phone_number;
  const pid = sessionObject.pid;

  //try to find a record matching the provided data
  let peymentRecord = await db.Peyment.findOne({
    phone_number: phone_number,
    authority: req.body.authority,
    pid: pid,
  });
  if (!peymentRecord)
    return res.json({
      success: false,
      err: true,
      message: "رکوردی با این مشخصات یافت نشد",
    });

  //setting up data for validation
  let data = {
    Amount: peymentRecord.amount, // In Tomans
    Authority: peymentRecord.authority,
  };

  //verify data fron peyment DB record
  const response = await zarinpalService.PaymentVerification({ ...data });
  if (!response || response.status != 100)
    return res.json({
      success: false,
      err: true,
      message: "عملیات با موفقیت انجام نشد.",
    });

  //Update the record on DB
  peymentRecord.transaction_id = response.RefID;
  peymentRecord.pid = null;
  await peymentRecord.save();

  //Update user balance
  const user = await db.User.findOne({ phone_number: phone_number });
  if (!user)
    return res.json({
      success: false,
      err: true,
      message: "اطلاعاتی یوزر در دیتابیس یافت نشد.",
    });

  if (sessionObject.price && sessionObject.course_id) {
    //create a peyment log
    const peymentLog = await db.PeymentLog.create({
      phone_number: user.phone_number,
      course_id: sessionObject.course_id,
      course_session_id: sessionObject.course_session_id,
      price: sessionObject.price,
      type: "peyment",
    });
    if (!peymentLog)
      return res.json({
        success: false,
        err: true,
        message: "امکان ساخت رکورد پیمنت در دیتابیس نمی باشد.",
      });

    //create a enrollment log
    const enrollmentLog = await db.Enrollment.create({
      phone_number: user.phone_number,
      course_id: sessionObject.course_id,
      course_session_id: sessionObject.course_session_id,
    });
    if (!enrollmentLog)
      return res.json({
        success: false,
        err: true,
        message: "امکان ساخت رکورد اینرولمنت در دیتابیس نمی باشد.",
      });

    //now the balance is Zero
    user.balance = 0;
    await user.save();
  } else {
    user.balance = user.balance + parseInt(peymentRecord.amount);
    await user.save();
  }

  return res.json({
    success: true,
    err: false,
    message: "عملیات با موفقیت انجام شد.",
    data: response,
  });
};
