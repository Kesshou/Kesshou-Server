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

var createArticle = function(article) {
    var Articles = {
        forum_id: article.forumID,
        sort: article.sort,
        title: article.title,
        content: article.content,
        date: article.date,
        memid: article.memid,
        hidden: 0
    };
    return new Promise(function(resolve, reject) {
        models.Article.create(Articles).then(function(result) {
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
