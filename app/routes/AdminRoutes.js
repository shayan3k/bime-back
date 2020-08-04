const { Province, Comment } = require("../models");

module.exports = (app) => {
  const AdminController = require("../controllers/AdminController");
  const UserValidations = require("../validations/UserValidations");

  const JWTAdminMiddleware = require("../middlewares/JWTAdminMiddleware");
  const PaginationPageMiddleware = require("../../app/middlewares/PaginationPageMiddleware");

  var router = require("express").Router();

  //Admin routes
  //user manage routes
  router.post("/get-all-user", AdminController.adminGetAllUser);

  router.post(
    "/get-single-user",
    [UserValidations.id],
    AdminController.adminGetSingleUser
  );

  router.post(
    "/update-user-block",
    [UserValidations.id],
    AdminController.adminUserBlockUpdate
  );

  router.post(
    "/update-single-user",
    [
      UserValidations.id,
      UserValidations.phone_number,
      UserValidations.name,
      UserValidations.lastname,
      UserValidations.email,
      UserValidations.balance,
      UserValidations.image,
    ],
    AdminController.adminUpdateSingleUser
  );

  app.use("/api/admin", [JWTAdminMiddleware, PaginationPageMiddleware], router);
  // app.use("/api/admin", [PaginationPageMiddleware], router);
};
