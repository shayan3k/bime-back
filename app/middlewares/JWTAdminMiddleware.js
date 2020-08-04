const db = require("../models");

module.exports = async (req, res, next) => {
  //should be change for deployment setup
  // const user = await db.User.findOne({ phone_number: req.user.phone_number });
  const user = await db.User.findOne({ phone_number: "09120000000" });
  req.user = user;

  if (!user)
    return res.json({
      success: false,
      err: true,
      message: "یوزری با این مشخصات در دیتابیس نیست.",
    });

  if (user.role != "admin")
    return res.json({
      success: false,
      err: true,
      message: "یوزو ادمین نیست",
    });

  next();
};
