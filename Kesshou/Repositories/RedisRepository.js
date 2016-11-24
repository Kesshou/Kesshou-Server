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
    cache.set(account, token);
    cache.expire(account, existTime);
}

var checkAccount = function(token, account) {
    var Token = token;
    var Account = account;
    this.getAccount(Account).then(function(result) {
        return cache.delAsync(result);
    }).then(function() {
        return cache.delAsync(Account);
    }).then(function() {
        set(Token, Account);
    }).catch(function() {
        set(Token, Account);
    });
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
            if(result)
                resolve(result);
            else
                reject("token過期");
        });
    });
}

/*
*Author: blackkite0206233
*Description:
    This function is used to  get user's data.  Used promise.
*Usage:
    token: a sentence contains 20 random characters.
    return: account.
    reject: error.
*/
var getUserData = function(token) {
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

    checkAccount: checkAccount,

    getAccount: getAccount,

    getUserData: getUserData
};
