/*
*Author: blackkite0206233,yoyo930021
*Description: This file is used to control the group's data.
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

var getGroupID = function(groupName) {
    return new Promise(function(resolve, reject) {
        models.Group.findOne({ where: {name: groupName} }).then(function(result) {
            resolve(result.get("id"));
        }).catch(function(error) {
            reject(error);
        });
    });
}

var getGroupName = function(groupID) {
    return new Promise(function(resolve, reject) {
        models.Group.findOne({ where: {id: groupID} }).then(function(result) {
            resolve(result.get("name"));
        }).catch(function(error) {
            reject(error);
        });
    });
}

module.exports = {

    getGroupID: getGroupID,

    getGroupName: getGroupName
};
