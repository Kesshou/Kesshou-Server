/*
*Author: blackkite0206233
*Description: This file is used to control the related link data.
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

/*
*Author: blackkite0206233
*Description:
    This function is used to get the related link data.  Used promise.
*Usage:
    return:
        resolve: related link data.
        reject: the reason of error.
*/
var getRelatedLink = function() {
    return new Promise(function(resolve, reject) {
        models.Relatedlink.findAll().then(function(result){
            var Relatedlink = [];
            for(var i = 0; i < result.length; i++) {
                Relatedlink.push(result[i].get());
            }
            resolve(Relatedlink);
        }).catch(function(error) {
            reject(error);
        });
    });
}

module.exports = {

    getRelatedLink: getRelatedLink
};
