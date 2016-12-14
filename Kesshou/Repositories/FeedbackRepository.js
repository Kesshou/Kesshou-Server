/*
*Author: blackkite0206233
*Description: This file is used to control the feedback data.
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

/*
*Author: blackkite0206233
*Description:
    This function is used to add the feedback data.  Used promise.
*Usage:
    return:
        reject: the reason of error.
*/
var postFeedback = function(feedback) {
    return new Promise(function(resolve, reject) {
        models.Feedback.create(feedback).then(function(){
            resolve();
        }).catch(function(error) {
            reject(error);
        });
    });
}

module.exports = {

    postFeedback: postFeedback
};
