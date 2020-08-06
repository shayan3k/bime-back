module.exports = (app) => {
  const UserController = require("../controllers/UserController.js");
  const PeymentValidation = require("../validations/PeymentValidation");

  const UserValidations = require("../validations/UserValidations");
  const jwtUserMiddleware = require("../middlewares/JWTUserMiddleware");
  const PaginationPageMiddleware = require("../../app/middlewares/PaginationPageMiddleware");

  var router = require("express").Router();

  //User routes

  router.post("/get-user-information", UserController.userGetUserInformation);

  router.post(
    "/update-user-information",
    [
      UserValidations.name,
      UserValidations.lastname,
      UserValidations.email,
      UserValidations.image,
    ],
    UserController.userUpdateUserInformation
  );

  router.post(
    "/submit-phone-number",
    [UserValidations.phone_number],
    UserController.userSubmitPhoneNumber
  );

  router.post(
    "/verify-phone-number",
    [UserValidations.code],
    UserController.userVerifyPhoneNumber
  );

  //submit payment request
  router.post(
    "/submit-peyment-request",
    [PeymentValidation.amount],
    UserController.userSubmitPaymentRequest
  );

  app.use("/api/user", [jwtUserMiddleware, PaginationPageMiddleware], router);
  // app.use("/api/user",[PaginationPageMiddleware], router);
};
