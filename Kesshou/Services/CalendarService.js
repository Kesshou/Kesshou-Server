/*
*Author: blackkite0206233
*Description: This file is used to parse the ical file.
*/
var ical = require('ical');
var Promise = require('bluebird');

/*
*Author: blackkite0206233
*Description:
    This function is used to parse the ical file to json.  Used promise.
*Usage:
    url: a ical file's url.
    return:
        resolve: a json type calendar.
        reject: the reason of error.
*/
var getClendar = function(url) {
    return new Promise(function(resolve, reject) {
        ical.fromURL(url, {}, function(err, data) {
            if(err) {
                reject(err);
            } else {
                var calenders = [];
                for(var i in data) {
                    var calendar = {
                        date : data[i].start.getFullYear() + "/" + (data[i].start.getMonth() + 1) + "/" + data[i].start.getDate(),
                        content : data[i].summary
                    }
                    calenders.push(calendar);
                }
                resolve(calenders);
            }
        });
    });
}

module.exports = {

    getClendar: getClendar
}
