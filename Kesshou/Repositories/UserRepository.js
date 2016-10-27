/*
*Author: blackkite0206233,yoyo930021
*Description: This file is used to control the user's data..
*/
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../../models'));

/*
*Author: blackkite0206233,yoyo930021
*Description:
    This function is used to get the use's password.  Used promise.
*Usage:
    account: user's account(email).
    return:
        resolve: user's password.
        reject: "帳號有誤".
*/
var getUserPassword = function(account) {
    return new Promise(function(resolve, reject) {
        models.Account.findOne({ where: {email: account} }).then(function(result){
            if(result) {
                resolve(result.get("pwd"));
            } else {
                reject("帳號有誤");
            }
        }).catch(function(error) {
            reject("帳號有誤");
        });
    });
}

/*
*Author: blackkite0206233,yoyo930021
*Description:
    This function is used to check if database has the same nick.  Used promise.
*Usage:
    nick: user's nick.
    oldNick: if it didn't has oldNick, it is "".
    return:
        resolve: Nan.
        reject: "暱稱已被使用".
*/
var checkSameNick = function(nick) {
    return new Promise(function(resolve, reject) {
        models.Account.findOne({ where: {nick: nick} }).then(function(result) {
            if(result) {
                reject("暱稱已被使用");
            } else {
                resolve();
            }
        }).catch(function(error) {
            resolve();
        });
    });
}

/*
*Author: blackkite0206233,yoyo930021
*Description:
    This function is used to create a new user.  Used promise.
*Usage:
    email: user's email(account).
    password: user's password.
    userGroup: user's status(student or graduated or outside).
    schoolAccount: user's school account(optional).
    schoolPwd: user's school password(optional).
    nick: user's nick.
    return:
        resolve: Nan.
        reject: error.
*/
var createUser = function (email, password, userGroup, schoolAccount, schoolPwd, nick, name, userClass, finishYear) {
    return new Promise(function(resolve, reject) {
        models.Group.findOne({ where: {comment: userGroup} }).then(function(group){
            var NewAccount = {
                email: email,
                pwd: password,
                group_id: group.get("id"),
                school_account: schoolAccount,
                school_pwd: schoolPwd,
                nick: nick,
                name: name,
                class: userClass,
                finish_year: finishYear
            };
            models.Account.create(NewAccount).then(function(account) {
                resolve();
            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        }).catch(function(error) {
            console.log(error);
            reject(error);
        });
    });
}

/*
*Author: blackkite0206233,yoyo930021
*Description:
    This function is used to update user's info.  Used promise.
*Usage:
    account: user's old account.
    newSchoolPwd: user's new school password(optional).
    newNick: user's new nick.
    newPassword: user's new password.
    newEmail: user's new email.
    newName: user's new name.
    return:
        resolve: Nan.
        reject: error.
*/
var updateUserInfo = function (account, newSchoolPwd, newNick, newPassword, newEmail, newName) {
    return new Promise(function(resolve, reject){
        models.Account.findOne({ where: {email: account} }).then(function(result){
            return result.update({school_pwd: newSchoolPwd, nick: newNick, pwd: newPassword, email: newEmail, name: newName});
        }).then(function(result){
            resolve();
        }).catch(function(error){
            console.log(error);
            reject(error);
        });
    });

}

/*
*Author: blackkite0206233,yoyo930021
*Description:
    This function is used to get user's information.  Used promise.
*Usage:
    account: user's account.
    return:
        resolve: user's infomation.
        reject: error.
*/
var getUserInfo = function (account) {
    return new Promise(function(resolve, reject) {
        models.Account.findOne({ where: {email: account} }).then(function(result) {
            resolve(result.get());
        }).catch(function(error) {
            reject(error);
        });
    });

}

module.exports = {

    getUserPassword: getUserPassword,

    checkSameNick: checkSameNick,

    createUser: createUser,

    updateUserInfo: updateUserInfo,

    getUserInfo: getUserInfo
};
