const PaginationPageMiddleware = (req, res, next) => {
  console.log("PageNumber ----------------", req.body.page);

  if (req.body.page && req.body.page < 1) {
    console.log("pageValue", req.body.page);
    req.body.page = 1;
  }

  next();
};

module.exports = PaginationPageMiddleware;
