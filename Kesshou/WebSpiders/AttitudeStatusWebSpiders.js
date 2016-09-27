var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));
var fs = Promise.promisifyAll(require("fs"));
var iconv = require("iconv-lite");
var cheerio = require("cheerio");
var urlencode = require('urlencode');

var j = request.jar();
var ca;

var getAttitudeStatus = function(schoolAccount, schoolPwd) {
    return new Promise(function(resolve, reject) {
        fs.readFileAsync(__dirname + "/cert/taivsca.crt").then(function(result) {
            ca = result;
            var formLogin = {
                url: "https://stuinfo.taivs.tp.edu.tw/Reg_Stu.ASP",
                form: {
                    "txtS_NO": schoolAccount,
                    "txtPerno": schoolPwd
                },
                jar: j,
                agentOptions: {
                    ca: ca,
                },
                encoding: "binary",
                followAllRedirects: true
            };
            return request.postAsync(formLogin);
        }).then(function(result) {
            var formAttitude = {
                url: "https://stuinfo.taivs.tp.edu.tw/ds.asp",
                agentOptions: {
                    ca: ca,
                },
                encoding: "binary",
                jar: j
            };
            return request.getAsync(formAttitude);
        }).then(function(result) {
            var attitudeStatus = [];
            var $ = cheerio.load(iconv.decode(new Buffer(result.body, "binary"), "Big5"));
            var rows = $("table tr");
            for(var i = 2; i < rows.length; i++) {
                var attitudeStatu = {};
                var sub = rows.eq(i).children();
                var date = sub.eq(3).text().trim();
                attitudeStatu.date = parseInt(date.substr(0, 3)).toString() + date.substr(3).replace(".", "/").replace(".", "/");
                attitudeStatu.item = sub.eq(5).text().trim();
                attitudeStatu.text = sub.eq(6).text().trim();
                attitudeStatus.push(attitudeStatu);

            }
            console.log(attitudeStatus);
            resolve(attitudeStatus);
        }).catch(function(error) {
            reject(error);
        });
    });
}

module.exports = {

    getAttitudeStatus: getAttitudeStatus
};
