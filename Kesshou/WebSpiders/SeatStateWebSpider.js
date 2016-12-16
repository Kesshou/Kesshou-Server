/*
 *Author: blackkite0206233,yoyo930021
 *Description: This file is used to get student's SeatState. Used web spider.
 */
var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"));
var cheerio = require("cheerio");
var iconv = require('iconv-lite');
var urlencode = require('urlencode');

/*
*Author: blackkite0206233,yoyo930021
*Description:
    This function is used to get library SeatState.
*Usage:
    return:
        resolve: a html type SeatState.
        reject: the reason of error.
*/
var getSeatState = function () {
    return new Promise(function (resolve, reject) {
        var formSeatState = {
            url: "https://libregist.taivs.tp.edu.tw/currstat",
            encoding: "binary",
            agent: new https.Agent({
                host: 'libregist.taivs.tp.edu.tw',
                port: '443',
                path: '/',
                rejectUnauthorized: false
            })
        };
        request.getAsync(formSeatState).then(function (result) {
            if (!result.body) {
                reject("伺服器錯誤");
            }
            var $ = cheerio.load(new Buffer(result.body, "binary"), {
                decodeEntities: false
            });
            var seatState = "<!DOCTYPE html><html>" + $("head").html() + "<body>" + $("#content").html() + "</body></html>";
            resolve(seatState);
        }).catch(function (error) {
            console.log(error);
            reject("伺服器錯誤");
        });
    });
}

module.exports = {

    getSeatState: getSeatState
};