module.exports = (app) => {
  const PeymentController = require("../controllers/PeymentController");
  // const NationalIDValidation = require("../validations/NationalIDValidation");
  // const UserValidations = require("../validations/UserValidations");
  // const jwtStudentMiddleware = require("../middlewares/JWTStudentMiddleware");

  var router = require("express").Router();

  router.post(
    "/verify-peyment-request",
    PeymentController.verifyPaymentRequest
  );
  app.use("/api/peyment", router);
};
