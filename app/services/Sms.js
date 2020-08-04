const axios = require("axios");
const SMSConfig = require("../config/SMSConfig");

exports.sendWelcomeSms = async (toNumber, code) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SMSConfig.patternUrl}${SMSConfig.apikey}&pid=${SMSConfig.welcomePattern}&fnum=${SMSConfig.from}&tnum=${toNumber}&p1=code&v1=${code}`,
      method: "get",
    })
      .then((res) => resolve(200))
      .catch((e) => reject(501));
  });
};

exports.sendLoginSms = async (toNumber, code) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SMSConfig.patternUrl}${SMSConfig.apikey}&pid=${SMSConfig.loginPattern}&fnum=${SMSConfig.from}&tnum=${toNumber}&p1=code&v1=${code}`,
      method: "get",
    })
      .then((res) => resolve(200))
      .catch((e) => reject(501));
  });
};

exports.sendVerifySms = async (toNumber, code) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SMSConfig.patternUrl}${SMSConfig.apikey}&pid=${SMSConfig.verifyPattern}&fnum=${SMSConfig.from}&tnum=${toNumber}&p1=code&v1=${code}`,
      method: "get",
    })
      .then((res) => resolve(200))
      .catch((e) => reject(501));
  });
};
