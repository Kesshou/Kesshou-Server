var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));

var upload = function(pic) {
    var uploadPic = {
        url: "https://api.imgur.com/3/image",
        json: {
            image: pic
        }
    }
    return new Promise(function(resolve, reject) {
        request.postAsync(uploadPic).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            reject();
        })
    });
}
