/*
*Author: blackkite0206233
*Description: This file is used to control the redis server.
*/
var redis = require('redis');

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
    cache.expire(account, existTime);
}

/*
*Author: blackkite0206233
*Description:
    This function is used to check if the token is valid and get user's account from redis server.
*Usage:
    token: a sentence contains 20 random characters.
    reply: the user's account, if the token is not valid then the reply is "".

*/
var getAccount = function(token) {
    cache.get(token, function(err, reply) {
        return reply;
    });
}

module.exports = {

        set: set,

        getAccount: getAccount
};
