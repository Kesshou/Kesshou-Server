/*
*Author: blackkite0206233
*Description: This file is used to control the announcement data.
*/

var models  = require('../../models');

/*
*Author: blackkite0206233
*Description:
    This function is used to return the announcement found by specific field and value.
*Usage:
    field: the field which you want to designate.
    value: the value which you hope the field's value is match
    return:
        news: the ammounce which was found.
*/
var getAnnouncement = function(field, value) {
    var whereObj = {};
    whereObj[field] = value;
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

/*
*Author: blackkite0206233
*Description:
    This function is used to return the announcement collected by user.
*Usage:
    user: the user's id.
    return:
        news: the ammounce which was found.
*/
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
