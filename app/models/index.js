const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.User = require("./UserModel.js")(mongoose);

db.VerifyCode = require("./VerifyCodeModel")(mongoose);
db.SigninCode = require("./SignInCodeModel")(mongoose);

db.Peyment = require("./PeymentModel")(mongoose);

module.exports = db;
