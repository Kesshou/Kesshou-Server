/*
*Author: blackkite0206233
*Description: This file is used to control the announcement data.
*/
var Promise = require('bluebird');
var cheerio = require("cheerio");
var models  = Promise.promisifyAll(require('../../models'));

/*
*Author: blackkite0206233
*Description:
    This function is used to return the announcement found by specific field and value.  Used promise.
*Usage:
    field: the field which you want to designate.
    value: the value which you hope the field's value is match
    return:
        resolve: the announce which was found.
        reject: the reason of error.
*/
var getAnnouncement = function(field, value) {
    return new Promise(function(resolve, reject) {
        var whereObj = {};
        whereObj[field] = value;
        models.News.findAll({ where: whereObj, order: [['id', 'DESC']] }).then(function(result) {
            var announce = [];
            var promises = [];
            if (announce) {
                for(var i = 0; i < result.length; i++) {
                    announce.push(result[i].get());
                    promises.push(getAnnouncementFile(announce[i]));
                    promises.push(getAnnouncementSummary(announce[i]));
                }
                Promise.all(promises).then(function(result) {
                    console.log(announce);
                    resolve(announce);
                });
            } else {
                resolve("don't have announce");
            }
        }).catch(function(error) {
            reject(error);
        });
    });
}

/*
*Author: blackkite0206233
*Description:
    This function is used to add the announcement's files or images found by announcement's id
        to the announcement object.  Used promise.
*Usage:
    news: the announcement's id.
*/
var getAnnouncementFile = function(news) {
    return new Promise(function(resolve, reject) {
        models.News_file.findAll({ where: {news_key: news.id} }).then(function(result) {
            for(var i = 0; i < result.length; i++) {
                news.file = result[i].get();
            }
            resolve();
        }).catch(function(error) {
            news.file = "";
            resolve();
        });
    });
}

/*
*Author: yoyo930021
*Description:
    This function is add body convert to summary.
*Usage:
    news: the announcement's id.
*/
var getAnnouncementSummary = function(news) {
    return new Promise(function(resolve, reject) {
        var $ = cheerio.load(new Buffer(news.body), {decodeEntities: false});
        console.log("Tag: "+$("*").text());
        news.summary = $("*").text();
        resolve();
    });
}

module.exports = {

    getAnnouncement: getAnnouncement,

};
