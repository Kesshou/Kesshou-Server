/*
*Author: blackkite0206233
*Description: This file is used to control the forum response data.
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

/*
*Author: blackkite0206233
*Description:
    This function is used to get the article's response data.  Used promise.
*Usage:
    articleId: article's id.
    return:
        resolve: article's response.
        reject: the reason of error.
*/
var getForumresponse = function(articleId) {
    return new Promise(function(resolve, reject) {
        models.Response.findAll({where: {article_id: articleId}}).then(function(result) {
            var FormResponses = [];
            for(var i = 0; i < result.length; i++)
                FormResponses.push(result[i].get());
            resolve(FormResponses);
        }).catch(function(error) {
            reject(error);
        });
    });
}

/*
*Author: blackkite0206233
*Description:
    This function is used to create a new article's response.  Used promise.
*Usage:
    response: response content.
    return:
        reject: the reason of error.
*/
var createResponse = function(response) {
    var Responses = {
        article_id: response.articleID,
        sort: response.sort,
        content: response.content,
        date: response.date,
        memid: response.memid,
        hidden: 0
    }
    return new Promise(function(resolve, reject) {
        models.Response.create(response).then(function(result) {
            resolve();
        }).catch(function(error) {
            reject(error);
        });
    });
}

var like = function(response) {
    var Responses = {
        article_id: response.articleID,
        sort: response.sort,
        content: response.content,
        date: response.date,
        memid: response.memid,
        hidden: 0
    }
    return new Promise(function(resolve, reject) {
        models.Response.findAll({where: {article_id: Responses.article_id, sort: Responses.sort,
                                                                content: Responses.content, memid: Responses.memid}}).then(function(result) {
            if(result) {
                models.Response.destroy({where: {article_id: Responses.article_id, sort: Responses.sort,
                                                                        content: Responses.content, memid: Responses.memid}}).then(function() {
                    resolve();
                }).catch(function(error) {
                    reject(error);
                });
            } else {
                models.Response.create(response).then(function(result) {
                    resolve();
                }).catch(function(error) {
                    reject(error);
                });
            }
        }).catch(function(error) {
            reject(error);
        })
    });
}

var vote = function(response) {
    var Responses = {
        article_id: response.articleID,
        sort: response.sort,
        content: response.content,
        date: response.date,
        memid: response.memid,
        hidden: 0
    }
    return new Promise(function(resolve, reject) {
        models.Response.findAll({where: {article_id: Responses.article_id, sort: Responses.sort,
                                                                memid: Responses.memid}}).then(function(result) {
            if(result) {
                result.update(Responses).then(function() {
                    resolve();
                }).catch(function(error) {
                    reject(error);
                });
            } else {
                models.Response.create(Responses).then(function(result) {
                    resolve();
                }).catch(function(error) {
                    reject(error);
                });
            }
        }).catch(function(error) {
            reject(error);
        })
    });
}

module.exports = {

    getForumresponse: getForumresponse,

    createResponse: createResponse,

    like: like,

    vote: vote

};
