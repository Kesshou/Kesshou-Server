/*
*Author: blackkite0206233
*Description: This file is used to get student's absent state. Used web spider.
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
    This function is used to get student's absent state. Used promise.
*Usage:
    schoolAccount: student's school account.
    schoolPwd: student's school password.
    return:
        resolve: a json type absentStates.
        reject: the reason of error.
*/
var getAbsentState = function(schoolAccount, schoolPwd) {
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
        request.postAsync(formLogin).then(function(result) {
            var formAbsent = {
                url: "https://stuinfo.taivs.tp.edu.tw/work.asp",
                encoding: "binary",
                jar: j
            };
            return request.getAsync(formAbsent);
        }).then(function(result) {
            var classno = ["早", "升", "一", "二", "三", "四", "午", "五", "六", "七", "八", "降", "九", "十"]
            var absentStates = [];
            var $ = cheerio.load(iconv.decode(new Buffer(result.body, "binary"), "Big5"));
            var rows = $("table tr");
            for(var i = 2; i < rows.length; i++) {
                var sub = rows.eq(i).children();
                for(var j = 5; j <= sub.length; j++) {
                    if(sub.eq(j).text().trim()) {
                        var absentState = {};
                        var date = sub.eq(3).text().trim();
                        absentState.date = (parseInt(date.substr(0, 3)) + 1911).toString() + date.substr(3).replace(".", "/").replace(".", "/");
                        absentState.type = sub.eq(j).text().trim();
                        absentState.class = classno[j - 5];
                        absentStates.push(absentState);
                    }
                }
            }
            console.log(absentStates);
            resolve(absentStates);
        }).catch(function(error) {
            reject("伺服器錯誤");
        });
    });
}

module.exports = {

    getAbsentState: getAbsentState
};
