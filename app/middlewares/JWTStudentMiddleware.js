const db = require("../models");

module.exports = async (req, res, next) => {
  try {
    //should be change for deployment setup
    // const user = await db.User.findOne({ phone_number: req.user.phone_number });
    const user = await db.User.findOne({ phone_number: "09127170126" });
    req.user = user;

    if (!user)
      return res.json({
        success: false,
        err: true,
        message: "یوزری با این مشخصات در دیتابیس نیست.",
      });

    if (!user.is_active)
      return res.json({
        success: false,
        err: true,
        message: "یوزری بلاک شده است.",
      });

    if (user.role != "student")
      return res.json({
        success: false,
        err: true,
        message: "یوزو دانش آموز نیست",
      });

    next();
  } catch (e) {
    return res.json({
      success: false,
      err: true,
      message: "یوزو مهمان است",
    });
  }
};
