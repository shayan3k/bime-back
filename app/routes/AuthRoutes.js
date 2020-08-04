module.exports = (app) => {
  const UserValidations = require("../validations/UserValidations");
  const AuthController = require("../controllers/AuthController");
  var router = require("express").Router();

  router.post(
    "/singin-start",
    [UserValidations.phone_number, UserValidations.email],
    AuthController.SigninStart
  );
  router.post(
    "/singin-complete",
    [UserValidations.code],
    AuthController.SigninComplete
  );

  router.post("/logout", AuthController.logout);
  router.get("/jwt-student", AuthController.jwtStudent);
  router.get("/jwt-admin", AuthController.jwtAdmin);
  router.get("/is-authenticated", AuthController.isAuthenticated);

  app.use("/api/auth", router);

  // Error handling
  app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      // Send the error rather than to show it on the console
      res.status(401).send(err);
    } else {
      next(err);
    }
  });
};
