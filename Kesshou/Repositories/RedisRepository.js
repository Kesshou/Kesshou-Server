/*
*Author: blackkite0206233
*Description: This file is used to control the redis server.
*/
var Promise =require('bluebird');
var UserRepository = require('./UserRepository');
var redis = Promise.promisifyAll(require('redis'));

var existTime = 60 * 30; // 30 mins
var cache = redis.createClient();

cache.on('ready',function(err){
    console.log('ready');
});

cache.on("error", function(err) {
    console.log(err);
});

/*
*Author: blackkite0206233
*Description:
    This function is used to add a data to redis server.
*Usage:
    account: the user's account.
    token: a sentence contains 20 random characters.
*/
var set = function(token, account) {
    cache.set(token, account);
    cache.expire(token, existTime);
}

/*
*Author: blackkite0206233
*Description:
    This function is used to check if the token is valid and get user's account from redis server.  Used promise.
*Usage:
    token: a sentence contains 20 random characters.
    return: account.
    reject: error.

*/
var getAccount = function(token) {
    return new Promise(function(resolve, reject) {
        cache.getAsync(token).then(function(result) {
                resolve(result);
        });
    });
}

var getSchoolData = function(token) {
    return new Promise(function(resolve, reject) {
        getAccount(token).then(function(result) {
            return UserRepository.getUserInfo(result);
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            reject(error);
        })
    });
}

module.exports = {

        set: set,

        getAccount: getAccount,

        getSchoolData: getSchoolData
};