/*
*Author: blackkite0206233
*Description: This file is used to control picture via imgur API.
*/
var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));

/*
*Author: blackkite0206233
*Description:
    This function is used toupload picture.  Used promise.
*Usage:
    pic: the picture which you want to upload.
    return:
        resolve: the picture code responsed by imgur API.
        reject: the reason of error.
*/
var upload = function(pic) {
    var uploadPic = {
        url: "https://api.imgur.com/3/image",
        json: {
            image: pic
        },
        header: {
            "Authorization": "Client-ID bd7b71f2897844c",
            "Content-Type": "application/json"
        }
    }
    return new Promise(function(resolve, reject) {
        request.postAsync(uploadPic).then(function(result) {
            resolve(result.data.link);
        }).catch(function(error) {
            reject(error);
        })
    });
}
