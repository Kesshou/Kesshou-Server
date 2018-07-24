/*
*Author: blackkite0206233
*Description: This file is used to get student's attitude status. Used web spider.
*/
var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));
var fs = Promise.promisifyAll(require("fs"));
var iconv = require("iconv-lite");
var cheerio = require("cheerio");

var j = request.jar();

/*
*Author: blackkite0206233
*Description:
    This function is used to get student's attitude status. Used promise.
*Usage:
    schoolAccount: student's school account.
    schoolPwd: student's school password.
    return:
        resolve: a json type attitude status.
        reject: the reason of error.
*/
var getAttitudeStatus = function(schoolAccount, schoolPwd) {
    return new Promise(function(resolve, reject) {
        var formLogin = {
            url: "https://stuinfo.taivs.tp.edu.tw/Reg_Stu.ASP",
            form: {
                "txtS_NO": schoolAccount,
                "txtPerno": schoolPwd
            },
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        };
        request.postAsync(formLogin).then(function (result) {
            var formAttitude = {
                url: "https://stuinfo.taivs.tp.edu.tw/ds.asp",
                encoding: "binary",
                jar: j
            };
            return request.getAsync(formAttitude);
        }).then(function(result) {
            var attitude = {};
            var AttitudeStatus = [];
            var AttitudeCount = {
                smallcite: 0,
                smallfault: 0,
                middlecite: 0,
                middlefault: 0,
                bigcite: 0,
                bigfault: 0,
            };
            var $ = cheerio.load(iconv.decode(new Buffer(result.body, "binary"), "Big5"));
            var rows = $("table tr");
            for(var i = 2; i < rows.length - 2; i++) {
                var attitudeStatus = {};
                var sub = rows.eq(i).children();
                var date = sub.eq(3).text().trim();
                attitudeStatus.date = (parseInt(date.substr(0, 3)) + 1911).toString() + date.substr(3).replace(".", "/").replace(".", "/");
                attitudeStatus.item = sub.eq(5).text().trim();
                attitudeStatus.text = sub.eq(6).text().trim();
                AttitudeStatus.push(attitudeStatus);
                var flag = 0;
                for(var j = 0; j < attitudeStatus.item.length; j++) {
                    if(attitudeStatus.item[j] == "次") {
                        flag = 0;
                        continue;
                    }
                    var num = "";
                    if(flag == 0) {
                        for(var k = j + 2; attitudeStatus.item[k] != "次"; k++) {
                            num += String.fromCharCode(attitudeStatus.item.substr(k, 1).charCodeAt(0) - 65248);
                        }
                        switch(attitudeStatus.item.substr(j, 2)) {
                            case "嘉獎":
                                AttitudeCount.smallcite += parseInt(num);
                                break;
                            case "小功":
                                AttitudeCount.middlecite += parseInt(num);
                                break;
                            case "大功":
                                AttitudeCount.bigcite += parseInt(num);
                                break;
                            case "警告":
                                AttitudeCount.smallfault += parseInt(num);
                                break;
                            case "小過":
                                AttitudeCount.middlefault += parseInt(num);
                                break;
                            case "大過":
                                AttitudeCount.bigfault += parseInt(num);
                                break;
                            default: break;
                        }
                        flag = 1;
                    }
                }
            }
            attitude.status = AttitudeStatus;
            attitude.count = AttitudeCount;
            console.log(attitude);
            resolve(attitude);
        }).catch(function(error) {
            reject(error);
        });
    });
}

module.exports = {

    getAttitudeStatus: getAttitudeStatus
};
