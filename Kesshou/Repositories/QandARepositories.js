/*
*Author: blackkite0206233
*Description: This file is used to control the Q and A data.
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

/*
*Author: blackkite0206233
*Description:
    This function is used to get the Q and A data.  Used promise.
*Usage:
    return:
        resolve: Q and A data.
        reject: the reason of error.
*/
var getQandA = function() {
    return new Promise(function(resolve, reject) {
        models.QandA.findAll().then(function(result){
            var QandA = [];
            for(var i = 0; i < result.length; i++) {
                QandA.push(result[i].get());
            }
            resolve(QandA);
        }).catch(function(error) {
            reject(error);
        });
    });
}

module.exports = {

    getQandA: getQandA
};
