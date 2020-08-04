let nodemailer = require("nodemailer");

module.exports = SendEmail = async (to, subject, text, html = "") => {
  let transporter = nodemailer.createTransport({
    host: `${process.env.EMAIL_SMTP_HOST}`,
    port: parseInt(process.env.EMAIL_SMTP_PORT),
    secure: Boolean(process.env.EMAIL_SMTP_IS_SECURE), // true for 465, false for other ports
    auth: {
      user: `${process.env.EMAIL_SMTP_USER}`, // generated ethereal user
      pass: `${process.env.EMAIL_SMTP_PASS}`, // generated ethereal password
    },
  });

  let sendTheMail = await transporter.sendMail({
    from: `${process.env.EMAIL_SMTP_FROM}`, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
  if (!sendTheMail)
    return {
      success: false,
      error: true,
      message: "فرستادن ایمیل با موفقیت انجام نشد.",
    };

  return {
    success: true,
    error: false,
    message: "فرستادن ایمیل با موفقیت انجام شد.",
  };
};
