/*
*Author: yoyo930021
*Description: This file is used to check if the student is exist.
*/
var Promise = require('bluebird');
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var iconv = require('iconv-lite');

/*
*Author: yoyo930021
*Description:
    This function is used to check student exist.  Used promise.
*Usage:
    stu_id: student's system account.
    stu_pwd: student's system password.
    name: student's name.
    return:
        resolve(if student is exist): student's name.
        reject(if student isn't exist): "學校驗證錯誤".
*/
var checkStuAccount = function(stu_id, stu_pwd, name) {
    return new Promise(function(resolve, reject) {
        if(name != "") {
            resolve(name);
        } else {
            var j = request.jar();

            var formLogin = {
                url: "https://stuinfo.taivs.tp.edu.tw/Reg_Stu.ASP",
                form: {
                    "txtS_NO": stu_id,
                    "txtPerno": stu_pwd
                },
                jar: j,
                agentOptions: {
                    ca: fs.readFileSync(__dirname + "/cert/taivsca.crt"),
                },
                encoding: "binary",
                followAllRedirects: true
            };

            var formI = {
                url: "https://stuinfo.taivs.tp.edu.tw/stu_0.ASP",
                jar: j,
                agentOptions: {
                    ca: fs.readFileSync(__dirname + "/cert/taivsca.crt"),
                },
                encoding: "binary"
            };
            request.post(formLogin, function(err, res, body) {
                if (err) {
                    console.log(err);
                    reject("學校驗證錯誤");
                } else {
                    if (parseInt(res.headers['content-length']) < 2500) {
                        request(formI, function(err, res, body) {
                            if (err) {
                                console.log(err);
                                reject("學校驗證錯誤");
                            } else {
                                var $ = cheerio.load(iconv.decode(new Buffer(body, "binary"), "Big5"));
                                resolve([$("b").eq(4).text().substr(3).trim(), $("b").eq(1).text().substr(4, 4).tirm()]);
                            }
                        });
                    } else {
                        reject("學校驗證錯誤");
                    }
                }
            });
        }
    });
}

module.exports = {

    checkStuAccount: checkStuAccount
}
