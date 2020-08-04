const { refreshTokens } = require("../services/auth");
const SecureEncryption = require("../services/SecureEncryption");

const db = require("../models");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
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
  //if token and refresh token
  if (token && refreshToken) {
    token = SecureEncryption.decrypt(token);
    refreshToken = SecureEncryption.decrypt(refreshToken);

    try {
      const user = jwt.verify(token, process.env.JWT_THE_TOKEN_SECRET);
      console.log("user=>", user);
      req.user = user.user;
      console.log("all good");
    } catch (err) {
      const newTokens = await refreshTokens(refreshToken, db);
      try {
        const theTokenExpDate =
          Date.now() + process.env.JWT_TOKEN_COOKIE_EXPIRATION * 60000;
        const refreshTokenExpDate =
          Date.now() + process.env.JWT_REFRESH_COOKIE_EXPIRATION * 60000;

        res
          .cookie("x-authorization", newTokens.data.token, {
            expires: new Date(theTokenExpDate),
            httpOnly: Boolean(process.env.COOKIE_IS_HTTP_ONLY),
            secure: Boolean(process.env.COOKIE_IS_SECURE),
          })
          .cookie("x-refresh", newTokens.data.refreshToken, {
            expires: new Date(refreshTokenExpDate),
            httpOnly: Boolean(process.env.COOKIE_IS_HTTP_ONLY),
            secure: Boolean(process.env.COOKIE_IS_SECURE),
          });

        req.user = newTokens.data.user;

        console.log("token generated");
      } catch (e) {
        return res
          .clearCookie("x-authorization")
          .clearCookie("x-refresh")
          .json({
            success: true,
            err: false,
            message: "token برای این یوزر قابل ساخت نیست",
          });
      }
    }
  }

  //remove all token if only one of them exsists

  next();
};
