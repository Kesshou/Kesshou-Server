/*
*Author: blackkite0206233
*Description: This file is used to get student's curriculum. Used web spider.
*/
var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"));
var cheerio = require("cheerio");
var fs = require("fs");
var iconv = require('iconv-lite');
var urlencode = require('urlencode');

/*
*Author: blackkite0206233
*Description:
    This function is used to get student curriculum.
*Usage:
    Class: student's class.
    return:
        resolve: a json type curriculum.
        reject: the reason of error.
*/
var getCurriculum = function(Class) {
    console.log(urlencode(Class, 'big5'));
    return new Promise(function(resolve, reject) {
        var formCurriculum = {
            url: "http://ta.taivs.tp.edu.tw/contact/show_class.asp?classn=" + urlencode(Class, 'big5'),
            encoding: "binary"
        };
        request.getAsync(formCurriculum).then(function(result) {
            if(!result.body) {
                reject("伺服器錯誤");
            }
            var $ = cheerio.load(iconv.decode(new Buffer(result.body, "binary"),"Big5"));
            var classCurriculum = [];
            var rows = $("table tr");
            for (var i = 1; i <= 5; i++) {
                classCurriculum.push([]);
            }

            for (var i = 2; i < rows.length; i++) {
                var timeString = rows.eq(i).children().eq(0).text();
                var startTime = timeString.split('～')[0].trim();
    			var	endTime = timeString.split('～')[1].trim();
                var cols = rows.eq(i).children();
                if(cols.length == 2) //跳過午休
                    continue;

                for(var j = 1; j < cols.length; j++) {
                    var htmlString = cols.eq(j).html();
                    var subject,teacher;

                    var subjectHtml = htmlString.match(/>.*(?=<br>)/),//[0].substr(1);
    					teacherHtml = htmlString.match(/<br>.*(?=<\/)/);//[0].substr(4);
                    if (subjectHtml && teacherHtml) {
                        subject = $('<textarea />').html(subjectHtml[0].substr(1)).text().trim();
                        teacher = $('<textarea />').html(teacherHtml[0].substr(4)).text().trim();
                    } else {
                        break;
                    }
                    var classInfo = {
                        start: startTime,
                        end: endTime,
                        subject: subject,
                        teacher: teacher
                    }
                    classCurriculum[j].push(classInfo);
                }
            }
            console.log(classCurriculum);
            resolve(classCurriculum);
        }).catch(function(error) {
            reject("伺服器錯誤");
        });
    });
}

module.exports = {

    getCurriculum: getCurriculum
};
