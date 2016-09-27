/*
*Author: blackkite0206233,yoyo930021
*Description: This file is used to control the class's data..
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

/*
*Author: blackkite0206233,yoyo930021
*Description:
    This function is used to get the use's graduated year.  Used promise.
*Usage:
    className: user's class name.
    return:
        resolve: user's graduated_ year.
        reject: the reason of error.
*/
var getFinishYear = function(className) {
    return new Promise(function(resolve, reject) {
        if(className == "") {
            resolve("");
        } else {
            className = className.substr(2, 1);
            models.Class.findOne({ where: {class_name: className} }).then(function(result){
                resolve(result.get("graduated_year"));
            }).catch(function(error) {
                reject(error);
            });
        }
    });
}

module.exports = {

    getFinishYear: getFinishYear
};
