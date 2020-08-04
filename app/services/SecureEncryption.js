const CryptoJS = require("crypto-js");

// Code goes here
var keySize = 256;
var ivSize = 128;
var iterations = 100;

// Encript a token
// exports.encrypt = (token) => {
//   token = token.toString();
//   var salt = CryptoJS.lib.WordArray.random(128 / 8);

//   var key = CryptoJS.PBKDF2(process.env.APP_CRYPTOJS_SECERET, salt, {
//     keySize: keySize / 32,
//     iterations: iterations,
//   });

//   var iv = CryptoJS.lib.WordArray.random(128 / 8);

//   var encrypted = CryptoJS.AES.encrypt(token, key, {
//     iv: iv,
//     padding: CryptoJS.pad.Pkcs7,
//     mode: CryptoJS.mode.CBC,
//   });

//   // salt, iv will be hex 32 in length
//   // append them to the ciphertext for use  in decryption
//   var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
//   console.log("encrypted:  ", transitmessage);
//   return transitmessage;
// };

// // Encript a token
// exports.decrypt = (token) => {
//   var salt = CryptoJS.enc.Hex.parse(token.substr(0, 32));
//   var iv = CryptoJS.enc.Hex.parse(token.substr(32, 32));
//   var encrypted = token.substring(64);

//   var key = CryptoJS.PBKDF2(process.env.APP_CRYPTOJS_SECERET, salt, {
//     keySize: keySize / 32,
//     iterations: iterations,
//   });

//   var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
//     iv: iv,
//     padding: CryptoJS.pad.Pkcs7,
//     mode: CryptoJS.mode.CBC,
//   });

//   console.log("decrypted   ", token);

//   return decrypted.toString();
// };

// CryptoJS.enc.Utf8

exports.encrypt = (token) => token;

// Encript a token
exports.decrypt = (token) => token;
