/*
*Author: blackkite0206233
*Description: This file is used to control the forum list data.
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

var getForumliist = function() {
    return new Promise(function(resolve, reject) {
        models.Forum.findAll().then(function(result) {
            var ForumLists = [];
            for(var i = 0; i < result.length; i++)
                ForumLists.push(result[i].get());
            resolve(ForumLists);
        }).catch(function(error) {
            reject(error);
        });
    });
}

var searchForumlist = function(name) {
    return new Promise(function(resolve, reject) {
        models.Forum.findAll({ where: {name: name} }).then(function(result) {
            var ForumLists = [];
            for(var i = 0; i < result.length; i++)
                ForumLists.push(result[i].get());
            resolve(ForumLists);
        }).catch(function(error) {
            reject(error);
        });
    });
}

var createForum = function(name) {
    return new Promise(function(resolve, reject) {
        models.Forum.create({name: name}).then(function(reault) {
            resolve();
        }).catch(function (error) {
            reject(error);
        });
    });
}

module.exports = {

    getForumliist: getForumliist,

    searchForumlist: searchForumlist,

    createForum: createForum

};
