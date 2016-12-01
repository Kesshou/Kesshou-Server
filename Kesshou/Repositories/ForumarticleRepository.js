/*
*Author: blackkite0206233
*Description: This file is used to control the forum article data.
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

/*
*Author: blackkite0206233
*Description:
    This function is used to get the forum's article.  Used promise.
*Usage:
    forumlistId: forum's id.
    return:
        resolve: forum's article.
        reject: the reason of error.
*/
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

/*
*Author: blackkite0206233
*Description:
    This function is used to search the forum's article.  Used promise.
*Usage:
    forumlistId: forum's id.
    title: article's title.
    return:
        resolve: forum's article.
        reject: the reason of error.
*/
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

/*
*Author: blackkite0206233
*Description:
    This function is used to get article content via article's id.  Used promise.
*Usage:
    articleid: article's id.
    return:
        resolve: forum's article.
        reject: the reason of error.
*/
var getArticleById = function(articleid) {
    return new Promise(function(resolve, reject) {
        nodels.Article.findOne({ where: {id: articleid} }).then(function(result) {
            resolve(result.get());
        }).catch(function(error) {
            reject(error);
        })
    });
}

/*
*Author: blackkite0206233
*Description:
    This function is used to create a new article.  Used promise.
*Usage:
    article: article content.
    return:
        reject: the reason of error.
*/
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
            reject(error);
        });
    });
}

module.exports = {

    getForumarticle: getForumarticle,

    searchForumarticle: searchForumarticle,

    getArticleById: getArticleById,

    createArticle: createArticle

};
