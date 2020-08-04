const express = require("express");
const bodyParser = require("body-parser");
const paginate = require("express-paginate");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
var cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
var session = require("express-session");
const db = require("./app/models");
const RefreshTokenMiddleware = require("./app/middlewares/RefreshTokenMiddleware");

dotenv.config();

const app = express();

//CORS middleware
app.use(
  cors({
    origin: [
      "*",
      `${process.env.REACT_APP_URL}`,
      "http://localhost:3000",
      "https://manshour.herokuapp.com",
      "http://manshour.herokuapp.com",
      // "http://manshour-deploy-shayan3k.fandogh.cloud",
      // "https://manshour-deploy-shayan3k.fandogh.cloud",
    ],
    credentials: true,
  })
);

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Session Configs
app.use(
  session({
    secret: process.env.SESSION_SECERET,
    resave: false,
    saveUninitialized: true,
    expires: new Date(Date.now() + process.env.SESSION_COOKIE_MAXAGE),
    cookie: {
      secure: false,
      httpOnly: true,
    },
  })
);

// Cookie parser for JWT
app.use(cookieParser());

// app.use(RefreshTokenMiddleware);

// Enable file Upload
app.use(
  fileUpload({
    safeFileNames: true,
    limits: { fileSize: 50 * 1024 * 1024 },
    createParentPath: true,
    preserveExtension: 4,
    debug: true,
    limitHandler: (req, res, next) => {
      return res.json({
        err: true,
        message: "حجم فایل بیشتر از اندازه تعیین شده است.",
      });
    },
  })
);

// keep this before all routes that will use pagination
app.use(
  paginate.middleware(
    process.env.PAGINATION_LIMIT,
    process.env.PAGINATION_MAXLIMIT
  )
);

//Database Connection
db.mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//Routes
require("./app/routes/AuthRoutes")(app);
require("./app/routes/AdminRoutes")(app);
require("./app/routes/UserRoutes")(app);
require("./app/routes/PeymentRoutes")(app);

//Redirect all other routes
app.get("/", (req, res) => {
  res
    .json({
      message:
        "Welcome to Authentication system provided with Express.js and MongoDB",
    })
    .end();
});

// set port, listen for requests
const PORT = process.env.PORT || 80;
app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  })
  .on("error", function (err) {
    if (err.errno === "EADDRINUSE") {
      console.log(
        `----- Port ${port} is busy, trying with port ${port + 1} -----`
      );
      listen(port + 1);
    } else {
      console.log(err);
    }
  });
