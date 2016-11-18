/*
*Author: blackkite0206233
*Description: This file is used to control the forum response data.
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

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

var createResponse = function(articleId, sort, content, date, memid) {
    var response = {
        article_id: articleId,
        sort: sort,
        content: content,
        date: date,
        memid: memid
    }
    return new Promise(function(resolve, reject) {
        models.Response.create(response).then(function(result) {
            resolve();
        }).catch(function(error) {
            reject();
        });
    });
}

module.exports = {

    getForumresponse: getForumresponse,

    createResponse: createResponse

};
