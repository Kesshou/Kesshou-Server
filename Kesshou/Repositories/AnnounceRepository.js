/*
*Author: blackkite0206233
*Description: This file is used to control the announcement data.
*/

var models  = require('../../models');

var getAnnouncement = function(field, type) {
    var whereObj = {};
    whereObj[field] = type;
    var news = models.News.findAll({ where: whereObj }).then(function(result) {
        return result;
    })
    var i = news.length;
    while(i--) {
        news.file = models.News_file.findAll({ where: {news_key: news[news.length - i - 1].key} }).
        then(function(result) {
            return result;
        })
    }
    return news;
}

var getCollection = function(user) {
    var newsIDs = models.News_collection.findOne({ where: {user_id: user} }).then(function(result) {
        return result.get('news_id');
    })
    var newsID = newsIDs.split(",");

    var news = new Array();
    var i = newsID.length;
    while(i--) {
        news[newsID.length - i - 1] = This.getAnnouncement("news_id", newsID[newsID.length - i - 1]);
    }
    return news;
}

module.exports = {

    getAnnouncement: getAnnouncement,

    getCollection: getCollection
};
