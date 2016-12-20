/*
 *Author: blackkite0206233,yoyo930021
 *Description: This file is used to get student's SeatState. Used web spider.
 */
var Promise = require("bluebird");
var https = require("https");
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
        var agentOptions = {
            host: 'libregist.taivs.tp.edu.tw',
            port: '443',
            path: '/',
            rejectUnauthorized: false
        };
        var agent = new https.Agent(agentOptions);
        var formSeatState = {
            url: "https://libregist.taivs.tp.edu.tw/currstat",
            encoding: "binary",
            agent: agent
        };
        request.getAsync(formSeatState).then(function (result) {
            if (!result.body) {
                reject("伺服器錯誤");
            }
            var $ = cheerio.load(new Buffer(result.body, "binary"), {
                decodeEntities: false
            });
            var seatState = "<!DOCTYPE html><html>" +
            "<head><meta charset=\"utf-8\" /><title>大安高工圖書館自修室座位管理系統</title><link href=\"/v1/static/seatstate/style.css\" rel=\"stylesheet\" type=\"text/css\" media=\"screen\" />" +
	        "<link rel=\"stylesheet\" type=\"text/css\" href=\"/v1/static/seatstate/jquery.confirm.css\" />" +
	        "<link rel=\"stylesheet\" type=\"text/css\" href=\"/v1/static/seatstate/jquery-ui-1.10.4.min.css\" />" +
	        "<script src=\"/v1/static/seatstate/jquery-1.11.1.min.js\"></script>" +
	        "<script src=\"/v1/static/seatstate/jquery-ui-1.10.4.min.js\"></script>" +
	        "<script src=\"/v1/static/seatstate/jquery.confirm.js\"></script>" +
            "</head>"
             + "<body>" + $("#content").html() + "</body></html>";
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