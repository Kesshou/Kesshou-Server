/*
*Author: blackkite0206233
*Description: This file is used to control the forum article data.
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

var getForumarticle = function(forumlistId) {
    return new Promise(function(resolve, reject) {
        models.Article.findAll({where: {forum_id: forumlistId}}).then(function(result) {
            var FormArticles = [];
            for(var i = 0; i < result.length; i++)
                FormArticles.push(result[i].get());
            resolve(FormArticles);
        }).catch(function(error) {
            reject(error);
        });
    });
}

var searchForumarticle = function(forumlistId, title) {
    return new Promise(function(resolve, reject) {
        models.Article.findAll({ where: {forum_id: forumlistId, title: title} }).then(function(result) {
            var FormArticles = [];
            for(var i = 0; i < result.length; i++)
                FormArticles.push(result[i].get());
            resolve(FormArticles);
        }).catch(function(error) {
            reject(error);
        });
    });
}

var createArticle = function(forumlistId, sort, title, content, date, memid) {
    var article = {
        forum_id: forumlistId,
        sort: sort,
        title: title,
        content: content,
        date: date,
        memid, memid
    };
    return new Promise(function(resolve, reject) {
        models.Article.create(article).then(function(result) {
            resolve();
        }).catch(function(error) {
            reject();
        });
    });
}

module.exports = {

    getForumarticle: getForumarticle,

    searchForumarticle: searchForumarticle,

    createArticle: createArticle

};
