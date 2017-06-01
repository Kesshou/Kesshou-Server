/*
*Author: blackkite0206233
*Description: This file is used to get student's score. Used web spider.
*/
var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));
var fs = Promise.promisifyAll(require("fs"));
var iconv = require("iconv-lite");
var cheerio = require("cheerio");
var urlencode = require('urlencode');

var j = request.jar();
var ca;

/*
*Author: blackkite0206233
*Description:
    This function is used to login school's website.  Used promise.
*Usage:
    schoolAccount: student's school account.
    schoolPwd: student's school password.
    return:
        resolve: a login cookie.
        reject: the reason of error.
*/
var login = function(schoolAccount, schoolPwd) {
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
            resolve(result);
        }).catch(function(error) {
            reject(error);
        });
    });
}

/*
*Author: blackkite0206233
*Description:
    This function is used to get student's history score. Used promise.
*Usage:
    schoolAccount: student's school account.
    schoolPwd: student's school password.
    grade: student's grade.
    semester: semester.
    return:
        resolve: a json type history score.
        reject: the reason of error.
*/
var getHistoryScore = function(schoolAccount, schoolPwd, grade, semester) {
    return new Promise(function(resolve, reject) {
        login(schoolAccount, schoolPwd).then(function(result) {
            var formScore = {
                url: "https://stuinfo.taivs.tp.edu.tw/stusn.asp",
                form: {
                    "GRA": grade,
                },
                agentOptions: {
                    ca: ca,
                },
                encoding: "binary",
                jar: j
            };
            return request.postAsync(formScore);
        }).then(function(result) {
            var scoreList = [];
            var $ = cheerio.load(iconv.decode(new Buffer(result.body, "binary"), "Big5"));
            var rows = $("table tr");
            for(var i = 4; i < rows.length; i++) {
                var score = {};
                var sub = rows.eq(i).children();
                switch (semester) {
                    case "1":
                        if(sub.eq(1).text().trim()) {
                            score.subject = sub.eq(0).text().trim();
                            score.type = sub.eq(1).text().trim().substr(0, 1);
                            score.credit = sub.eq(2).text().trim().substr(1);
                            score.score = parseFloat(sub.eq(3).children().eq(0).text().trim());
                            score.qualify = parseFloat(sub.eq(6).children().eq(0).text().trim());
                            scoreList.push(score);
                        }
                        break;
                    case "2":
                        if(sub.eq(7).text().trim()) {
                            score.subject = sub.eq(0).text().trim();
                            score.type = sub.eq(7).text().trim().substr(0, 1);
                            score.credit = sub.eq(8).text().trim().substr(1);
                            score.score = parseFloat(sub.eq(9).children().eq(0).text().trim());
                            score.qualify = parseFloat(sub.eq(12).children().eq(0).text().trim());
                            scoreList.push(score);
                        }
                        break;
                    default:
                        break;
                }
            }
            console.log(scoreList);
            resolve(scoreList);
        }).catch(function(error) {
            reject(error);
        });
    });
}

/*
*Author: blackkite0206233
*Description:
    This function is used to get student's exam score. Used promise.
*Usage:
    schoolAccount: student's school account.
    schoolPwd: student's school password.
    semester: semester.
    return:
        resolve: a json type exam score.
        reject: the reason of error.
*/
var getSectionalExamScore = function(schoolAccount, schoolPwd, semester) {
    var scoreList = [];
    var score = {};
    return new Promise(function(resolve, reject) {
        login(schoolAccount, schoolPwd).then(function(result) {
            var formScore = {
                url: "https://stuinfo.taivs.tp.edu.tw/stscore.asp",
                agentOptions: {
                    ca: ca,
                },
                encoding: "binary",
                jar: j
            };
            return request.getAsync(formScore);
        }).then(function(result) {
            var scoreList = [];
            var $ = cheerio.load(iconv.decode(new Buffer(result.body, "binary"), "Big5"));
            var rows = $("table tr");
            for(var i = 2; i < rows.length; i++) {
                var score = {};
                var sub = rows.eq(i).children();
                switch (semester) {
                    case "1":
                        if(sub.eq(2).text().trim() || sub.eq(3).text().trim() || sub.eq(4).text().trim()) {
                            score.subject = sub.eq(0).text().trim();
                            score.first_section = parseFloat(sub.eq(2).text().trim());
                            score.second_section = parseFloat(sub.eq(3).text().trim());
                            score.last_section = parseFloat(sub.eq(4).text().trim());
                            score.performance = parseFloat(sub.eq(5).text().trim());
                            score.average = parseFloat(sub.eq(6).text().trim());
                            scoreList.push(score);
                        }
                        break;
                    case "2":
                        if(sub.eq(7).text().trim() || sub.eq(8).text().trim() || sub.eq(9).text().trim()) {
                            score.subject = sub.eq(0).text().trim();
                            score.first_section = parseFloat(sub.eq(7).text().trim());
                            score.second_section = parseFloat(sub.eq(8).text().trim());
                            score.last_section = parseFloat(sub.eq(9).text().trim());
                            score.performance = parseFloat(sub.eq(10).text().trim());
                            score.average = parseFloat(sub.eq(11).text().trim());
                            scoreList.push(score);
                        }
                        break;
                    default:
                        break;
                }
            }
            console.log(scoreList);
            resolve(scoreList);
        }).catch(function(error) {
            reject(error);
        });
    });
}

module.exports = {

    getHistoryScore: getHistoryScore,

    getSectionalExamScore: getSectionalExamScore
};
