/*
*Author: yoyo930021
*Description: This file is used to check if the student is exist.
*/
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var iconv = require('iconv-lite');

/*
*Author: yoyo930021
*Description:
    This function is used to check student exist.
*Usage:
    stu_id: student system account.
    stu_pwd: student system password.
    callback: then do.
*/
var checkStuAccount = function(stu_id, stu_pwd, callback) {

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
            callback("")
        } else {
            if (parseInt(res.headers['content-length']) < 2500) {
                request(formI, function(err, res, body) {
                    if (err) {
                        console.log(err);
                        callback("");
                    } else {
                        var $ = cheerio.load(iconv.decode(new Buffer(body, "binary"), "Big5"));
                        callback($("b").eq(4).text().substr(3));
                    }
                });
            } else {
                callback("");
            }
        }
    });

}

module.exports = {

    checkStuAccount: checkStuAccount
}
