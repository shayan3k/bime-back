const ZarinpalCheckout = require("zarinpal-checkout");

const zarinpal = ZarinpalCheckout.create(
  `${process.env.ZARINPAL_MERCHANT}`,
  !!process.env.ZARINPAL_IS_SANDBOX
);

//returns a response object
exports.PaymentRequest = (data) =>
  zarinpal
    .PaymentRequest({
      ...data,
    })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

//returns a response object
exports.PaymentVerification = (data) =>
  zarinpal
    .PaymentVerification({
      ...data,
    })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
