/*
*Author: blackkite0206233
*Description: This file is used to control the redis server.
*/
var redis = require('redis');

var existTime = 60 * 60 * 24 * 30; // 30 days
var cache = redis.createClient();

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
function set(account, token) {
    cache.set(token, account);
    cache.expire(token, existTime);
}

/*
*Author: blackkite0206233
*Description:
    This function is used to check if the token is valid and get user's account from redis server.
*Usage:
    token: a sentence contains 20 random characters.
    reply: the user's account, if the token is not valid then the reply is "".

*/
function getAccount(token) {
    cache.get(token, function(err, reply) {
        return reply;
    });
}

module.exports = RedisRepository;
