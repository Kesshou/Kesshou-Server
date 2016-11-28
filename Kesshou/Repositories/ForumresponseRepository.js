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
        response_id: responseID,
        sort: sort,
        content: content,
        date: date,
        memid: memid
    }
    return new Promise(function(resolve, reject) {
        models.Response.create(response).then(function(result) {
            resolve();
        }).catch(function(error) {
            reject(error);
        });
    });
}

module.exports = {

    getForumresponse: getForumresponse,

    createResponse: createResponse

};
