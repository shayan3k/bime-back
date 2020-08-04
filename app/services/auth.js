const jwt = require("jsonwebtoken");
const _ = require("lodash");

exports.createTokens = async (user) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ["phone_number", "role"]),
    },
    process.env.JWT_THE_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_THE_TOKEN_EXPIRATION,
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, "phone_number"),
    },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    }
  );

  return Promise.all([createToken, createRefreshToken]);
};

exports.refreshTokens = async (refreshToken, db) => {
  let userId = -1;
  try {
    const {
      user: { phone_number },
    } = jwt.decode(refreshToken);
    userId = phone_number;
  } catch (err) {
    return {
      err: true,
      success: false,
      message: err,
    };
  }

  if (!userId) {
    return {
      err: true,
      success: false,
      message: "یوزری با این برای این توکن یافت نشد",
    };
  }

  const user = await db.User.findOne({
    phone_number: userId,
  });

  if (!user) {
    return {
      err: true,
      success: false,
      message: "یوزری با این مشخصات یافت نشد",
    };
  }

  const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {
      err: true,
      success: false,
      message: "یوزرری با این مشخصات یافت نشد",
    };
  }

  const [newToken, newRefreshToken] = await this.createTokens(user);
  return {
    err: true,
    success: false,
    message: "عملیات با موفیت انجام شد",
    data: { token: newToken, refreshToken: newRefreshToken, user },
  };
};
