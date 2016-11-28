/*
*Author: blackkite0206233,yoyo930021
*Description: This file is used to control the group's data.
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

/*
*Author: blackkite0206233
*Description:
    This function is used to get group's id.
*Usage:
    groupName: user's group name.
    return:
        resolve: user's group id.
        reject: error.
*/
var getGroupID = function(groupName) {
    return new Promise(function(resolve, reject) {
        models.Group.findOne({ where: {name: groupName} }).then(function(result) {
            resolve(result.get("id"));
        }).catch(function(error) {
            reject(error);
        });
    });
}

/*
*Author: blackkite0206233
*Description:
    This function is used to get group's name.
*Usage:
    groupName: user's group id.
    return:
        resolve: user's group name.
        reject: error.
*/
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
